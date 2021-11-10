using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace ShopTranProj.Controllers
{
    public class QutoeOrderController : Controller
    {
        // GET: QutoeOrder


        public ActionResult RFQEntry()
        {
            return View();
        }

      

        public ActionResult ToolCostSummary()
        {
            return View();
        }

        public ActionResult ProductCostSummary()
        {
            return View();
        }
        
        public ActionResult OrderEntry()
        {
            return View();
        }
        public ActionResult CEOApproval()
        {
            return View();
        }
        public ActionResult CustomerApproval()
        {
            return View();
        }
        public ActionResult QuoteSummary()
        {
            return View();
        }
        public ActionResult InternalApproveForm()
        {
            return View();
        }

      
        [HttpPost]
        public string fetch_rfq_popup_details(string receiveData)
        {
            dynamic rfq_details = new JObject();
            try
            {
                dynamic receive_data = JObject.Parse(receiveData);

                var orgnId = receive_data.orgnId;
                orgnId = orgnId.Value;

                var locnId = receive_data.locnId;
                locnId = locnId.Value;

                var rfq_no = receive_data.rfq_no;
                rfq_no = rfq_no.Value;


                sqlwebservice.ContextVO context = new sqlwebservice.ContextVO();
                sqlwebservice.Sql_WebService_Content wbs = new sqlwebservice.Sql_WebService_Content();
                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();                   
                }


                wbs.obj_Sql_Service = get_rfq_popup_details(orgnId, locnId, rfq_no);

                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "ECPL_LITE", wbs);
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
                        System.Data.DataTable dt_set1 = new System.Data.DataTable();
                        if (set1rec.Count() > 0)
                        {
                            var set1_first = set1rec.Descendants("Record").First();

                            foreach (XElement xe in set1_first.Descendants())
                                dt_set1.Columns.Add(xe.Name.ToString(), typeof(string));

                            XElement setup1 = (from set1 in doc.Descendants("set1") select set1).First();
                            foreach (XElement xe2 in setup1.Descendants("Record"))
                            {
                                System.Data.DataRow dr = dt_set1.NewRow();
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
                            //DataRow dr1 = dt_set1.NewRow();
                            // dt_set1.Rows.Add(dr1);
                        }
                        var set2rec = (from set2 in doc.Descendants("set2") select set2);
                        System.Data.DataTable dt_set2 = new System.Data.DataTable();
                        if (set2rec.Count() > 0)
                        {
                            var set2_first = set2rec.Descendants("Record").First();

                            foreach (XElement xe in set2_first.Descendants())
                                dt_set2.Columns.Add(xe.Name.ToString(), typeof(string));


                            XElement setup2 = (from set2 in doc.Descendants("set2") select set2).First();
                            foreach (XElement xe2 in setup2.Descendants("Record"))
                            {
                                System.Data.DataRow dr = dt_set2.NewRow();
                                int i = 0;
                                foreach (XElement xe in xe2.Descendants())
                                {
                                    dr[i] = xe.Value.ToString();
                                    i = i + 1;
                                }
                                dt_set2.Rows.Add(dr);
                            }
                        }
                        else
                        {
                            //  DataRow dr1 = dt_set2.NewRow();
                            // dt_set2.Rows.Add(dr1);
                            dt_set2 = null;
                        }


                        var set3rec = (from set3 in doc.Descendants("set3") select set3);
                        System.Data.DataTable dt_set3 = new System.Data.DataTable();
                        if (set3rec.Count() > 0)
                        {
                            var set3_first = set3rec.Descendants("Record").First();

                            foreach (XElement xe in set3_first.Descendants())
                                dt_set3.Columns.Add(xe.Name.ToString(), typeof(string));


                            XElement setup3 = (from set3 in doc.Descendants("set3") select set3).First();
                            foreach (XElement xe3 in setup3.Descendants("Record"))
                            {
                                System.Data.DataRow dr = dt_set3.NewRow();
                                int i = 0;
                                foreach (XElement xe in xe3.Descendants())
                                {
                                    dr[i] = xe.Value.ToString();
                                    i = i + 1;
                                }
                                dt_set3.Rows.Add(dr);
                            }
                        }
                        else
                        {
                            //  DataRow dr1 = dt_set2.NewRow();
                            // dt_set2.Rows.Add(dr1);
                            dt_set3 = null;
                        }
                        var set4rec = (from set4 in doc.Descendants("set4") select set4);
                        System.Data.DataTable dt_set4 = new System.Data.DataTable();
                        if (set4rec.Count() > 0)
                        {
                            var set4_first = set4rec.Descendants("Record").First();

                            foreach (XElement xe in set4_first.Descendants())
                                dt_set4.Columns.Add(xe.Name.ToString(), typeof(string));


                            XElement setup4 = (from set4 in doc.Descendants("set4") select set4).First();
                            foreach (XElement xe4 in setup4.Descendants("Record"))
                            {
                                System.Data.DataRow dr = dt_set4.NewRow();
                                int i = 0;
                                foreach (XElement xe in xe4.Descendants())
                                {
                                    dr[i] = xe.Value.ToString();
                                    i = i + 1;
                                }
                                dt_set4.Rows.Add(dr);
                            }
                        }
                        else
                        {                        
                            dt_set4 = null;
                        }

                        rfq_details.success = true;
                        rfq_details.rfq_header = JsonConvert.SerializeObject(dt_set1);
                        rfq_details.rfq_entry_details = JsonConvert.SerializeObject(dt_set2);
                        rfq_details.tool_cost_details = JsonConvert.SerializeObject(dt_set3);
                        rfq_details.product_cost_details = JsonConvert.SerializeObject(dt_set4);

                    }
                    else
                    {
                        rfq_details.success = true;
                        rfq_details.rfq_header = JsonConvert.SerializeObject(response.arr_resultList);
                        rfq_details.rfq_entry_details = JsonConvert.SerializeObject(response.arr_resultList);
                        rfq_details.tool_cost_details = JsonConvert.SerializeObject(response.arr_resultList);
                        rfq_details.product_cost_details = JsonConvert.SerializeObject(response.arr_resultList);
                    }
                }
            }
            catch (Exception ex)
            {
                rfq_details.msg = ex.Message;
                rfq_details.success = false;
            }
            return JsonConvert.SerializeObject(rfq_details);
        }

        public sqlwebservice.Sql_WebService[] get_rfq_popup_details(string orgnId, string locnId, string rfq_no)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();

            arrDtl.execString = "exec fetch_rfq_popup_details'" + orgnId + "','" + locnId + "','" + rfq_no + "'";

            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }
          
    

    }
}