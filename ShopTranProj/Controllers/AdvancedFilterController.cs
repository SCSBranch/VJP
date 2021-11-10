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
using System.IO;
using System.Xml.Linq;


namespace ShopTranProj.Controllers
{
    public class AdvancedFilterController : Controller
    {
        public ActionResult AdvancedFilter()
        {
            return View();
        }

        public string filterID;


        [HttpPost]
        public string filterdetails(string filterID)
        {
            var XMLLoadfullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory,
             Path.Combine("CommonXml", "Filter.xml"));

            var doc = XDocument.Load(XMLLoadfullPath);

            DataTable dt_InputColumn = new DataTable();

            dt_InputColumn.Columns.Add("coldesc", typeof(string));
            dt_InputColumn.Columns.Add("colname", typeof(string));
            dt_InputColumn.Columns.Add("datatype", typeof(string));
            dt_InputColumn.Columns.Add("mstcode", typeof(string));
            dt_InputColumn.Columns.Add("defcondt", typeof(string));
            dt_InputColumn.Columns.Add("defval", typeof(string));
            var clmDtl = from clm in doc.Descendants("filter").Where(clm => (string)clm.Attribute("id").Value == filterID) select clm;

            foreach (XElement clm in clmDtl)
            {
                var clms = from cl in clm.Descendants("item") select cl;
                foreach (XElement c in clms)
                {
                    DataRow dr = dt_InputColumn.NewRow();
                    dr["coldesc"] = Convert.ToString(c.Attribute("coldesc").Value);
                    dr["colname"] = Convert.ToString(c.Attribute("colname").Value);
                    dr["datatype"] = Convert.ToString(c.Attribute("datatype").Value);
                    dr["mstcode"] = Convert.ToString(c.Attribute("mstcode").Value);
                    dr["defcondt"] = Convert.ToString(c.Attribute("defcondt").Value);
                    dr["defval"] = Convert.ToString(c.Attribute("defval").Value);
                    dt_InputColumn.Rows.Add(dr);
                }
            }

            return JsonConvert.SerializeObject(dt_InputColumn);

        }

        [HttpPost]
        public void setFilter_condition(string fltercond)
        {
            Common.Global.filter_condition = fltercond;


        }
    }
}