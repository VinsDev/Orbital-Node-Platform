const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const dbConfig = require("../config/db");

const url = dbConfig.url;
const mongoClient = new MongoClient(url);

// ORBITAL NODE . . .
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
    return res.render("register");
};

const agent = (req, res) => {
    return res.render("agent");
};


// SCHOOL . . .
const s_home = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ name: { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/index", { school_obj: school_data });



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
        let school_data = await schools.findOne({ name: { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/admissions", { school_obj: school_data });



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
        let school_data = await schools.findOne({ name: { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/portal", { school_obj: school_data });



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
        let school_data = await schools.findOne({ name: { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/fees", { school_obj: school_data });



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
        let school_data = await schools.findOne({ name: { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/contact", { school_obj: school_data });



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
        let school_data = await schools.findOne({ name: { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });
        return res.render("../school/about", { school_obj: school_data });



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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/dashboard", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/school-info", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/upcoming-news", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/fees-info", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/student-info", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/student-fees", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/student-register", { school_obj: school_data });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};
const subject_results = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/subject-results", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/student-results", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/parents", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/sessions", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/classes", { school_obj: school_data });
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
        let school_data = await schools.findOne({ name: req.params.sname });
        return res.render("../admin/subjects", { school_obj: school_data });
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
    subject_results,
    student_results,
    parents,
    sessions,
    classes,
    subjects
};