using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using GemBox.Spreadsheet;
using System.IO;
using System.Net;
using OfficeOpenXml;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Xml.Linq;
using System.Configuration;

namespace ShopTranProj.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Home()
        {
            return View();
        }

        [HttpPost]
        public string Export_Excel(string griddata, string combovalue, string TreeId, string SubTreeId, string filepath)
        {
            dynamic excel_export = new JObject();
            try
            {
                var result = new DataTable();
                var jArray = JArray.Parse(griddata);
                foreach (var row in jArray)
                {
                    foreach (var jToken in row)
                    {
                        var jproperty = jToken as JProperty;
                        if (jproperty == null) continue;
                        if (result.Columns[jproperty.Name] == null)
                            result.Columns.Add(jproperty.Name, typeof(string));
                    }
                }
                foreach (var row in jArray)
                {
                    var datarow = result.NewRow();
                    foreach (var jToken in row)
                    {
                        var jProperty = jToken as JProperty;
                        if (jProperty == null) continue;
                        datarow[jProperty.Name] = jProperty.Value.ToString();
                    }
                    result.Rows.Add(datarow);
                }
                Guid guid = Guid.NewGuid();


                var Excel_name = "";
                string path2 = "";
                Excel_name = combovalue;
                TreeId = "ws";
                SubTreeId = "Templates";
                path2 = Server.MapPath("~/" + TreeId + "/" + SubTreeId + "/" + Excel_name);
                SubTreeId = combovalue;
                string Clientpath = "/Downloaded_Excel/" + SubTreeId + "_" + guid + "." + filepath;
                string remoteUri = path2;
                string fileDownload = Server.MapPath("~/Downloaded_Excel/" + SubTreeId + "_" + guid + "." + filepath);
                string fileDownload12 = Server.MapPath("~/Downloaded_Excel");

                if (System.IO.File.Exists(fileDownload12))
                {
                    System.IO.File.OpenWrite(fileDownload12);
                }
                else
                {
                    DirectoryInfo di = Directory.CreateDirectory(fileDownload12);

                    WebClient myWebClient = new WebClient();
                    myWebClient.DownloadFile(remoteUri, fileDownload);

                    var workbookFileInfo = new FileInfo(@fileDownload);
                    using (ExcelPackage excel = new ExcelPackage(workbookFileInfo))
                    {

                        ExcelWorkbook workBook = excel.Workbook;
                        var firstWorksheet = workBook.Worksheets.First();
                        excel.Workbook.Worksheets.Delete(firstWorksheet);
                        var objWorksheet = excel.Workbook.Worksheets.Add("Data");
                        objWorksheet.Cells["A1"].LoadFromDataTable(result, true);
                        objWorksheet.Cells.AutoFitColumns();

                        using (ExcelRange objRange = objWorksheet.Cells["A1:XFD1"])
                        {
                            objRange.Style.Font.Bold = true;

                        }

                        ExcelRange range = objWorksheet.Cells["A1:I3264"];

                        ExcelAddress valueAddress = new ExcelAddress(15, 1, 25, 15);

                        excel.Save();
                        excel_export.msg = "" + Excel_name + " Exported Successfully";
                        excel_export.path = Clientpath;
                        excel_export.success = true;
                    }
                }
            }
            catch (Exception ex)
            {
                excel_export.msg = ex.Message;
                excel_export.success = false;
            }
            return JsonConvert.SerializeObject(excel_export);

        }

        [HttpPost]
        public string fetch_dynamic_inputs(string userId, string screenId, string tabId)
        {
            dynamic fileds_val = new JObject();
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

                wbs.obj_Sql_Service = filed_details(userId, screenId, tabId);

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

                        fileds_val.success = true;
                        fileds_val.detail = JsonConvert.SerializeObject(dt_set1);
                    }
                    else
                    {
                        fileds_val.success = true;
                        fileds_val.detail = JsonConvert.SerializeObject(response.arr_resultList);
                    }
                }
            }
            catch (Exception ex)
            {
                fileds_val.msg = ex.Message;
                fileds_val.success = false;
            }
            return JsonConvert.SerializeObject(fileds_val);
        }
        public sqlwebservice.Sql_WebService[] filed_details(string userId, string screenId, string tabId)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "exec fetch_DynamicInputs '" + userId + "','" + screenId + "','" + tabId + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }

        [HttpPost]
        public string get_StdGridData(string orgnId, string locnId, string userId, string screen_Id, string grid_id)
        {
            dynamic value = new JObject();
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

                wbs.obj_Sql_Service = grid_details(orgnId, locnId, userId, screen_Id, grid_id);

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
                        value.success = true;
                        value.detail = JsonConvert.SerializeObject(dt_set1);
                    }
                    else
                    {
                        value.success = true;
                        value.detail = JsonConvert.SerializeObject(response.arr_resultList);
                    }
                }
            }
            catch (Exception ex)
            {
                value.msg = ex.Message;
                value.success = false;
            }
            return JsonConvert.SerializeObject(value);
        }

        public sqlwebservice.Sql_WebService[] grid_details(string orgnId, string locnId, string userId, string screen_Id, string grid_id)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "exec fetch_StdGridData '" + orgnId + "' , '" + locnId + "','" + userId + "' , '" + screen_Id + "','" + grid_id + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }

        /**************** Get the Tabs Information ***********************/
        [HttpPost]
        public string get_TabDetails(string menu_id, string rowid)
        {
            dynamic get_val = new JObject();
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

                wbs.obj_Sql_Service = get_information(menu_id, rowid);

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

                        get_val.success = true;
                        get_val.detail = JsonConvert.SerializeObject(dt_set1);
                    }
                    else
                    {
                        get_val.success = true;
                        get_val.detail = JsonConvert.SerializeObject(response.arr_resultList);
                    }
                }
            }
            catch (Exception ex)
            {
                get_val.msg = ex.Message;
                get_val.success = false;
            }
            return JsonConvert.SerializeObject(get_val);
        }
        public sqlwebservice.Sql_WebService[] get_information(string menu_id, string rowid)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "exec get_tabdetails '" + menu_id + "','" + rowid + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }

    }
}