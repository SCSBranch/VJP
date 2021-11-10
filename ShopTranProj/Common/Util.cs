using System;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using System.Linq;
using System.Xml;
using System.Xml.Linq;
using System.Data;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Web.Script.Serialization;
using System.ComponentModel;
using Newtonsoft.Json;
using System.Reflection;
using System.Globalization;
using System.Configuration;
using System.Data.SqlClient;

namespace ShopTranProj.Common
{
    public class Util
    {
        public static object[] mstlist;

        public static DataTable generateInputColumn(string path, string helpname)
        {
            DataTable dt_InputColumn = new DataTable();
            try
            {
                dt_InputColumn.Columns.Add("column", typeof(string));
                dt_InputColumn.Columns.Add("coldesc", typeof(string));
                dt_InputColumn.Columns.Add("datatype", typeof(string));
                dt_InputColumn.Columns.Add("entflg", typeof(string));
                dt_InputColumn.Columns.Add("defval", typeof(string));
                dt_InputColumn.Columns.Add("defcondt", typeof(string));

                var doc = XDocument.Load(path);
                var clmDtl = from clm in doc.Descendants("search").Where(clm => (string)clm.Attribute("id").Value == helpname) select clm;

                foreach (XElement clm in clmDtl)
                {
                    var clms = from cl in clm.Descendants("input") select cl;
                    foreach (XElement c in clms)
                    {
                        DataRow dr = dt_InputColumn.NewRow();
                        dr["column"] = Convert.ToString(c.Attribute("column").Value);
                        dr["coldesc"] = Convert.ToString(c.Attribute("coldesc").Value);
                        dr["datatype"] = Convert.ToString(c.Attribute("datatype").Value);
                        dr["entflg"] = Convert.ToString(c.Attribute("entflg").Value);
                        dr["defval"] = Convert.ToString(c.Attribute("defval").Value);
                        dr["defcondt"] = Convert.ToString(c.Attribute("defcondt").Value);
                        dt_InputColumn.Rows.Add(dr);
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",                       
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return dt_InputColumn;
        }

        public static string getDescription(string path, string helpname)
        {
            string description = "";

            var doc = XDocument.Load(path);
            var clmDtl = from clm in doc.Descendants("search").Where(clm => (string)clm.Attribute("id").Value == helpname) select clm;

            foreach (XElement clm in clmDtl)
            {
                description = clm.Attribute("description").Value.ToString();
            }
            return description;
        }

        public static DataTable generateOutputColumn(string path, string helpname, string attribut)
        {
            DataTable dt_OutputColumn = new DataTable();
            try
            {
                var doc = XDocument.Load(path);
                var clmDtl = from clm in doc.Descendants("search").Where(clm => (string)clm.Attribute("id").Value == helpname) select clm;

                foreach (XElement clm in clmDtl)
                {
                    var clms = from cl in clm.Descendants("output") select cl;
                    foreach (XElement c in clms)
                    {
                        DataColumn col = new DataColumn();
                        dt_OutputColumn.Columns.Add(Convert.ToString(c.Attribute(attribut).Value));
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return dt_OutputColumn;
        }

        public static string getoutputSqlColumn(DataTable dt_output)
        {
            string outputSqlColumn = "";
            try
            {
                for (int i = 0; i < dt_output.Columns.Count; i++)
                {
                    outputSqlColumn += dt_output.Columns[i].ColumnName.ToString() + ", ";
                }

                outputSqlColumn = outputSqlColumn.Substring(0, outputSqlColumn.Length - 2);
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return outputSqlColumn;
        }

        public static string getOutputOrderby(string path, string helpname)
        {
            string orderb_y = "";
            try
            {
                var doc = XDocument.Load(path);
                var clmDtl = from clm in doc.Descendants("search").Where(clm => (string)clm.Attribute("id").Value == helpname) select clm;

                foreach (XElement clm in clmDtl)
                {
                    var clms = from cl in clm.Descendants("outputs") select cl;
                    foreach (XElement c in clms)
                    {
                        orderb_y = c.Attribute("orderby").Value.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return orderb_y;
        }

        public static string getInputTableName(string path, string helpname)
        {
            string tableName = "";
            try
            {
                var doc = XDocument.Load(path);
                var clmDtl = from clm in doc.Descendants("search").Where(clm => (string)clm.Attribute("id").Value == helpname) select clm;

                foreach (XElement clm in clmDtl)
                {
                    var clms = from cl in clm.Descendants("inputs") select cl;
                    foreach (XElement c in clms)
                    {
                        tableName = c.Attribute("table").Value.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return tableName;
        }

        public static DataTable getCombovalue(string path)
        {
            DataTable dt_Combovalue = new DataTable();
            try
            {
                dt_Combovalue.Columns.Add("combovalue", typeof(string));

                var doc = XDocument.Load(path);
                var clmDtl = from clm in doc.Descendants("condition") select clm;

                foreach (XElement clm in clmDtl)
                {
                    var clms = from cl in clm.Descendants("condt") select cl;
                    foreach (XElement c in clms)
                    {
                        DataRow dr = dt_Combovalue.NewRow();
                        dr["combovalue"] = Convert.ToString(c.Value);
                        dt_Combovalue.Rows.Add(dr);
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return dt_Combovalue;
        }

        public static string toSymbol(string condt)
        {
            var symbol = "";

            switch (condt)
            {
                case "equalto": symbol = "=";
                    break;

                case "greaterthan": symbol = ">";
                    break;

                case "lessthan": symbol = "<";
                    break;

                case "like": symbol = "like";
                    break;

                case "notlike": symbol = "notlike";
                    break;

                case "notequalto": symbol = "<>";
                    break;

                default: symbol = " = ";
                    break;

            }

            return symbol;
        }

        public static bool validate_date(string date_str)
        {
            var dateVal = "";
            try
            {
                if (date_str != null)
                {
                    dateVal = Convert.ToDateTime(date_str).ToString("dd/MM/yyyy");
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //      MethodBase.GetCurrentMethod().Name, ex.Message);
                return false;
            }
        }

        public static DataTable InputDataTable(string json)
        {
            var result = new DataTable();
            try
            {
                var jArray = JArray.Parse(json);
                //Initialize the columns, If you know the row type, replace this
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
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return result;
        }

        public static string dttableToQuery(DataTable dattable)
        {
            string inputSql = "";
            try
            {
                int j = 0;
                for (int i = 0; i < dattable.Rows.Count; i++)
                {
                    if (dattable.Rows[i]["value"].ToString() != null && dattable.Rows[i]["value"].ToString() != "")
                    {
                        if (j == 0)
                        {
                            inputSql = " WHERE ";

                            if (dattable.Rows[i]["datatype"].ToString() != null && dattable.Rows[i]["datatype"].ToString() == "A")
                            {
                                if (Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()).ToString() == "like")
                                {
                                    inputSql += "UPPER(" + dattable.Rows[i]["column"].ToString() + ") " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " '" + dattable.Rows[i]["value"].ToString().ToUpper() + "%'";
                                }
                                else if (Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()).ToString() == "notlike")
                                {
                                    inputSql += "UPPER(" + dattable.Rows[i]["column"].ToString() + ") " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " '" + dattable.Rows[i]["value"].ToString().ToUpper() + "%'";
                                }
                                else
                                {
                                    inputSql += "UPPER(" + dattable.Rows[i]["column"].ToString() + ") " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " '" + dattable.Rows[i]["value"].ToString().ToUpper() + "'";
                                }
                            }
                            else if (dattable.Rows[i]["datatype"].ToString() != null && dattable.Rows[i]["datatype"].ToString() == "D")
                            {
                                if (Common.Util.validate_date(dattable.Rows[i]["value"].ToString()))
                                {
                                    inputSql += dattable.Rows[i]["column"].ToString() + " " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " convert(date,'" + dattable.Rows[i]["value"].ToString() + "',103)";
                                }
                                else
                                {
                                    return inputSql;
                                }
                            }
                            else if (dattable.Rows[i]["datatype"].ToString() != null && dattable.Rows[i]["datatype"].ToString() == "N")
                            {
                                inputSql += dattable.Rows[i]["column"].ToString() + " " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " " + dattable.Rows[i]["value"].ToString();
                            }
                            j++;
                        }
                        else
                        {
                            if (dattable.Rows[i]["datatype"].ToString() != null && dattable.Rows[i]["datatype"].ToString() == "A")
                            {
                                if (Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()).ToString() == "like")
                                {
                                    inputSql += "AND UPPER(" + dattable.Rows[i]["column"].ToString() + ") " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " '" + dattable.Rows[i]["value"].ToString().ToUpper() + "%'";
                                }
                                else if (Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()).ToString() == "notlike")
                                {
                                    inputSql += "AND UPPER(" + dattable.Rows[i]["column"].ToString() + ") " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " '" + dattable.Rows[i]["value"].ToString().ToUpper() + "%'";
                                }
                                else
                                {
                                    inputSql += "AND UPPER(" + dattable.Rows[i]["column"].ToString() + ") " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " '" + dattable.Rows[i]["value"].ToString().ToUpper() + "'";
                                }
                            }
                            else if (dattable.Rows[i]["datatype"].ToString() != null && dattable.Rows[i]["datatype"].ToString() == "D")
                            {
                                if (Common.Util.validate_date(dattable.Rows[i]["value"].ToString()))
                                {
                                    inputSql += " AND " + dattable.Rows[i]["column"].ToString() + " " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " convert(date,'" + dattable.Rows[i]["value"].ToString() + "',103)";
                                }
                                else
                                {
                                    return inputSql;
                                }
                            }
                            else if (dattable.Rows[i]["datatype"].ToString() != null && dattable.Rows[i]["datatype"].ToString() == "N")
                            {
                                inputSql += " AND " + dattable.Rows[i]["column"].ToString() + " " + Common.Util.toSymbol(dattable.Rows[i]["condition"].ToString()) + " " + dattable.Rows[i]["value"].ToString();
                            }
                            j++;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return inputSql;
        }

        public static DataTable ConvertToDatatable<T>(List<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            try
            {
                for (int i = 0; i < props.Count; i++)
                {
                    PropertyDescriptor prop = props[i];
                    if (prop.PropertyType.IsGenericType && prop.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                        table.Columns.Add(prop.Name, prop.PropertyType.GetGenericArguments()[0]);
                    else
                        table.Columns.Add(prop.Name, prop.PropertyType);
                }
                object[] values = new object[props.Count];
                foreach (T item in data)
                {
                    for (int i = 0; i < values.Length; i++)
                    {
                        values[i] = props[i].GetValue(item);
                    }
                    table.Rows.Add(values);
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return table;
        }

        //public static DataTable load_mastercodes(string mstcode)
        //{
        //    DataTable dt = new DataTable();
        //    try
        //    {
        //        //dt.Columns.Add(new DataColumn("master_code", typeof(String)));
        //        dt.Columns.Add(new DataColumn("code", typeof(String)));
        //        dt.Columns.Add(new DataColumn("description", typeof(String)));
        //        dt.Columns.Add(new DataColumn("dependent_code", typeof(String)));
        //        dt.Columns.Add(new DataColumn("code_status", typeof(String)));

        //        if (mstlist != null)
        //        {
        //            foreach (var obj in mstlist)
        //            {
        //                if ((((MasterCodes.Models.MasterCodesModels.retrieveMasterCodeListResponseDetail)(obj))).master_code == mstcode)
        //                {
        //                    var code_value = (((MasterCodes.Models.MasterCodesModels.retrieveMasterCodeListResponseDetail)(obj))).code;
        //                    var code_description = (((MasterCodes.Models.MasterCodesModels.retrieveMasterCodeListResponseDetail)(obj))).description;
        //                    var code_dependent = (((MasterCodes.Models.MasterCodesModels.retrieveMasterCodeListResponseDetail)(obj))).dependent_desc;
        //                    var status = (((MasterCodes.Models.MasterCodesModels.retrieveMasterCodeListResponseDetail)(obj))).status_desc;
        //                    dt.Rows.Add(code_value, code_description, code_dependent, status);
        //                }


        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        //Common.LogTest.TestClass.getLogError("Util",
        //        //       MethodBase.GetCurrentMethod().Name, ex.Message);

        //    }
        //    return dt;
        //}

       

        public static dynamic formValue_toJsonString(string formval)
        {
            string formvalue = "{";
            formval = formval.Replace("&", "\",\"");
            formval = formval.Replace("=", "\":\"");
            formvalue += formval + "}";
            formvalue = HttpUtility.UrlDecode(formvalue);
            dynamic obj = JsonConvert.DeserializeObject(formvalue);
            return obj;
        }

        public static string Html_Encode(string errmsg)
        {
            string te = HttpUtility.HtmlEncode(errmsg);
            te = te.Replace(".", "&#46;");
            te = te.Replace("_", "&#95;");
            te = te.Replace("\\", "&#92;");
            te = te.Replace("\n", "<br>");
            te = te.Replace("(", "&#40;");
            te = te.Replace(")", "&#41;");
            te = te.Replace("{", "&#123;");
            te = te.Replace("}", "&#125;");
            return te;
        }

        public static string todate(string tdate)
        {
            //string dateinddmmyyy = "30/10/2013 18:12:00";
            //datetime = DateTime.ParseExact(dateinddmmyyy, "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture).ToString("MM/dd/yyyy hh:mm:ss", CultureInfo.InvariantCulture);

            string datestr = "";

            try
            {
                if (tdate != "")
                {
                    datestr = DateTime.ParseExact(tdate, "dd/MM/yyyy", CultureInfo.InvariantCulture).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture);
                    return datestr;
                }
            }
            catch (Exception ex)
            {
                return datestr;
            }
            return datestr;
        }

        public static string todatetime(string date)
        {
            string datestr = "";

            try
            {
                if (date != "")
                {
                    datestr = DateTime.ParseExact(date, "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture).ToString("MM/dd/yyyy HH:mm", CultureInfo.InvariantCulture);
                    return datestr;
                }
            }
            catch (Exception ex)
            {
                return datestr;
            }
            return datestr;
        }

        public static DataTable generatePersonalizeViewColumn(string path, string screen_id, string grid_id)
        {
            DataTable dt_mandatoryColumn = new DataTable();
            try
            {
                // dt_mandatoryColumn.Columns.Add("dataField", typeof(string));

                var doc = XDocument.Load(path);
                //  var clmDtl = from clm in doc.Descendants("Screen").Where(clm => (string)clm.Attribute("id").Value == screen_id) select clm;
                var clmDtl = from clm in doc.Descendants("grid").Where(clm => (string)clm.Attribute("id").Value == grid_id) select clm;

                foreach (XElement clm in clmDtl)
                {
                    var clms = from cl in clm.Descendants("mandatory_column") select cl;
                    foreach (XElement c in clms)
                    {
                        //    DataRow dr = dt_mandatoryColumn.NewRow();
                        //    dr["dataField"] = Convert.ToString(c.Attribute("dataField").Value);
                        //    dt_mandatoryColumn.Rows.Add(dr);

                        DataColumn col = new DataColumn();
                        dt_mandatoryColumn.Columns.Add(Convert.ToString(c.Attribute("dataField").Value));
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return dt_mandatoryColumn;
        }


        public static DataTable generateOrgViewMandatoryClm(string path, string screen_id, string grid_id)
        {

            DataTable dt_mandatoryColumn = new DataTable();
            try
            {
                dt_mandatoryColumn.Columns.Add("headerText", typeof(string));

                var doc = XDocument.Load(path);
                //  var clmDtl = from clm in doc.Descendants("Screen").Where(clm => (string)clm.Attribute("id").Value == screen_id) select clm;
                var clmDtl = from clm in doc.Descendants("grid").Where(clm => (string)clm.Attribute("id").Value == grid_id) select clm;

                foreach (XElement clm in clmDtl)
                {
                    var isDrag = Convert.ToString(clm.Attribute("isDrag").Value);
                    var clms = from cl in clm.Descendants("mandatory_column") select cl;
                    foreach (XElement c in clms)
                    {

                        DataRow dr = dt_mandatoryColumn.NewRow();
                        dr["headerText"] = Convert.ToString(c.Attribute("headerText").Value);
                        dt_mandatoryColumn.Rows.Add(dr);

                        //DataColumn col = new DataColumn();
                        //dt_mandatoryColumn.Columns.Add(Convert.ToString(c.Attribute("dataField").Value));
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return dt_mandatoryColumn;
        }

        public static DataTable generateOrgViewSystemClm(string path, string screen_id, string grid_id)
        {
            DataTable dt_SystemColumn = new DataTable();
            try
            {
                // dt_mandatoryColumn.Columns.Add("dataField", typeof(string));

                var doc = XDocument.Load(path);
                //  var clmDtl = from clm in doc.Descendants("Screen").Where(clm => (string)clm.Attribute("id").Value == screen_id) select clm;
                var clmDtl = from clm in doc.Descendants("grid").Where(clm => (string)clm.Attribute("id").Value == grid_id) select clm;

                foreach (XElement clm in clmDtl)
                {
                    var clms = from cl in clm.Descendants("system_column") select cl;
                    foreach (XElement c in clms)
                    {
                        DataColumn col = new DataColumn();
                        dt_SystemColumn.Columns.Add(Convert.ToString(c.Attribute("dataField").Value));
                    }
                }
            }
            catch (Exception ex)
            {
                //Common.LogTest.TestClass.getLogError("Util",
                //       MethodBase.GetCurrentMethod().Name, ex.Message);

            }
            return dt_SystemColumn;
        }

        public static DataTable getXmlGrid(string path, string gridName)
        {
            DataTable dt_grid = new DataTable();

            dt_grid.Columns.Add("seqno", typeof(string));
            dt_grid.Columns.Add("df", typeof(string));
            dt_grid.Columns.Add("coldesc", typeof(string));
            dt_grid.Columns.Add("dt", typeof(string));
            dt_grid.Columns.Add("format", typeof(string));
            dt_grid.Columns.Add("edit", typeof(string));

            var doc = XDocument.Load(path);
            var clmDtl = from clm in doc.Descendants("grid").Where(clm => (string)clm.Attribute("type_id").Value == gridName) select clm;

            foreach (XElement clm in clmDtl)
            {
                var clms = from cl in clm.Descendants("column") select cl;
                foreach (XElement c in clms)
                {
                    DataRow dr = dt_grid.NewRow();
                    dr["seqno"] = Convert.ToString(c.Attribute("seqno").Value);
                    dr["df"] = Convert.ToString(c.Attribute("df").Value);
                    dr["coldesc"] = Convert.ToString(c.Attribute("coldesc").Value);
                    dr["dt"] = Convert.ToString(c.Attribute("dt").Value);
                    dr["format"] = Convert.ToString(c.Attribute("format").Value);
                    dr["edit"] = Convert.ToString(c.Attribute("edit").Value);

                    dt_grid.Rows.Add(dr);
                }
            }

            return dt_grid;
        }



        public static object setDbContext(dynamic cntxt)
        {
            try
            {
                cntxt.orgnId = ConfigurationManager.AppSettings["orgId"].ToString();
                cntxt.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                cntxt.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                cntxt.dbUser = ConfigurationManager.AppSettings["dbUser"].ToString();
                cntxt.dbPwd = ConfigurationManager.AppSettings["dbPwd"].ToString();
                cntxt.userId = ConfigurationManager.AppSettings["userId"].ToString();
                cntxt.sessionId = ConfigurationManager.AppSettings["sessionId"].ToString();
                cntxt.locnId = ConfigurationManager.AppSettings["locnId"].ToString();
            }
            catch (Exception ex)
            {

            }
            return cntxt;
        }

        public static object set_sqlWeb_Service_DbContext(dynamic cntxt)
        {
            try
            {
                cntxt.dbServer = ConfigurationManager.AppSettings["dbServer"].ToString();
                cntxt.dbName = ConfigurationManager.AppSettings["dbName"].ToString();
                cntxt.userID = ConfigurationManager.AppSettings["dbUser"].ToString();
                cntxt.password = ConfigurationManager.AppSettings["dbPwd"].ToString();
            }
            catch (Exception ex)
            {

            }
            return cntxt;
        }

       
    }
}