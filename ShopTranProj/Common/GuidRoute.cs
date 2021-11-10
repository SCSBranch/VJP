using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Text.RegularExpressions;

namespace ShopTranProj.Common
{
    public class GuidRoute : Route
    {
        private readonly bool _isGuidRoute;

        public GuidRoute(string uri, object defaults)
            : base(uri, new RouteValueDictionary(defaults), new MvcRouteHandler())
        {
            _isGuidRoute = uri.Contains("guid");

            DataTokens = new RouteValueDictionary();
        }

        public override RouteData GetRouteData(HttpContextBase httpContext)
        {
            var routeData = base.GetRouteData(httpContext);
            if (routeData == null)
                return null;

            if (!routeData.Values.ContainsKey("guid") ||
            routeData.Values["guid"].ToString() == "")
                routeData.Values["guid"] = Guid.NewGuid().ToString("N");

            return routeData;
        }

        public override VirtualPathData GetVirtualPath
        (RequestContext requestContext, RouteValueDictionary values)
        {
            return !_isGuidRoute ? null : base.GetVirtualPath(requestContext, values);
        }        
    }

    public static class ControllerExtensionMethods
    {
        public static string GetGuid(this Controller controller)
        {
            return controller.RouteData.Values["guid"].ToString();
        }

        public static void SetGuidSession(this Controller controller, string name, object value)
        {
            controller.Session[controller.GetGuid() + "_" + name] = value;
        }

        public static object GetGuidSession(this Controller controller, string name)
        {
            return controller.Session[controller.GetGuid() + "_" + name];
        }        
    }
}