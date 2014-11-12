using DiversityReports.Models;
using System.Linq;
using System.Web.Mvc;

namespace DiversityReports.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Default()
        {
            return View();
        }

        /// <summary>
        /// Searches the ADP_Feed database table Employees for records where the search string is present.
        /// Used to populate the ParamQuery grid with employees' record information.
        /// </summary>
        /// <param name="str">String to search for. Can be EmployeeID, FirstName, LastName, or a combination of the three</param>
        /// <returns>JSON object array "employee" (can return a single result or multiples)</returns>
        public ActionResult PopulateGrid(string str)
        {
            dynamic employee = null;
            var db = new ADP_FeedEntities();

            employee = (from p in db.Employees
                        join s in db.EEOSurveys on p.EmployeeID equals s.EmployeeID
                        join e in db.Ethnicities on s.EthnicityID equals e.EthnicityID
                        join c in db.EEO_Category on p.EEOCategory_ID equals c.EEOCategory_ID
                        join t in db.Titles on p.JobTitle equals t.TitleID
                        where str.Contains(p.EmployeeID.ToString()) || str.Contains(p.FirstName) || str.Contains(p.LastName) || str.Contains(p.PreferredFirstName) || str.Contains(p.PreferredLastName)

                        select new
                        {
                            employeeID = p.EmployeeID,
                            lastName = p.LastName,
                            firstName = p.FirstName,
                            ethnicityID = s.EthnicityID,
                            ethnicity = e.Ethnicity1,
                            titleID = p.JobTitle,
                            title = t.Title1,
                            categoryID = p.EEOCategory_ID,
                            category = c.EEOCategory_Desc
                        });

            return new JsonResult()
            {
                Data = employee,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        // TODO: Fix me!
        public ActionResult ResaveDbData(int employeeId, int ethId, int titleId, int catId)
        {
            //TODO: verify that title has a link to the category- if not, create one.
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

        /// <summary>
        /// Gets a list of ethnicities from the Ethnicities table
        /// to populate the ethnicities dropdown
        /// </summary>
        /// <returns>JSON object array "data"</returns>
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

        /// <summary>
        /// Gets a list of job titles from the Titles table
        /// to populate the titles dropdown
        /// </summary>
        /// <returns>JSON object array "data"</returns>
        public ActionResult GetTitles()
        {
            dynamic data = null;
            var db = new ADP_FeedEntities();
            data = (from e in db.Titles
                    select new
                    {
                        titleID = e.TitleID,
                        title = e.Title1
                    });

            return new JsonResult()
            {
                Data = data,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        /// <summary>
        /// Gets list of EEO categories from the EEO_Category table
        /// to populate the categories dropdown
        /// </summary>
        /// <returns>JSON object array "data"</returns>
        public ActionResult GetCategories()
        {
            dynamic data = null;
            var db = new ADP_FeedEntities();
            data = (from e in db.EEO_Category
                    select new
                    {
                        categoryID = e.EEOCategory_ID,
                        category = e.EEOCategory_Desc
                    });

            return new JsonResult()
            {
                Data = data,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}