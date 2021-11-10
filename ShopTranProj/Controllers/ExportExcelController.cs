using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace ShopTranProj.Controllers
{
    public class ExportExcelController : Controller
    {
        //
        // GET: /ExportExcel/
        public ActionResult ExportExcel()
        {
            return View();
        }

        [HttpPost]
        public string fetch_file_path_details(string receiveData)
        {

            dynamic fetch_file_path = new JObject();
            try
            {
                dynamic receive_data = JObject.Parse(receiveData);


                var user = receive_data.userId;
                var userId = user.Value;

                var screen = receive_data.screen_id;
                var screen_id = screen.Value;

                var orgnID = "";
                var locnId = "CHN";
                var localeId = "1";
                sqlwebservice.ContextVO context = new sqlwebservice.ContextVO();
                sqlwebservice.Sql_WebService_Content wbs = new sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    orgnID = ConfigurationManager.AppSettings["orgnId"].ToString();
                    //locnId = ConfigurationManager.AppSettings["locnId"].ToString();
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();
                }


                wbs.obj_Sql_Service = combomenu(screen_id, orgnID, locnId, localeId, userId);

                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "PRE", wbs);

                XDocument doc = new XDocument();
                string obj = "<root>" + response.arr_resultList + "</root>";

                if (response.arr_resultList != null)
                {

                    doc = XDocument.Parse(obj);

                    var set1rec = (from set1 in doc.Descendants("set1") select set1);
                    DataTable dt_View = new DataTable();
                    dt_View.Columns.Add("Template", typeof(string));
                    dt_View.Columns.Add("tmpl_rowid", typeof(string));
                    dt_View.Columns.Add("type_code", typeof(string));
                    dt_View.Columns.Add("type_desc", typeof(string));
                    dt_View.Columns.Add("seq_no", typeof(string));
                    dt_View.Columns.Add("template_name", typeof(string));
                    dt_View.Columns.Add("note", typeof(string));
                    dt_View.Columns.Add("file_path", typeof(string));
                    dt_View.Columns.Add("mode_flag", typeof(string));

                    if (set1rec.Count() > 0)
                    {
                        XElement setup1 = (from set1 in doc.Descendants("set1") select set1).First();
                        foreach (XElement xe2 in setup1.Descendants("Record"))
                        {
                            DataRow dr = dt_View.NewRow();
                            int i = 0;
                            foreach (XElement xe in xe2.Descendants())
                            {
                                dr[i] = xe.Value.ToString(); //add in the values
                                i = i + 1;
                            }
                            dt_View.Rows.Add(dr);
                        }
                    }
                    else
                    {
                        DataRow dr = dt_View.NewRow();
                        dt_View.Rows.Add(dr);
                    }

                    fetch_file_path.success = true;
                    fetch_file_path.set1 = JsonConvert.SerializeObject(dt_View);
                }
                else
                {
                    fetch_file_path.success = true;
                    fetch_file_path.set1 = JsonConvert.SerializeObject(response.arr_resultList);
                }
            }
            catch (Exception ex)
            {
                fetch_file_path.success = false;
                fetch_file_path.msg = ex.Message;
                //Common.LogTest.TestClass.getLogError(
                //       Request.RequestContext.RouteData.Values["controller"].ToString(),
                //       MethodBase.GetCurrentMethod().Name, ex.Message);
            }
            return JsonConvert.SerializeObject(fetch_file_path);
        }

        public sqlwebservice.Sql_WebService[] combomenu(string screen_id, string orgnId, string locnId, string localeId, string userId)
        {

            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();

            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            string sql = arrDtl.execString = "exec fetch_excel_template '" + screen_id + "', '" + orgnId + "', '" + locnId + "', '" + localeId + "', '" + userId + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();

        }

    }
}