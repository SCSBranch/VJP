using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace ShopTranProj.Controllers
{
    public class AdminController : Controller
    {
        // GET: Admin

        public ActionResult MasterDefinition()
        {
            return View();
        }

        public ActionResult RoleDefinition()
        {
            return View();
        }

        public ActionResult UserDefinition()
        {
            return View();
        }


       
        public string file_name = "";

        [HttpPost]
        public string file_load(HttpPostedFileBase file)
        {
            dynamic get_file = new JObject();
            try
            {
                if (file != null && file.ContentLength > 0)
                {

                    file_name = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + System.IO.Path.GetExtension(file.FileName);

                    Common.Global.file_name = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + System.IO.Path.GetExtension(file.FileName);

                    Common.Global.file_name = Common.Global.file_name.Replace("/", "_");

                    Common.Global.file_name = Common.Global.file_name.Replace("\\", "_");

                    Common.Global.path = System.IO.Path.Combine(
                         Server.MapPath("/ws/Templates/"), Common.Global.file_name);
                    file.SaveAs(Common.Global.path);

                    get_file.file_log = file_name;
                    get_file.success = true;
                    //get_file.msg = "File Uploaded successfully";
                    get_file.path = Common.Global.path;

                }

            }
            catch (Exception ex)
            {
                get_file.msg = ex.Message;
                get_file.success = false;
                //Common.LogTest.TestClass.getLogError(
                //  Request.RequestContext.RouteData.Values["controller"].ToString(),
                //  MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            string file_err = JsonConvert.SerializeObject(get_file);

            return file_err;
        }

        // Load module name combo

        [HttpPost]
        public string get_module_name(string receiveData)
        {
            dynamic user_value = new JObject();
            try
            {
                dynamic receive_data = JObject.Parse(receiveData);

                sqlwebservice.ContextVO context = new sqlwebservice.ContextVO();
                sqlwebservice.Sql_WebService_Content wbs = new sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();

                }


                wbs.obj_Sql_Service = get_grid_combo_dtl();

                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "Aspire", wbs);
                if (response.errorList != null)
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

                    if (response.arr_resultList != null)
                    {
                        doc = XDocument.Parse(obj);
                        var set1rec = (from set1 in doc.Descendants("set1") select set1);

                        DataTable dt_set1 = new DataTable();
                        if (set1rec.Count() > 0)
                        {
                            var set1_first = set1rec.Descendants("Record").First();

                            foreach (XElement xe in set1_first.Descendants())
                                dt_set1.Columns.Add(xe.Name.ToString(), typeof(string));


                            XElement setup1 = (from set1 in doc.Descendants("set1") select set1).First();
                            foreach (XElement xe2 in setup1.Descendants("Record"))
                            {
                                DataRow dr = dt_set1.NewRow();
                                int i = 0;
                                foreach (XElement xe in xe2.Descendants())
                                {
                                    dr[i] = xe.Value.ToString();
                                    i = i + 1;
                                }
                                dt_set1.Rows.Add(dr);
                            }
                        }
                        else
                        {
                            dt_set1 = null;
                        }

                        user_value.success = true;
                        user_value.combo = JsonConvert.SerializeObject(dt_set1);
                    }
                    else
                    {
                        user_value.success = true;
                        user_value.combo = JsonConvert.SerializeObject(response.arr_resultList);
                    }
                }
            }
            catch (Exception ex)
            {
                user_value.msg = ex.Message;
                user_value.success = false;
            }
            return JsonConvert.SerializeObject(user_value);
        }

        public sqlwebservice.Sql_WebService[] get_grid_combo_dtl()
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "select * from load_module_name";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }
    }
}