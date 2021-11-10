using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Web.Mvc;
using System.Configuration;
using System.Collections;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.Script.Serialization;
using System.ComponentModel;
using System.Xml;
using System.Xml.Linq;

namespace ShopTranProj.Controllers
{
    public class HelpFilterController : Controller
    {
        public string searchSql = "";

        public ActionResult HelpFilter()
        {
            return View();
        }

        [HttpPost]
        public string datatypelist(string search_id)
        {
            DataTable dt = Common.Util.generateInputColumn(Server.MapPath("/CommonXml/Help.xml"), search_id);

            return JsonConvert.SerializeObject(dt);
        }

        [HttpPost]
        public string datatypedetails(string search_id)
        {
            DataTable dt = Common.Util.generateOutputColumn(Server.MapPath("/CommonXml/Help.xml"), search_id, "coldesc");
            DataRow dr = dt.NewRow();
            dt.Rows.InsertAt(dr, 0);
            return JsonConvert.SerializeObject(dt);
        }

        [HttpPost]
        public string search(string input, string search_id)
        {
            DataTable dt_output = Common.Util.generateOutputColumn(Server.MapPath("/CommonXml/Help.xml"), search_id, "column");

            string outputSql = Common.Util.getoutputSqlColumn(dt_output);

            string tabName = Common.Util.getInputTableName(Server.MapPath("/CommonXml/Help.xml"), search_id);

            var dattable = Common.Util.InputDataTable(input);

            string Where_condition = Common.Util.dttableToQuery(dattable);

            string order_by = Common.Util.getOutputOrderby(Server.MapPath("/CommonXml/Help.xml"), search_id);

            searchSql = " SELECT DISTINCT " + outputSql + " FROM " + tabName + " WITH (NOLOCK) " + Where_condition + " ORDER BY " + order_by;

            var result = search_result(searchSql);

            return result;
        }

        public string search_result(string sql_query)
        {
            try
            {
                sqlwebservice.ContextVO cv = new sqlwebservice.ContextVO();
                sqlwebservice.Sql_WebService_Content wbs = new sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    cv.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    cv.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    cv.password = ConfigurationManager.AppSettings["dbPwd"].ToString();
                    cv.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                }

                wbs.obj_Sql_Service = result_list(sql_query);

                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(cv, "ASPIRE", wbs);

                if (response.arr_resultList != null)
                {
                    XDocument doc = new XDocument();
                    string obj = "<root>" + response.arr_resultList + "</root>";
                    doc = XDocument.Parse(obj);

                    DataTable dt = new DataTable();

                    XElement setup = (from set1 in doc.Descendants("set1") select set1).First();

                    foreach (XElement xer in setup.Descendants("Record"))
                    {
                        foreach (XElement xe in xer.Descendants())
                            dt.Columns.Add(xe.Name.ToString(), typeof(string)); // add columns to your dt
                        break;
                    }
                    var set1rec = (from set1 in doc.Descendants("set1") select set1);

                    if (set1rec.Count() > 0)
                    {
                        XElement setup1 = (from set1 in doc.Descendants("set1") select set1).First();
                        foreach (XElement xe2 in setup1.Descendants("Record"))
                        {
                            DataRow dr = dt.NewRow();
                            int i = 0;
                            foreach (XElement xe in xe2.Descendants())
                            {
                                dr[i] = xe.Value.ToString();
                                i = i + 1;
                            }
                            dt.Rows.Add(dr);
                        }
                    }
                    else
                    {
                        DataRow dr = dt.NewRow();
                        dt.Rows.Add(dr);
                    }
                    string jsontext = JsonConvert.SerializeObject(dt);

                    return jsontext;
                }
                else
                {
                    return "";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public sqlwebservice.Sql_WebService[] result_list(string query)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();

            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();

            string sql = arrDtl.execString = query;

            qryAc.Add(arrDtl);

            return qryAc.ToArray();
        }

        [HttpPost]
        public string onSelection(string row_val)
        {
            try
            {
                dynamic obj = JsonConvert.DeserializeObject(row_val);

                return JsonConvert.SerializeObject(obj);
            }
            catch (Exception ex)
            {
                return "";
            }
        }
    }
}