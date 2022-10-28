const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const dbConfig = require("../config/db");

const url = dbConfig.url;
const mongoClient = new MongoClient(url);

const orbital = require("../computations/compile-results");

// ORBITAL NODE LANDING . . .
const about = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../views/about.html`));
};
const services = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../views/services.html`));
};
const contact = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../views/contact.html`));
};
const register = (req, res) => {
    return res.render("inner/register");
};
const agent = (req, res) => {
    return res.render("inner/agent");
};

// SCHOOL . . .
const s_home = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/index", { school_obj: school_data.school_info, news: school_data.news });



    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }

};
const admissions = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/admissions", { school_obj: school_data.school_info });



    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }

};
const portal = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/portal", { school_obj: school_data.school_info });



    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }

};
const profile = async (req, res) => {
    try {
        await mongoClient.connect();
        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });

        var lses = school_data.sessions.length - 1;
        var currTermIndex = school_data.sessions[lses].terms.findIndex(i => i.name === school_data.sessions[lses].current_term);
        var stdIndex = school_data.sessions[lses].terms[currTermIndex].students.findIndex(i => i.name === req.params.studname);

        return res.render("../school/inner/profile", { school_obj: school_data.school_info, student_info: school_data.sessions[lses].terms[currTermIndex].students[stdIndex] });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }

};
const fees = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/fees", { school_obj: school_data.school_info });



    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }

};
const follow_up = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/contact", { school_obj: school_data.school_info });



    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }

};
const s_about = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/about", { school_obj: school_data.school_info });



    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }

};

// SCHOOL ADMIN . . .
const admin = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../admin/index.html`));
};
const dashboard = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        if (school_data.sessions.length > 0 && school_data.classes.length > 0) {
            lses = school_data.sessions.length - 1;
            lcls = school_data.classes.length - 1;
            return res.render("../admin/dashboard", {
                school_obj: school_data.school_info,
                students: school_data.sessions[lses].terms[0].students.length,
                teachers: school_data.classes[lcls].subjects.length,
                subscription: 10,
                session: school_data.sessions[lses].name,
                current_term: school_data.sessions[lses].current_term,
            });
        } else {
            return res.render("../admin/dashboard", {
                school_obj: school_data.school_info,
                students: "0",
                teachers: "0",
                subscription: "Unknown",
                session: "Unknown",
                current_term: "first"
            });
        }
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const school_info = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/school-info", { school_obj: school_data.school_info });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const upcoming_news = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/upcoming-news", { school_obj: school_data.school_info, news: school_data.news });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const fees_info = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/fees-info", { school_obj: school_data.school_info });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const student_info = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/student-info", {
            school_obj: school_data.school_info,
            sessions_data: school_data.sessions,
            class_data: school_data.classes
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const student_fees = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/student-fees", {
            school_obj: school_data.school_info,
            sessions_data: school_data.sessions,
            class_data: school_data.classes
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const student_register = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/student-register", { school_obj: school_data.school_info });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const continous_assessments = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });

        return res.render("../admin/subject-results", {
            school_obj: school_data.school_info,
            sessions_data: school_data.sessions,
            class_data: school_data.classes
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const student_results = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/student-results", {
            school_obj: school_data.school_info,
            sessions_data: school_data.sessions,
            class_data: school_data.classes
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const parents = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/parents", { school_obj: school_data.school_info });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const sessions = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/sessions", {
            school_obj: school_data.school_info,
            session_data: school_data.sessions
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const classes = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/classes", {
            school_obj: school_data.school_info, class_data: school_data.classes
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const subjects = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        return res.render("../admin/subjects", { school_obj: school_data.school_info, class_data: school_data.classes });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const assessment = async (req, res) => {
    try {
        await mongoClient.connect();

        var classIndex = -1;
        var subjectIndex = -1;
        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });

        for (var i = 0; i < school_data.classes.length; i++) {
            if (school_data.classes[i].name === req.params.class) {
                classIndex = i;
                break;
            }
        }

        for (var i = 0; i < school_data.classes[classIndex].subjects.length; i++) {
            if (school_data.classes[classIndex].subjects[i].name === req.params.subject) {
                subjectIndex = i;
                break;
            }
        }

        return res.render("../admin/inner/assessment", {
            school_obj: school_data.school_info,
            sessions_data: school_data.sessions,
            subject_data: school_data.classes[classIndex].subjects[subjectIndex],
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const result = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);

        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });

        orbital.computeResults(req.params.sname, school_data.sessions[0].name, school_data.sessions[0].terms[0].name, school_data.classes[0].name);

        return res.render("../admin/inner/result", {
            school_obj: school_data.school_info,
            sessions_data: school_data.sessions,
            student_name: req.params.student,
            class_name: req.params.class
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

module.exports = {
    about,
    services,
    contact,
    register,
    agent,
    s_home,
    admissions,
    portal,
    fees,
    follow_up,
    s_about,
    admin,
    dashboard,
    school_info,
    upcoming_news,
    fees_info,
    student_info,
    student_fees,
    student_register,
    continous_assessments,
    student_results,
    parents,
    sessions,
    classes,
    subjects,
    assessment,
    result,
    profile
};