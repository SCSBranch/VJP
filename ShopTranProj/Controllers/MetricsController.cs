﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ShopTranProj.Controllers
{
    public class MetricsController : Controller
    {
        // GET: Metrics
        public ActionResult ChartForm()
        {
            return View();
        }

        public ActionResult RFQTurnAroundForm()
        {
            return View();
        }

        public ActionResult MonthlyQuoteForm()
        {
            return View();
        }

    }
}