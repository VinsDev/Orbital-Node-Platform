const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/operations");
const pagesController = require("../controllers/pages");

const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

const urlencodedParser = bodyParser.urlencoded({ extended: false });

let routes = app => {
  // LANDING PAGES . . .
  router.get("/delete-images", uploadController.deleteImages);
  router.get("/", homeController.first);
  router.get("/home", homeController.home);
  router.get("/about", pagesController.about);
  router.get("/services", pagesController.services);
  router.get("/contact", pagesController.contact);
  router.get("/purchase-node", pagesController.purchase_node);
  router.get("/register-pri", pagesController.register_pri);
  router.get("/register-sec", pagesController.register_sec);
  router.get("/agent", pagesController.agent);

  // OPERATIONS . . .
  router.post("/register", uploadController.uploadRegForm);
  router.get("/verify_transaction", uploadController.verifyTransaction);
  router.post("/agent", uploadController.regAgent);
  router.post("/verify", uploadController.verifyActivationPin);
  router.get("/files", uploadController.getListFiles);
  router.get("/files/:name", uploadController.downloadImage);
  router.get("/schools/:sname/portal/:stdclass/:stdname/term-result", uploadController.downloadPdf);
  router.get("/news/:name", uploadController.downloadNewsImage);
  router.post("/getSchools", uploadController.getSchools);
  router.post("/subscribeNode", uploadController.subscribeNode);
  router.post("/admin/:sname/getSubjects", uploadController.getSubjects);
  router.get("/admin/:sname/getClassSubjects/:class", uploadController.getClassSubjects);
  router.post("/admin/:sname/getStudents", uploadController.getStudents);
  router.post("/admin/:sname/student-fees", uploadController.setStudentFees);
  router.post("/admin/:sname/getSubjectsResultsList", uploadController.getSubjectsResultsList);
  router.post("/admin/:sname/getSubjectsResults", uploadController.getSubjectsResults);
  router.post("/admin/:sname/getStudentResults", uploadController.getStudentResults);
  router.post("/admin/:sname/getTermStatus", uploadController.getTermStatus);
  router.post("/admin/:sname/activateTerm", uploadController.activateTerm);
  router.post("/admin/:sname/updateSubjectsResults", uploadController.updateSubjectsResults);
  router.post("/admin/:sname/upcoming-news/delete", uploadController.deleteNews);
  router.post("/admin/:sname/sessions/delete", uploadController.deleteSession);
  router.post("/admin/:sname/classes/delete", uploadController.deleteClass);
  router.post("/admin/:sname/subjects/delete", uploadController.deleteSubject);
  router.post("/admin/:sname/student-info/import", uploadController.importStudents);
  router.post("/admin/:sname/student-info/delete", uploadController.deleteStudent);
  router.post("/admin/:sname/updateCurrentTerm", uploadController.updateCurrentTerm);
  router.post("/admin/:sname/changePassword", uploadController.updateAdminPassword);
  router.post("/admin/:sname/updateTermDates", uploadController.updateTermDates);
  router.post("/admin/:sname/updateResultStatus", uploadController.updateResultStatus);
  router.post("/admin/login", urlencodedParser, uploadController.login);
  router.post("/schools/:sname/portal/login", urlencodedParser, uploadController.portaLogin);
  router.post("/schools/:sname/follow", urlencodedParser, uploadController.upload_feedbacks);
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
  router.get("/schools/:sname/portal/:stdclass/:studname", pagesController.profile);
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
  router.get("/admin/:sname/blue-print", pagesController.blue_print);
  router.get("/admin/:sname/student-register", pagesController.student_register);
  router.get("/admin/:sname/continous-assessments", pagesController.continous_assessments);
  router.get("/admin/:sname/student-results", pagesController.student_results);
  router.get("/admin/:sname/parents", pagesController.parents);
  router.get("/admin/:sname/sessions", pagesController.sessions);
  router.get("/admin/:sname/classes", pagesController.classes);
  router.get("/admin/:sname/subjects", pagesController.subjects);
  router.get("/admin/:sname/assessment/:class/:subject", pagesController.assessment);
  router.get("/admin/:sname/result/:class/:student", pagesController.result);

  // TEACHERS APP . . .
  router.post("/ontap/staffLogin", uploadController.staffLogin);
  router.get("/ontap/:sname/getClassList", uploadController.getClassList);
  router.get("/ontap/:sname/getAttendanceForClass/:class", uploadController.getAttendanceForClass);

  return app.use("/", router);
};

module.exports = routes;