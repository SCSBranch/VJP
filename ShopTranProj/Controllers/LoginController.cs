using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace ShopTranProj.Controllers
{
    public class BaseController : Controller
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Session["Guid"] != null)
            {
                base.OnActionExecuting(filterContext);
            }
            else
            {
                ViewBag.serverExit = "true";
            }
        }
    }

    public class LoginController : Controller
    {
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public string generate_guivalue(string userId)
        {
            dynamic gui_detail = new JObject();

            System.Web.HttpContext.Current.Session["Guid"] = "";

            Guid guid_value = new Guid(ShopTranProj.Common.ControllerExtensionMethods.GetGuid(this));

            bool boo_guid = ValidateGuid(guid_value.ToString());

            if (boo_guid == true)
                System.Web.HttpContext.Current.Session["Guid"] = guid_value.ToString();
            else
                System.Web.HttpContext.Current.Session["Guid"] = "";

            string ClientIP = IPNetworking.GetIP4Address();

            Common.Global.guidvalue = System.Web.HttpContext.Current.Session["Guid"].ToString();

            gui_detail.gui_val = Common.Global.guidvalue;
            gui_detail.ip_address = ClientIP;

            return JsonConvert.SerializeObject(gui_detail);

        }

        bool ValidateGuid(string theGuid)
        {
            try { Guid aG = new Guid(theGuid); }
            catch { return false; }

            return true;
        }

        public class IPNetworking
        {
            public static string GetIP4Address()
            {
                string IP4Address = String.Empty;

                foreach (IPAddress IPA in Dns.GetHostAddresses(System.Web.HttpContext.Current.Request.UserHostAddress))
                {
                    if (IPA.AddressFamily.ToString() == "InterNetwork")
                    {
                        IP4Address = IPA.ToString();
                        break;
                    }
                }

                if (IP4Address != String.Empty)
                {
                    return IP4Address;
                }

                foreach (IPAddress IPA in Dns.GetHostAddresses(Dns.GetHostName()))
                {
                    if (IPA.AddressFamily.ToString() == "InterNetwork")
                    {
                        IP4Address = IPA.ToString();
                        break;
                    }
                }
                return IP4Address;
            }
        }

        [HttpPost]
        public string getSecurityQuestion(string userId)
        {
            dynamic ValidUser_detail = new JObject();
            try
            {
                sqlwebservice.ContextVO context = new sqlwebservice.ContextVO();
                sqlwebservice.Sql_WebService_Content wbs = new sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();
                }
                wbs.obj_Sql_Service = getSecurityQuestionVal(userId);

                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "POLICY", wbs);

                if (response.arr_resultList == null)
                {
                    ValidUser_detail.result = "User ID is not Valid";
                }
                else
                {
                    XDocument doc = new XDocument();
                    string obj = "<root>" + response.arr_resultList + "</root>";
                    doc = XDocument.Parse(obj);

                    var RecordDetail = from Record in doc.Descendants("Record") select Record;
                    foreach (XElement rec in RecordDetail)
                    {
                        ValidUser_detail.result = rec.Element("security_ques").Value;
                        ValidUser_detail.success = true;
                        break;
                    }
                }

            }
            catch (Exception ex)
            {
                ValidUser_detail.result = ex.Message;
                ValidUser_detail.success = false;

            }

            return JsonConvert.SerializeObject(ValidUser_detail);
        }
        public sqlwebservice.Sql_WebService[] getSecurityQuestionVal(string userId)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "Select user_id,security_ques from  user_details where user_id='" + userId + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }

        [HttpPost]
        public string getUserlogDetails(string orgnId, string locnId, string userId, string logId)
        {
            dynamic ValidUser_detail = new JObject();
            try
            {
                string ip_address = IPNetworking.GetIP4Address();
                sqlwebservice.ContextVO context = new sqlwebservice.ContextVO();
                sqlwebservice.Sql_WebService_Content wbs = new sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();
                }
                wbs.obj_Sql_Service = getUserlogDetailResponse(orgnId, locnId, userId, ip_address, logId);

                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "POLICY", wbs);
                if (response.arr_resultList == null)
                {
                    string errmsg = response.errorList[0].errorDescription.ToString();
                    string encoded_msg = Common.Util.Html_Encode(errmsg);
                    throw new Exception(encoded_msg);
                }
                else
                {
                    XDocument doc = new XDocument();
                    string obj = "<root>" + response.arr_resultList + "</root>";
                    doc = XDocument.Parse(obj);

                    var RecordDetail = from Record in doc.Descendants("Record") select Record;
                    foreach (XElement rec in RecordDetail)
                    {
                        ValidUser_detail.result = rec.Element("log_row_id").Value;
                        ValidUser_detail.success = true;
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                ValidUser_detail.result = ex.Message;
                ValidUser_detail.success = false;

            }
            return JsonConvert.SerializeObject(ValidUser_detail);
        }
        public sqlwebservice.Sql_WebService[] getUserlogDetailResponse(string orgnId, string locnId, string userId, string ip_address, string logId)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "EXEC insupd_user_log '" + orgnId + "','" + locnId + "','" + userId + "','','','" + ip_address + "','','" + logId + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }

        [HttpPost]
        public string update_user_access_log(string logout_time, string logout_reason, int rowno)
        {
            dynamic user_log_rowno = new JObject();
            try
            {
                sqlwebservice.ContextVO context = new sqlwebservice.ContextVO();
                sqlwebservice.Sql_WebService_Content wbs = new sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();
                }

                wbs.obj_Sql_Service = user_log(logout_time, logout_reason, rowno);

                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "POLICY", wbs);

                if (response.errorList != null)
                {
                    string errmsg = response.errorList[0].errorDescription.ToString();
                    string encoded_msg = Common.Util.Html_Encode(errmsg);
                    throw new Exception(encoded_msg);
                }
            }
            catch (Exception ex)
            {
            }
            return "";
        }

        public sqlwebservice.Sql_WebService[] user_log(string logout_time, string logout_reason, int rowno)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "update user_login_log set logout_datetime = '" + logout_time + "',logout_reason ='" + logout_reason + "' where log_rowid = '" + rowno + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }

    }
}