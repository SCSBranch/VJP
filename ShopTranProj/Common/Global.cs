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
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Web.Script.Serialization;
using System.ComponentModel;

namespace ShopTranProj.Common
{
    public class Global
    {
        public static string optiontype = "";
        public static string question = "";
        public static string options = "";
        public static string filter_condition = "";
        public static string userRowid = "";
        public static string urserRoll = "";
        public static string seq_qus = "";
        public static string userId = "";
        public static string path = "";
        public static string file_name = "";
        public static string guidvalue = "";
        public static string user_name = "";
        public static string comp_rowid = "";
        public static string orgn_name = "";

        public static string role_id = "";
        public static string role_desc = "";
        public static string seq_qus_code = "";
        public static string seq_qus_ans = "";
        public static string orgn_type = "";
        public static string orgn_id = "";
        public static string locn_id = "";
        public static string product_code = "";
        public static string login_status = "";
        public static string user_id = "";
        public static string client_name = "";

        public static string progress_status = "";
        public static string progress_percentage = "";

        public static string latest_project_id = "";
        public static string latest_project_rowid = "";
        public static string client_profile_code = "";
        public static string order_id = "";
        public static string test_count = "";


        public static string component_name { get; set; }

        public static string view_prem { get; set; }
    }
}
