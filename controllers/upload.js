const upload = require("../middleware/upload");
const dbConfig = require("../config/db");
const db = require("../config/db");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = dbConfig.url;

const baseUrl = "http://localhost:8080/files/";

const mongoClient = new MongoClient(url);

/* const uploadFiles = async (req, res) => {
  try {
    await upload(req, res);
    console.log(req.file);

    if (req.file == undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }

    return res.send({
      message: "File has been uploaded.",
    });
  } catch (error) {
    console.log(error);

    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
}; */

const sendForm = async (req, res, url) => {
    try {

        var data = {
            name: req.body.name,
            logo: baseUrl + url[0].filename,
            email: req.body.email,
            phone: req.body.phone,
            adress: req.body.adress,
            pic1: baseUrl + url[1].filename,
            about: req.body.about,
            d_about: req.body.d_about,
            category: req.body.category,
            p_name: req.body.p_name,
            ppic: baseUrl + url[2].filename,
            vpname: req.body.vpname,
            vppic: baseUrl + url[3].filename,
            mission: req.body.mission,
            vision: req.body.vision,
            anthem: req.body.anthem,
            gmname: req.body.gmname,
            gmpic: baseUrl + url[4].filename,
            mtname: req.body.mtname,
            mtpic: baseUrl + url[5].filename,
            etname: req.body.etname,
            etpic: baseUrl + url[6].filename,
            fees: req.body.fees,
            e_register: req.body.e_register,
            agent: req.body.agent
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").insertOne(data)
    } catch (error) {
        console.log(error);
    }
}

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

const getSchools = async (req, res) => {
    try {
        let schoolList = [];
        let payload = req.body.payload.trim();
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        var cursor = schools.find({ name: { $regex: new RegExp('^' + payload + '.*', 'i') } });


        cursor.forEach(school => schoolList.push(school)).then(() => {
            res.status(200).send({ payload: schoolList.slice(0, 10) });
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}

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

const download = async (req, res) => {
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

module.exports = {
    uploadRegForm,
    regAgent,
    getSchools,
    getListFiles,
    download,
};