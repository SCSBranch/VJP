using ShopTranProj.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ShopTranProj
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            //);


            routes.Add("Default", new GuidRoute(
        "{controller}/{action}/{id}",
        new
        {
            controller = "Login",
            action = "Login",
            guid = "",
            id = UrlParameter.Optional
        }));

            routes.Add("GuidRoute", new GuidRoute(
                "g/{guid}/{controller}/{action}/{id}",
                new
                {
                    controller = "Login",
                    action = "Login",
                    guid = "",
                    id = UrlParameter.Optional
                }));

        }
    }
}
