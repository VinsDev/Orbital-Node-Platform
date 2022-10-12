const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const pagesController = require("../controllers/pages");

const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let routes = app => {
  // LANDING PAGES . . .
  router.get("/", homeController.getHome);
  router.get("/about", pagesController.about);
  router.get("/services", pagesController.services);
  router.get("/contact", pagesController.contact);
  router.get("/register", pagesController.register);
  router.get("/agent", pagesController.agent);

  // UPLOADS AND DOWNLOADS . . .
  router.post("/register", uploadController.uploadRegForm);
  router.post("/agent", uploadController.regAgent);
  router.get("/files", uploadController.getListFiles);
  router.get("/files/:name", uploadController.download);
  router.post("/getSchools", uploadController.getSchools);
  router.post("/login", urlencodedParser, uploadController.login);

  // SCHOOL PAGES . . .
  router.all("/schools/:sname/home", pagesController.s_home);
  router.get("/schools/:sname/admissions", pagesController.admissions);
  router.get("/schools/:sname/fees", pagesController.fees);
  router.get("/schools/:sname/portal", pagesController.portal);
  router.get("/schools/:sname/follow", pagesController.follow_up);
  router.get("/schools/:sname/about", pagesController.s_about);

  // ADMIN PANEL . . .
  router.get("/admin", pagesController.admin);
  router.all("/admin/:sname/dashboard", pagesController.dashboard);
  router.get("/admin/:sname/school-info", pagesController.school_info);
  router.get("/admin/:sname/upcoming-news", pagesController.upcoming_news);
  router.get("/admin/:sname/fees-info", pagesController.fees_info);
  router.get("/admin/:sname/student-info", pagesController.student_info);
  router.get("/admin/:sname/student-fees", pagesController.student_fees);
  router.get("/admin/:sname/student-register", pagesController.student_register);
  router.get("/admin/:sname/subject-results", pagesController.subject_results);
  router.get("/admin/:sname/student-results", pagesController.student_results);
  router.get("/admin/:sname/parents", pagesController.parents);
  router.get("/admin/:sname/sessions", pagesController.sessions);
  router.get("/admin/:sname/classes", pagesController.classes);
  router.get("/admin/:sname/subjects", pagesController.subjects);
  router.get("/admin/:sname/assessment", pagesController.assessment);


  return app.use("/", router);
};

module.exports = routes;