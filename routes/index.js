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
  router.get("/files/:name", uploadController.downloadImage);
  router.get("/pdf", uploadController.downloadPdf);
  router.get("/news/:name", uploadController.downloadNewsImage);
  router.post("/getSchools", uploadController.getSchools);
  router.post("/admin/:sname/getSubjects", uploadController.getSubjects);
  router.post("/admin/:sname/getStudents", uploadController.getStudents);
  router.post("/admin/:sname/getSubjectsResultsList", uploadController.getSubjectsResultsList);
  router.post("/admin/:sname/getSubjectsResults", uploadController.getSubjectsResults);
  router.post("/admin/:sname/getStudentResults", uploadController.getStudentResults);
  router.post("/admin/:sname/updateSubjectsResults", uploadController.updateSubjectsResults);
  router.post("/admin/:sname/updateCurrentTerm", uploadController.updateCurrentTerm);
  router.post("/admin/login", urlencodedParser, uploadController.login);
  router.post("/schools/:sname/portal/login", urlencodedParser, uploadController.portaLogin);
  router.post("/admin/:sname/upcoming-news", uploadController.upload_news);
  router.post("/admin/:sname/sessions", uploadController.createSession);
  router.post("/admin/:sname/classes", uploadController.createClass);
  router.post("/admin/:sname/subjects", uploadController.createSubject);
  router.post("/admin/:sname/students", uploadController.createStudent);

  // SCHOOL PAGES . . .
  router.all("/schools/:sname/home", pagesController.s_home);
  router.get("/schools/:sname/admissions", pagesController.admissions);
  router.get("/schools/:sname/fees", pagesController.fees);
  router.get("/schools/:sname/portal", pagesController.portal);
  router.get("/schools/:sname/portal/:studname", pagesController.profile);
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
  router.get("/admin/:sname/continous-assessments", pagesController.continous_assessments);
  router.get("/admin/:sname/student-results", pagesController.student_results);
  router.get("/admin/:sname/parents", pagesController.parents);
  router.get("/admin/:sname/sessions", pagesController.sessions);
  router.get("/admin/:sname/classes", pagesController.classes);
  router.get("/admin/:sname/subjects", pagesController.subjects);
  router.get("/admin/:sname/assessment/:class/:subject", pagesController.assessment);
  router.get("/admin/:sname/result/:class/:student", pagesController.result);


  return app.use("/", router);
};

module.exports = routes;