const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const pagesController = require("../controllers/pages");

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

  // SCHOOL PAGES . . .
  router.all("/schools/:sname/home", pagesController.s_home);
  router.get("/schools/:sname/admissions", pagesController.admissions);
  router.get("/schools/:sname/fees", pagesController.fees);
  router.get("/schools/:sname/portal", pagesController.portal);
  router.get("/schools/:sname/follow", pagesController.follow_up);
  router.get("/schools/:sname/about", pagesController.s_about);


  return app.use("/", router);
};

module.exports = routes;