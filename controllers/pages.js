const path = require("path");
const MongoClient = require("mongodb").MongoClient;
const dbConfig = require("../config/db");

const url = dbConfig.url;
const mongoClient = new MongoClient(url);

// LANDING . . .
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
    s_about
};