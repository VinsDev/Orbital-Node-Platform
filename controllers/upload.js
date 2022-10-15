const upload = require("../middleware/upload");
const newsImages = require("../middleware/newsImages");
const dbConfig = require("../config/db");
const db = require("../config/db");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = dbConfig.url;

const local = "http://localhost:3000/files/";
const web = "http://orbital-node.herokuapp.com/files/";
const baseUrl = local;

const nlocal = "http://localhost:3000/news/";
const nweb = "http://orbital-node.herokuapp.com/news/";
const nbaseUrl = nlocal;

const mongoClient = new MongoClient(url);

// LANDING . . .
const getSchools = async (req, res) => {
    try {
        let schoolList = [];
        let payload = req.body.payload.trim();
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        var cursor = schools.find({ 'school_info.name': { $regex: new RegExp('^' + payload + '.*', 'i') } });


        cursor.forEach(school => schoolList.push(school)).then(() => {
            res.status(200).send({ payload: schoolList.slice(0, 10) });
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}

const sendForm = async (req, res, url) => {
    try {

        var school_model = {
            school_info: {
                name: req.body.name,
                logo: baseUrl + url[0].filename,
                email: req.body.email,
                phone: req.body.phone,
                adress: req.body.adress,
                pic1: baseUrl + url[1].filename,
                pic2: baseUrl + url[2].filename,
                about: req.body.about,
                d_about: req.body.d_about,
                category: req.body.category,
                p_name: req.body.p_name,
                ppic: baseUrl + url[3].filename,
                vp1name: req.body.vp1name,
                vp1pic: baseUrl + url[4].filename,
                vp2name: req.body.vp2name,
                vp2pic: baseUrl + url[5].filename,
                mission: req.body.mission,
                vision: req.body.vision,
                anthem: req.body.anthem,
                fees: req.body.fees,
                e_register: req.body.e_register,
                agent: req.body.agent,
            },
            news: [],
            fees_info: {
                bank_name: "",
                ac_num: "",
                fees: "",
            },
            feedbacks: [],
            classes: [],
            sessions: [],
            admin: {
                admin_username: req.body.email,
                admin_password: req.body.name + "-ons!",
            }
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").insertOne(school_model)
    } catch (error) {
        console.log(error);
    }
}

const uploadRegForm = async (req, res) => {
    try {
        await upload(req, res);
        await sendForm(req, res, req.files)

        if (req.files.length <= 0) {
            return res
                .status(400)
                .send({ message: "You must select at least 1 file." });
        }

        return res.status(200).render("success", { name: req.body.name });
    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload.",
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`,
        });
    }
};

const regAgent = async (req, res) => {
    try {

        var data = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            account: req.body.account,
            bank: req.body.bank,
            about: req.body.about,
            state: req.body.state,
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("agents").insertOne(data);

        return res.status(200).render("success_agent", { name: req.body.name });
    } catch {
        console.log(error);
    }
}


// SCHOOL . . .
const downloadImage = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const downloadNewsImage = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.newsBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const getListFiles = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const images = database.collection(dbConfig.imgBucket + ".files");

        const cursor = images.find({});

        if ((await cursor.count()) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }

        let fileInfos = [];
        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename,
            });
        });

        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};


// ADMIN . . .
const login = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'admin.admin_username': req.body.username.trim() });
        if (school_data) {
            if (school_data.admin.admin_password === req.body.password.trim()) {
                res.send({
                    status: "accepted",
                    school: school_data.school_info.name
                });
            } else {
                res.send({ status: "declined" });
            }
        }
        else {
            res.send({ status: "declined" });
        }
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}

const upload_news = async (req, res) => {
    try {
        await newsImages(req, res);

        var news_model = {
            header: req.body.heading,
            details: req.body.details,
            image: nbaseUrl + req.file.filename
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").updateOne({ 'school_info.name': req.params.sname },
            { $push: { news: news_model } }
        );

        return res.status(200).send({ message: "Success" });
    } catch (error) {
        console.log(error);
    }
}

const createSession = async (req, res) => {
    try {

        var session_model = {
            name: req.body.name,
            sdate: req.body.sdate,
            edate: req.body.edate,
            terms: [
                {
                    name: "first",
                    students: []
                },
                {
                    name: "second",
                    students: []
                },
                {
                    name: "third",
                    students: []
                },
            ]
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").updateOne({ 'school_info.name': req.params.sname },
            { $push: { sessions: session_model } }
        );

        return res.status(200).send({ message: "Success" });
    } catch {
        console.log(error);
    }
}

const createClass = async (req, res) => {
    try {

        class_model = {
            name: req.body.name,
            subjects: []
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").updateOne({ 'school_info.name': req.params.sname },
            { $push: { classes: class_model } }
        );

        return res.status(200).send({ message: "Success" });
    } catch {
        console.log(error);
    }
}

const createSubject = async (req, res) => {
    try {

        class_subject = {
            name: req.body.name,
            class: req.body.class_name,
            teacher: req.body.teacher,
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").findOneAndUpdate({ "school_info.name": req.params.sname }, { $push: { "classes.$[t].subjects": class_subject } }, { arrayFilters: [{ "t.name": req.body.class_name }] })
        return res.status(200).send({ message: "Success" });
    } catch {
        console.log(error);
    }
}


module.exports = {
    uploadRegForm,
    regAgent,
    getSchools,
    getListFiles,
    downloadImage,
    downloadNewsImage,
    login,
    upload_news,
    createSession,
    createClass,
    createSubject,
};