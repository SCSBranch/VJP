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
    public class SupportController : Controller
    {
        //
        // GET: /Support/
       
        public ActionResult ChangeRole()
        {
            return View();
        }

    }
}