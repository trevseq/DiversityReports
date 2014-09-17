using DiversityReports.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace DiversityReports.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Default()
        {
            return View();
        }
        public ActionResult PopulateGrid(string str)
        {
            dynamic employee = null;
            var db = new ADP_FeedEntities();

            employee = (from p in db.Employees
                        join s in db.EEOSurveys on p.EmployeeID equals s.EmployeeID
                        join e in db.Ethnicities on s.EthnicityID equals e.EthnicityID
                        where str.Contains(p.EmployeeID.ToString()) || str.Contains(p.FirstName) || str.Contains(p.LastName)
                        select new
                        {
                            employeeID = p.EmployeeID,
                            lastName = p.LastName,
                            firstName = p.FirstName,
                            ethnicityID = s.EthnicityID,
                            ethnicity = e.Ethnicity1
                        }).FirstOrDefault();

            return new JsonResult()
            {
                Data = employee,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public ActionResult ResaveDbData(int employeeId, int ethId)
        {
            var db = new ADP_FeedEntities();
            bool _success = false;

            var emp = db.EEOSurveys.Where(e => e.EmployeeID.Value == employeeId).FirstOrDefault();

            emp.VisuallyIdentifyAdmin = ethId;


            //db.SaveChanges();
            return new JsonResult()
            {
                Data = _success,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
        public ActionResult GetEthnicities()
        {
            dynamic data = null;
            var db = new ADP_FeedEntities();
            data = (from e in db.Ethnicities
                    select new
                    {
                        ethnicityID = e.EthnicityID,
                        ethnicity = e.Ethnicity1
                    });

            return new JsonResult()
            {
                Data = data,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}