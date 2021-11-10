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
using System.IO;
using System.Xml.Linq;
using Newtonsoft.Json.Linq;
using System.Reflection;

namespace ShopTranProj.Controllers
{
    public class PersonalizeViewController : Controller
    {
        public static List<MyObj> view_set1;

        public static List<MyObj> aval_colu;

        public static List<MyObj> hidd_colu;

        public static Boolean newClick = false;

        public static Boolean make_default = false;

        ArrayList arrayList_Aval = new ArrayList();

        public ActionResult PersonalizeView()
        {
            return View();
        }

        [HttpPost]
        public string loadViews(string screen_id, string grid_id, Boolean newClick, string usr_id, string Menu_ID)
        {
            dynamic Personalize_View = new JObject();
            try
            {
                ShopTranProj.sqlwebservice.ContextVO cv = new ShopTranProj.sqlwebservice.ContextVO();
                ShopTranProj.sqlwebservice.Sql_WebService_Content wbs = new ShopTranProj.sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    cv.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    cv.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    cv.password = ConfigurationManager.AppSettings["dbPwd"].ToString();
                    cv.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                }

                wbs.obj_Sql_Service = combovalueQry(screen_id, grid_id, usr_id, Menu_ID);

                ShopTranProj.sqlwebservice.Sql_WebService_Response response = new ShopTranProj.sqlwebservice.Sql_WebService_Response();
                ShopTranProj.sqlwebservice.SqlWebServicesSoapClient soap = new ShopTranProj.sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(cv, "TASK", wbs);

                XDocument doc = new XDocument();
                string obj = "<root>" + response.arr_resultList + "</root>";
                doc = XDocument.Parse(obj);

                DataTable dt_View = new DataTable();
                DataTable dt_Aval = new DataTable();
                DataTable dt_Hidden = new DataTable();
                DataTable dt_Aval_MenuID = new DataTable();

                //if (Menu_ID != "")
                //{
                var set1rec = (from set1 in doc.Descendants("set1") select set1);

                dt_View.Columns.Add("VIEW_NAME", typeof(string));
                dt_View.Columns.Add("default_view", typeof(string));
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
                view_set1 = Viewset1(dt_View);

                var set2rec = (from set2 in doc.Descendants("set2") select set2);

                dt_Aval.Columns.Add("headerText", typeof(string));
                dt_Aval.Columns.Add("dataField", typeof(string));
                dt_Aval.Columns.Add("view_name", typeof(string));
                dt_Aval.Columns.Add("default_view", typeof(string));
                dt_Aval.Columns.Add("width", typeof(string));
                dt_Aval.Columns.Add("seq_no", typeof(string));

                if (set2rec.Count() > 0)
                {
                    XElement setup1 = (from set2 in doc.Descendants("set2") select set2).First();
                    foreach (XElement xe2 in setup1.Descendants("Record"))
                    {
                        DataRow dr = dt_Aval.NewRow();
                        int i = 0;
                        foreach (XElement xe in xe2.Descendants())
                        {
                            dr[i] = xe.Value.ToString(); //add in the values
                            i = i + 1;
                        }
                        dt_Aval.Rows.Add(dr);

                    }

                    //create arraylsit from DataTable
                    foreach (DataRow dr in dt_Aval.Rows)
                    {
                        arrayList_Aval.Add(dr);
                    }

                }
                else
                {
                    DataRow dr = dt_Aval.NewRow();
                    dt_Aval.Rows.Add(dr);
                }
                aval_colu = Aval_obj(dt_Aval);


                dt_Hidden.Columns.Add("headerText", typeof(string));
                dt_Hidden.Columns.Add("dataField", typeof(string));
                dt_Hidden.Columns.Add("view_name", typeof(string));
                dt_Hidden.Columns.Add("default_view", typeof(string));
                dt_Hidden.Columns.Add("width", typeof(string));
                dt_Hidden.Columns.Add("seq_no", typeof(string));

                var set3rec = (from set3 in doc.Descendants("set3") select set3);


                if (set3rec.Count() > 0)
                {
                    XElement setup1 = (from set3 in doc.Descendants("set3") select set3).First();
                    foreach (XElement xe2 in setup1.Descendants("Record"))
                    {
                        DataRow dr = dt_Hidden.NewRow();
                        int i = 0;
                        foreach (XElement xe in xe2.Descendants())
                        {
                            dr[i] = xe.Value.ToString(); //add in the values
                            i = i + 1;
                        }
                        dt_Hidden.Rows.Add(dr);
                    }



                    ArrayList arrayList_Hidd = new ArrayList();
                    //create arraylsit from DataTable
                    foreach (DataRow dr in dt_Hidden.Rows)
                    {
                        arrayList_Hidd.Add(dr);
                    }
                }
                else
                {
                    DataRow dr = dt_Hidden.NewRow();
                    dt_Hidden.Rows.Add(dr);
                }
                hidd_colu = Hidd_obj(dt_Hidden);
                Personalize_View.set1 = JsonConvert.SerializeObject(dt_View);
                Personalize_View.dt_Aval = JsonConvert.SerializeObject(dt_Aval);
                Personalize_View.dt_Hidden = JsonConvert.SerializeObject(dt_Hidden);

                Personalize_View.dt_Aval_MenuID = JsonConvert.SerializeObject(dt_Aval_MenuID);
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }


            return JsonConvert.SerializeObject(Personalize_View);
        }

        public ShopTranProj.sqlwebservice.Sql_WebService[] combovalueQry(string screen_id, string grid_id, string usr_id, string Menu_ID)
        {
            string dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
            string dbLocation = ConfigurationManager.AppSettings["locnId"].ToString();
            string orgId = ConfigurationManager.AppSettings["orgnId"].ToString();

            List<ShopTranProj.sqlwebservice.Sql_WebService> qryAc = new List<ShopTranProj.sqlwebservice.Sql_WebService>();

            ShopTranProj.sqlwebservice.Sql_WebService arrDtl = new ShopTranProj.sqlwebservice.Sql_WebService();
            arrDtl.execString = "exec sel_organize_view '" + orgId + "', '" + usr_id + "','" + screen_id + "','" + grid_id + "','" + dbLocation + "' ,'" + Menu_ID + "'";
            qryAc.Add(arrDtl);
            return qryAc.ToArray();
        }

        [HttpPost]
        public string savePersonalizeView_old(string view_name, string default_view, string Avaldetails, string Hiddetails, string user_id, string screen_id, string grid_id, string Menu_ID) //, string dt_Aval, string dt_Hidden
        {
            //-- Json Input Values--
            dynamic view_save_detail = new JObject();
            //-- Save method--
            try
            {
                if (default_view == "1")
                {
                    make_default = true;
                }

                dynamic grid_Aval = JsonConvert.DeserializeObject(Avaldetails);
                dynamic grid_Hidden = JsonConvert.DeserializeObject(Hiddetails);
                ShopTranProj.sqlwebservice.ContextVO context = new ShopTranProj.sqlwebservice.ContextVO();
                ShopTranProj.sqlwebservice.Sql_WebService_Content wbs = new ShopTranProj.sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();

                }
                // -- convert Aval_Column Json to Datatable--

                var Aval_result = new DataTable();
                var jArray = JArray.Parse(Avaldetails);
                foreach (var row in jArray)
                {
                    foreach (var jToken in row)
                    {
                        var jproperty = jToken as JProperty;
                        if (jproperty == null) continue;
                        if (Aval_result.Columns[jproperty.Name] == null)
                            Aval_result.Columns.Add(jproperty.Name, typeof(string));
                    }
                }
                foreach (var row in jArray)
                {
                    var datarow = Aval_result.NewRow();
                    foreach (var jToken in row)
                    {
                        var jProperty = jToken as JProperty;
                        if (jProperty == null) continue;
                        datarow[jProperty.Name] = jProperty.Value.ToString();
                    }
                    Aval_result.Rows.Add(datarow);
                }
                // -- convert Hidden_Column Json to Datatable--
                var Hidd_result = new DataTable();
                var Hid_jArray = JArray.Parse(Hiddetails);
                foreach (var row in Hid_jArray)
                {
                    foreach (var jToken in row)
                    {
                        var jproperty = jToken as JProperty;
                        if (jproperty == null) continue;
                        if (Hidd_result.Columns[jproperty.Name] == null)
                            Hidd_result.Columns.Add(jproperty.Name, typeof(string));
                    }
                }
                foreach (var row in Hid_jArray)
                {
                    var datarow = Hidd_result.NewRow();
                    foreach (var jToken in row)
                    {
                        var jProperty = jToken as JProperty;
                        if (jProperty == null) continue;
                        datarow[jProperty.Name] = jProperty.Value.ToString();
                    }
                    Hidd_result.Rows.Add(datarow);
                }
                // -- declare arraylist--
                List<ShopTranProj.sqlwebservice.Sql_WebService> qryAc = new List<ShopTranProj.sqlwebservice.Sql_WebService>();
                ShopTranProj.sqlwebservice.Sql_WebService arrDtl = new ShopTranProj.sqlwebservice.Sql_WebService();

                //--- exceute Insert for Aval_columns--
                string dbLocation = ConfigurationManager.AppSettings["locnId"].ToString();
                string orgId = ConfigurationManager.AppSettings["orgnId"].ToString();
                string exeString = "";

                if (make_default == true)
                {
                    exeString = exeString + "UPDATE Organize_view SET default_view = '0' WHERE orgnId='" + orgId + "' AND user_Id='" + user_id + "' AND	screen_id='" + screen_id + "' AND grid_id ='" + grid_id + "' AND	locnId ='" + dbLocation + "' ";
                }
                for (int i = 0; i < Aval_result.Rows.Count; i++)
                {
                    exeString = exeString + "exec ins_org_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + view_name + "','" + default_view + "','" + Aval_result.Rows[i]["headerText"].ToString() + "','" + Aval_result.Rows[i]["width"].ToString() + "','" + dbLocation + "',1,'" + Aval_result.Rows[i]["dataField"].ToString() + "' ";

                }
                // }
                //--- exceute Insert for Hidden_columns--

                for (int j = 0; j < Hidd_result.Rows.Count; j++)
                {
                    exeString = exeString + "exec ins_org_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + view_name + "','" + default_view + "','" + Hidd_result.Rows[j]["headerText"].ToString() + "','" + Hidd_result.Rows[j]["width"].ToString() + "','" + dbLocation + "',0,'" + Hidd_result.Rows[j]["dataField"].ToString() + "' ";

                }

                exeString = exeString + "exec sel_organize_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + dbLocation + "','" + Menu_ID + "'";

                arrDtl.execString = exeString;
                qryAc.Add(arrDtl);

                wbs.obj_Sql_Service = qryAc.ToArray();

                ShopTranProj.sqlwebservice.Sql_WebService_Response response = new ShopTranProj.sqlwebservice.Sql_WebService_Response();
                ShopTranProj.sqlwebservice.SqlWebServicesSoapClient soap = new ShopTranProj.sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "WORKING", wbs);

                if (response.errorList != null)
                {
                    string errmsg = response.errorList.ToString();
                    string encoded_msg = ShopTranProj.Common.Util.Html_Encode(errmsg);
                    throw new Exception(encoded_msg);
                    view_save_detail.msg = encoded_msg;
                    view_save_detail.success = false;
                }
                else
                {
                    newClick = false;

                    view_save_detail.msg = "My View Saved Successfully..";
                    view_save_detail.success = true;
                }
            }
            catch (Exception ex)
            {
                view_save_detail.msg = ex.Message;
                view_save_detail.success = false;
            }

            return JsonConvert.SerializeObject(view_save_detail);
        }

        public string savePersonalizeView(string view_name, string default_view, string Avaldetails, string Hiddetails, string user_id, string screen_id, string grid_id, string Menu_ID) //, string dt_Aval, string dt_Hidden
        {
            //-- Json Input Values--
            if (default_view == "1")
            {
                make_default = true;
            }
            dynamic view_save_detail = new JObject();
            dynamic grid_Aval = JsonConvert.DeserializeObject(Avaldetails);
            dynamic grid_Hidden = JsonConvert.DeserializeObject(Hiddetails);
            //-- Save method--
            try
            {
                ShopTranProj.sqlwebservice.ContextVO context = new ShopTranProj.sqlwebservice.ContextVO();
                ShopTranProj.sqlwebservice.Sql_WebService_Content wbs = new ShopTranProj.sqlwebservice.Sql_WebService_Content();

                if (ConfigurationManager.AppSettings.Count > 0)
                {
                    context.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                    context.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                    context.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                    context.password = ConfigurationManager.AppSettings["dbPwd"].ToString();

                }
                // -- convert Aval_Column Json to Datatable--

                var Aval_result = new DataTable();
                var jArray = JArray.Parse(Avaldetails);
                foreach (var row in jArray)
                {
                    foreach (var jToken in row)
                    {
                        var jproperty = jToken as JProperty;
                        if (jproperty == null) continue;
                        if (Aval_result.Columns[jproperty.Name] == null)
                            Aval_result.Columns.Add(jproperty.Name, typeof(string));
                    }
                }
                foreach (var row in jArray)
                {
                    var datarow = Aval_result.NewRow();
                    foreach (var jToken in row)
                    {
                        var jProperty = jToken as JProperty;
                        if (jProperty == null) continue;
                        datarow[jProperty.Name] = jProperty.Value.ToString();
                    }
                    Aval_result.Rows.Add(datarow);
                }
                // -- convert Hidden_Column Json to Datatable--
                var Hidd_result = new DataTable();
                var Hid_jArray = JArray.Parse(Hiddetails);
                foreach (var row in Hid_jArray)
                {
                    foreach (var jToken in row)
                    {
                        var jproperty = jToken as JProperty;
                        if (jproperty == null) continue;
                        if (Hidd_result.Columns[jproperty.Name] == null)
                            Hidd_result.Columns.Add(jproperty.Name, typeof(string));
                    }
                }
                foreach (var row in Hid_jArray)
                {
                    var datarow = Hidd_result.NewRow();
                    foreach (var jToken in row)
                    {
                        var jProperty = jToken as JProperty;
                        if (jProperty == null) continue;
                        datarow[jProperty.Name] = jProperty.Value.ToString();
                    }
                    Hidd_result.Rows.Add(datarow);
                }
                // -- declare arraylist--
                List<ShopTranProj.sqlwebservice.Sql_WebService> qryAc = new List<ShopTranProj.sqlwebservice.Sql_WebService>();
                ShopTranProj.sqlwebservice.Sql_WebService arrDtl = new ShopTranProj.sqlwebservice.Sql_WebService();

                //--- exceute Insert for Aval_columns--
                string dbLocation = ConfigurationManager.AppSettings["locnId"].ToString();
                string orgId = ConfigurationManager.AppSettings["orgnId"].ToString();
                string exeString = "";

                if (default_view == "1")
                {
                    exeString = exeString + "UPDATE Organize_view SET default_view = '0' WHERE orgnId='" + orgId + "' AND user_id='" + user_id + "' AND	screen_id='" + screen_id + "' AND grid_id ='" + grid_id + "' AND	locnId ='" + dbLocation + "' AND	view_name !='" + view_name + "' ";
                }
                else
                {
                    exeString = exeString + "UPDATE Organize_view SET default_view = '1' WHERE orgnId='" + orgId + "' AND user_id='" + user_id + "' AND	screen_id='" + screen_id + "' AND grid_id ='" + grid_id + "' AND	locnId ='" + dbLocation + "' AND	view_name='Default' ";
                }
                for (int i = 0; i < Aval_result.Rows.Count; i++)
                {
                    // exeString = exeString + "exec ins_org_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + view_name + "','" + default_view + "','" + Aval_result.Rows[i]["headerText"].ToString() + "','" + Aval_result.Rows[i]["width"].ToString() + "','" + dbLocation + "',1,'" + Aval_result.Rows[i]["dataField"].ToString() + "','" + Aval_result.Rows[i]["seq_no"].ToString() + "' ";
                    exeString = exeString + "exec ins_org_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + view_name + "','" + default_view + "','" + Aval_result.Rows[i]["headerText"].ToString() + "','" + Aval_result.Rows[i]["width"].ToString() + "','" + dbLocation + "',1,'" + Aval_result.Rows[i]["dataField"].ToString() + "','" + i.ToString() + "' ";
                }
                //--- exceute Insert for Hidden_columns--

                for (int j = 0; j < Hidd_result.Rows.Count; j++)
                {
                    //exeString = exeString + "exec ins_org_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + view_name + "','" + default_view + "','" + Hidd_result.Rows[j]["headerText"].ToString() + "','" + Hidd_result.Rows[j]["width"].ToString() + "','" + dbLocation + "',0,'" + Hidd_result.Rows[j]["dataField"].ToString() + "','" + Hidd_result.Rows[j]["seq_no"].ToString() + "' ";

                    exeString = exeString + "exec ins_org_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + view_name + "','" + default_view + "','" + Hidd_result.Rows[j]["headerText"].ToString() + "','" + Hidd_result.Rows[j]["width"].ToString() + "','" + dbLocation + "',0,'" + Hidd_result.Rows[j]["dataField"].ToString() + "','" + j.ToString() + "' ";
                }

                //exeString = exeString + "exec sel_organize_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + dbLocation + "'";
                exeString = exeString + "exec sel_organize_view '" + orgId + "', '" + user_id + "','" + screen_id + "','" + grid_id + "','" + dbLocation + "','" + Menu_ID + "'";


                arrDtl.execString = exeString;
                qryAc.Add(arrDtl);

                wbs.obj_Sql_Service = qryAc.ToArray();

                ShopTranProj.sqlwebservice.Sql_WebService_Response response = new ShopTranProj.sqlwebservice.Sql_WebService_Response();
                ShopTranProj.sqlwebservice.SqlWebServicesSoapClient soap = new ShopTranProj.sqlwebservice.SqlWebServicesSoapClient();

                response = soap.Sql_Service(context, "WORKING", wbs);

                newClick = false;

                view_save_detail.msg = "My View Saved Successfully..";
                view_save_detail.success = true;

            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

            return JsonConvert.SerializeObject(view_save_detail);
        }


        [HttpPost]
        public string onViewChange(string vw_name, Boolean newClick, string useer_id, string screen_id, string grid_id, string Menu_ID)
        {
            dynamic view_change = new JObject();
            newClick = false;
            //loadViews(screen_id, grid_id, newClick, useer_id, Menu_ID);
            DataTable dt_Vwchange = new DataTable();
            dt_Vwchange.Columns.Add(new DataColumn("headerText", typeof(String)));
            dt_Vwchange.Columns.Add(new DataColumn("dataField", typeof(String)));
            dt_Vwchange.Columns.Add(new DataColumn("view_name", typeof(String)));
            dt_Vwchange.Columns.Add(new DataColumn("default_view", typeof(String)));
            dt_Vwchange.Columns.Add(new DataColumn("width", typeof(String)));
            dt_Vwchange.Columns.Add(new DataColumn("seq_no", typeof(int)));

            DataTable dt_Vwchange_hid = new DataTable();
            dt_Vwchange_hid.Columns.Add(new DataColumn("headerText", typeof(String)));
            dt_Vwchange_hid.Columns.Add(new DataColumn("dataField", typeof(String)));
            dt_Vwchange_hid.Columns.Add(new DataColumn("view_name", typeof(String)));
            dt_Vwchange_hid.Columns.Add(new DataColumn("default_view", typeof(String)));
            dt_Vwchange_hid.Columns.Add(new DataColumn("width", typeof(String)));
            dt_Vwchange_hid.Columns.Add(new DataColumn("seq_no", typeof(int)));

            DataTable dt_defa_vw = new DataTable();
            dt_defa_vw.Columns.Add(new DataColumn("VIEW_NAME", typeof(String)));
            dt_defa_vw.Columns.Add(new DataColumn("default_view", typeof(String)));

            // var stringList = aval_colu.Cast<string>().ToList();
            foreach (var obj in aval_colu)
            {
                string view = obj.view_name.ToString();
                if (view == vw_name)
                {
                    var headerText = obj.headerText.ToString();
                    var dataField = obj.dataField.ToString();
                    var view_name = obj.view_name.ToString();
                    var default_view = obj.default_view.ToString();
                    var width = obj.width.ToString();
                    dt_Vwchange.Rows.Add(headerText, dataField, view_name, default_view, width);
                }
            }
            //if (Menu_ID == "")
            //{
            foreach (var obj in hidd_colu)
            {
                string view = obj.view_name.ToString();
                if (view == vw_name)
                {
                    var headerText = obj.headerText.ToString();
                    var dataField = obj.dataField.ToString();
                    var view_name = obj.view_name.ToString();
                    var default_view = obj.default_view.ToString();
                    var width = obj.width.ToString();
                    dt_Vwchange_hid.Rows.Add(headerText, dataField, view_name, default_view, width);
                }
            }

            foreach (var obj in view_set1)
            {
                string view = obj.VIEW_NAME.ToString();
                if (view == vw_name)
                {
                    var VIEW_NAME = obj.VIEW_NAME.ToString();
                    var default_view = obj.default_view.ToString();
                    dt_defa_vw.Rows.Add(VIEW_NAME, default_view);
                }
            }
            view_change.aval = JsonConvert.SerializeObject(dt_Vwchange);
            view_change.hidden = JsonConvert.SerializeObject(dt_Vwchange_hid);
            view_change.defset1 = JsonConvert.SerializeObject(dt_defa_vw);
            //}
            //else
            //{
            view_change.aval = JsonConvert.SerializeObject(dt_Vwchange);
            //}
            return JsonConvert.SerializeObject(view_change);
        }

        public List<MyObj> Aval_obj(DataTable dt_Aval)
        {
            List<MyObj> aval_colu = new List<MyObj>();

            foreach (DataRow dr in dt_Aval.Rows)
            {
                MyObj newObj = new MyObj();
                newObj.headerText = dr["headerText"].ToString();
                newObj.dataField = dr["dataField"].ToString();
                newObj.view_name = dr["view_name"].ToString();
                newObj.default_view = dr["default_view"].ToString();
                newObj.width = dr["width"].ToString();
                newObj.seq_no = dr["seq_no"].ToString();

                aval_colu.Add(newObj);
            }
            return aval_colu;
        }

        public List<MyObj> Hidd_obj(DataTable dt_Hidden)
        {
            List<MyObj> hidd_colu = new List<MyObj>();

            foreach (DataRow dr in dt_Hidden.Rows)
            {
                MyObj newObj = new MyObj();
                newObj.headerText = dr["headerText"].ToString();
                newObj.dataField = dr["dataField"].ToString();
                newObj.view_name = dr["view_name"].ToString();
                newObj.default_view = dr["default_view"].ToString();
                newObj.width = dr["width"].ToString();
                newObj.seq_no = dr["seq_no"].ToString();
                hidd_colu.Add(newObj);
            }
            return hidd_colu;
        }

        public List<MyObj> Viewset1(DataTable dt_View)
        {
            List<MyObj> view_set1 = new List<MyObj>();

            foreach (DataRow dr in dt_View.Rows)
            {
                MyObj newObj = new MyObj();
                newObj.VIEW_NAME = dr["VIEW_NAME"].ToString();
                newObj.default_view = dr["default_view"].ToString();

                view_set1.Add(newObj);
            }
            return view_set1;
        }

        public class MyObj
        {
            public string headerText { get; set; }
            public string dataField { get; set; }
            public string view_name { get; set; }
            public string default_view { get; set; }
            public string width { get; set; }
            public string VIEW_NAME { get; set; }
            public string seq_no { get; set; }
        }

        [HttpPost]
        public string MandatoryRows(string screen_id, string grid_id)
        {
            DataTable dt_Man = ShopTranProj.Common.Util.generateOrgViewMandatoryClm(Server.MapPath("/CommonXml/PersonalizeView.xml"), screen_id, grid_id);

            return JsonConvert.SerializeObject(dt_Man);
        }

    }
}

