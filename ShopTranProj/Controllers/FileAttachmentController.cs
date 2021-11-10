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
    public class FileAttachmentController : Controller
    {
        // GET: FileAttachment
        public ActionResult FileAttachment()
        {
            return View();
        }

        public ActionResult OrderPopup()
        {
            return View();
        }

        public ActionResult CostSummarypopup()
        {
            return View();
        }
        public ActionResult RFQEntryPopup()
        {
            return View();
        }
        public ActionResult OrderNoPopup()
        {
            return View();
        }
        public ActionResult CustomerPopup()
        {
            return View();
        }
        public ActionResult PartNamePopup()
        {
            return View();
        }
        public string file_name = "";

        [HttpPost]
        public string file_load(HttpPostedFileBase file, string txtDocno, string txtVersion)
        {
            dynamic get_file = new JObject();
            try
            {
                if (file != null && file.ContentLength > 0)
                {

                    file_name = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + System.IO.Path.GetExtension(file.FileName);

                    Common.Global.file_name = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + "_" + txtDocno + "_" + txtVersion + System.IO.Path.GetExtension(file.FileName);

                    Common.Global.file_name = Common.Global.file_name.Replace("/", "_");

                    Common.Global.file_name = Common.Global.file_name.Replace("\\", "_");

                    Common.Global.path = System.IO.Path.Combine(
                         Server.MapPath("/ws/Documents/"), Common.Global.file_name);
                    file.SaveAs(Common.Global.path);

                    get_file.file_log = file_name;
                    get_file.success = true;
                    get_file.msg = "File Uploaded successfully";
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

        [HttpPost]
        public string file_download(string dn_file_name)
        {
            Boolean fileExists = System.IO.File.Exists(dn_file_name);
            return JsonConvert.SerializeObject(fileExists);
        }

        [HttpPost]
        public string Grid_iud_doc_attachment(string formval) // rename login1 to Login before hosting
        {
            dynamic file_save_detail = new JObject();
            try
            {
                dynamic obj = JObject.Parse(formval);
                sqlwebservice.ContextVO context = new sqlwebservice.ContextVO();
                sqlwebservice.Sql_WebService_Content wbs = new sqlwebservice.Sql_WebService_Content();
                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();
                }
                string doc_number = obj.Number;
                string doc_lead = obj.Lead;
                string doc_type = obj.upload_type;
                string seq_no = obj.SeqNo;
                string filename = obj.filename;
                string file_version = obj.Version;
                string file_size = obj.Size;
                string attach_group = obj.Group;
                string attach_subgroup = obj.SubGroup;
                string attach_note = obj.Notes;
                string file_path = obj.modeflag == "I" ? Common.Global.path : obj.file_path;
                string mode_flag = obj.modeflag;
                string user_id = ConfigurationManager.AppSettings["userId"].ToString();
                wbs.obj_Sql_Service = grid_attach_save(doc_type, doc_lead, doc_number, seq_no, filename, file_version, attach_group, attach_subgroup, attach_note, file_size, file_path, mode_flag, user_id);
                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();
                response = soap.Sql_Service(context, "GIP", wbs);
                if (response.errorList != null)
                {
                    string errmsg = response.errorList[0].errorDescription.ToString();
                    string encoded_msg = Common.Util.Html_Encode(errmsg);
                    throw new Exception(encoded_msg);
                }
                else
                {
                    file_save_detail.success = true;
                    if (obj.modeflag == "D")
                    {
                        file_save_detail.msg = "Doc Attachment Deleted Successfully..";
                    }
                    else
                    {
                        file_save_detail.msg = "Doc Attachment Saved Successfully..";
                    }
                }
            }
            catch (Exception ex)
            {
                file_save_detail.msg = ex.Message;
                file_save_detail.success = false;
            }
            return JsonConvert.SerializeObject(file_save_detail);
        }

        public sqlwebservice.Sql_WebService[] grid_attach_save(string doc_type, string doc_lead, string doc_number, string seq_no, string filename, string file_version, string attach_group, string attach_subgroup, string attach_note, string file_size, string file_path, string mode_flag, string user_id)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "exec Grid_iud_doc_attachment '" + doc_type + "', '" + doc_lead + "','" + doc_number + "','" + seq_no + "','" + filename + "','" + file_version + "','" + attach_group + "','" + attach_subgroup + "','" + attach_note + "','" + file_size + "','" + file_path + "','" + mode_flag + "','" + user_id + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }

        [HttpPost]
        public string Grid_fetch_doc_attachment(string Doc_Type, string Doc_No, string Doc_lead) // rename login1 to Login before hosting
        {
            dynamic file_save_detail = new JObject();
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

                string user_id = ConfigurationManager.AppSettings["userId"].ToString();

                wbs.obj_Sql_Service = grid_fetch_attach(Doc_Type, Doc_No, Doc_lead, user_id);

                sqlwebservice.Sql_WebService_Response response = new sqlwebservice.Sql_WebService_Response();
                sqlwebservice.SqlWebServicesSoapClient soap = new sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "GIP", wbs);

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
                        file_save_detail.success = true;
                        file_save_detail.filelist = JsonConvert.SerializeObject(dt_set1);
                    }
                    else
                    {
                        file_save_detail.success = true;
                        file_save_detail.filelist = JsonConvert.SerializeObject(response.arr_resultList);
                    }
                }
            }
            catch (Exception ex)
            {
                file_save_detail.msg = ex.Message;
                file_save_detail.success = false;
            }
            return JsonConvert.SerializeObject(file_save_detail);
        }

        public sqlwebservice.Sql_WebService[] grid_fetch_attach(string doc_type, string doc_number, string doc_lead, string user_id)
        {
            List<sqlwebservice.Sql_WebService> qryAc = new List<sqlwebservice.Sql_WebService>();
            sqlwebservice.Sql_WebService arrDtl = new sqlwebservice.Sql_WebService();
            arrDtl.execString = "exec Grid_fetch_doc_attachment '" + doc_type + "', '" + doc_number + "','" + doc_lead + "','" + user_id + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }
    }
}