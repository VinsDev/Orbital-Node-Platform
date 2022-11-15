const upload = require("../middleware/upload");
const newsImages = require("../middleware/newsImages");
const dbConfig = require("../config/db");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
var PdfPrinter = require('pdfmake');

const url = dbConfig.url;
const local = "http://localhost:3000/files/";
const web = "http://orbital-node.herokuapp.com/files/";
const baseUrl = web;
const nlocal = "http://localhost:3000/news/";
const nweb = "http://orbital-node.herokuapp.com/news/";
const nbaseUrl = nweb;
const mongoClient = new MongoClient(url);
const orbital = require("../computations/compile-results");
const { response } = require("express");

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
        var st = new Date();
        var temp = new Date(date_obj_converter(st));
        var exp = new Date(temp.setDate(temp.getDate() + 120));

        var school_model = {
            school_info: {
                name: req.body.name.trim(),
                logo: baseUrl + url[0].filename,
                email: req.body.email.trim(),
                phone: req.body.phone.trim(),
                adress: req.body.adress.trim(),
                state: req.body.state.trim(),
                pic1: baseUrl + url[1].filename,
                pic2: baseUrl + url[2].filename,
                about: req.body.about.trim(),
                d_about: req.body.d_about.trim(),
                p_name: req.body.p_name.trim(),
                ppic: baseUrl + url[3].filename,
                vp1name: req.body.vp1name.trim(),
                vp1pic: baseUrl + url[4].filename,
                vp2name: req.body.vp2name.trim(),
                vp2pic: baseUrl + url[5].filename,
                mission: req.body.mission.trim(),
                vision: req.body.vision.trim(),
                anthem: req.body.anthem.trim(),
                fees: req.body.fees,
                e_register: req.body.e_register,
                agent: req.body.agent.trim(),
                reg_date: st,
                exp_date: exp
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
                admin_username: req.body.email.trim(),
                admin_password: req.body.phone.trim(),
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

        return res.status(200).render("inner/success", { name: req.body.name });
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

        return res.status(200).render("inner/success_agent", { name: req.body.name });
    } catch {
        console.log(error);
    }
}
const verifyTransaction = async (req, res) => {
    const axios = require("axios");
    try {
        const ref = req.query.reference;
        let output;
        await axios.get(`https://api.paystack.co/transaction/verify/${ref}`, {
            headers: {
                authorization: "sk_test_9b4d25a826d5ea1946525393541110ad7ba4e98e",
                //replace TEST SECRET KEY with your actual test secret 
                //key from paystack
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
        }
        ).then((success) => {
            output = success;
            return res.status(200).send({ success: true });
        }).catch((error) => {
            output = error;
            return res.status(200).send({ success: true });
        });
        //now we check for internet connectivity issues
        if (!output.response && output.status !== 200) console.log("No internet Connection");
        //next,we confirm that there was no error in verification.
        if (output.response && !output.response.data.status) console.log("Error verifying payment , 'unknown Transaction Reference Id'");

        //we return the output of the transaction
    }


    catch (error) {
        console.log(error);
        return res.end();
    }
};



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
const downloadPdf = async (req, res) => {
    try {
        await mongoClient.connect();
        var student_data;
        var stdNumber = 0;

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");

        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });

        var lses = school_data.sessions.length - 1;
        var currTermIndex = school_data.sessions[lses].terms.findIndex(i => i.name === school_data.sessions[lses].current_term);

        for (var i = 0; i < school_data.sessions[lses].terms[currTermIndex].students.length; i++) {
            if (school_data.sessions[lses].terms[currTermIndex].students[i].name === req.params.stdname && school_data.sessions[lses].terms[currTermIndex].students[i].class === req.params.stdclass) {
                student_data = school_data.sessions[lses].terms[currTermIndex].students[i];
                break;
            }
        }

        for (var i = 0; i < school_data.sessions[lses].terms[currTermIndex].students.length; i++) {
            if (school_data.sessions[lses].terms[currTermIndex].students[i].class === req.params.stdclass) {
                stdNumber++;
            }
        }



        const fetch = require('node-fetch');
        var url = school_data.school_info.logo;
        var rest = await fetch(url, { encoding: null });
        imageBuffer = await rest.buffer();
        img = new Buffer.from(imageBuffer, 'base64');

        var Roboto = require('../fonts/Roboto');

        let tableItems = [
            [{ rowSpan: 2, text: 'Subjects', alignment: 'center', style: 'tableHeader' }, { text: 'C. Assessments', style: 'tableHeader', colSpan: 5, alignment: 'center' }, {}, {}, {}, {}, { text: 'Total', style: 'tableHeader', alignment: 'center' }, { text: 'Average', style: 'tableHeader', alignment: 'center' }, { text: 'Highest', style: 'tableHeader', alignment: 'center' }, { text: 'Lowest', style: 'tableHeader', alignment: 'center' }, { text: 'Rank', style: 'tableHeader', alignment: 'center' }, { text: 'Grade', style: 'tableHeader', alignment: 'center' }],
            ['', { text: '1ST\nCA', style: 'tableHeader', alignment: 'center' }, { text: '2ND\nCA', style: 'tableHeader', alignment: 'center' }, { text: '1ST\nTEST', style: 'tableHeader', alignment: 'center' }, { text: '2ND\nTEST', style: 'tableHeader', alignment: 'center' }, { text: 'EXAMS', style: 'tableHeader', alignment: 'center' }, '', '', '', '', '', ''],
        ];

        for (var i = 0; i < student_data.subjects.length; i++) {
            tableItems.push([{ text: student_data.subjects[i].name, style: 'tableHeader' }, { text: student_data.subjects[i].ass[0], style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].ass[1], style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].ass[2], style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].ass[3], style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].ass[4], style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].total, style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].average, style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].highest, style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].lowest, style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].position, style: 'tableHeader', alignment: 'center' }, { text: student_data.subjects[i].grade, style: 'tableHeader', alignment: 'center' }])
        }

        var dt = new Date();
        var mm = ((dt.getMonth() + 1) >= 10) ? (dt.getMonth() + 1) : '0' + (dt.getMonth() + 1);
        var dd = ((dt.getDate()) >= 10) ? (dt.getDate()) : '0' + (dt.getDate());
        var yyyy = dt.getFullYear();
        var date = yyyy + "/" + mm + "/" + dd;

        var docDefinition = {
            content: [
                {
                    image: img,
                    fit: [60, 60],
                    style: {
                        alignment: 'center',
                    },
                },
                {
                    text: school_data.school_info.name,
                    style: 'header',
                    alignment: 'center'
                },
                {
                    text: `${school_data.school_info.state} Nigeria`,
                    style: 'subheader',
                    alignment: 'center'
                },
                {
                    columns: [
                        {
                            width: '*',
                            style: 'top',
                            text: `Name of Student: ${student_data.name}`
                        },
                        {
                            width: 'auto',
                            style: 'top',
                            text: `Session: ${school_data.sessions[lses].name}`
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '*',
                            style: 'top',
                            text: `School: ${school_data.school_info.name}`
                        },
                        {
                            width: 'auto',
                            style: 'top',
                            text: `Sex: ${student_data.gender}`
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '*',
                            style: 'top',
                            text: `Term: ${school_data.sessions[lses].terms[currTermIndex].name}`
                        },
                        {
                            width: 'auto',
                            style: 'top',
                            text: `Date of Birth: ${student_data.dob}`
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '*',
                            style: 'top',
                            text: `Class: ${student_data.class}`
                        },
                        {
                            width: 'auto',
                            style: 'top',
                            text: `Number in Class: ${stdNumber}`
                        },
                    ]
                },
                {
                    style: 'tableExample',
                    color: '#000',
                    table: {
                        widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        // headerRows: 2,
                        body: tableItems
                    }
                },
                {
                    columns: [
                        {
                            width: '*',
                            style: 'bottom',
                            text: `NUMBER OF SUBJECTS: ${student_data.subjects.length}`
                        },
                        {
                            width: '*',
                            style: 'bottom',
                            text: `TOTAL OBTAINABLE MARKS: ${student_data.subjects.length * 100}`
                        },
                        {
                            width: 'auto',
                            style: 'bottom',
                            text: `MARKS OBTAINED: ${student_data.total}`
                        },
                    ]
                },
                {
                    columns: [
                        {
                            width: '*',
                            style: 'bottom',
                            text: `CLASS AVERAGE: ${student_data.average}`
                        },
                        {
                            width: '*',
                            style: 'bottom',
                            text: `POSITION IN CLASS: ${student_data.position}`
                        },
                        {
                            width: 'auto',
                            style: 'bottom',
                            text: `OUT OF CLASS: ${stdNumber}`
                        },
                    ]
                },
                {
                    style: 'bottom',
                    text: `PRINCIPAL\'S REMARKS: ${htremarkHelper(student_data.average)}`,
                },
                {
                    columns: [
                        {
                            width: '*',
                            style: 'bottom',
                            text: `NAME OF PRINCIPAL: ${school_data.school_info.p_name}`
                        },
                        {
                            width: '*',
                            style: 'bottom',
                            text: 'SIGNATURE/STAMP:'
                        },
                        {
                            width: 'auto',
                            style: 'bottom',
                            text: `DATE: ${date}`
                        },
                    ]
                },
            ],
            styles: {
                header: {
                    fontSize: 15,
                    bold: true,
                    margin: [0, 5, 0, 3]
                },
                subheader: {
                    fontSize: 13,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                top: {
                    bold: true,
                    fontSize: 11,
                    color: 'black',
                    margin: [0, 0, 0, 5]
                },
                bottom: {
                    bold: false,
                    fontSize: 10,
                    color: 'black',
                    margin: [0, 5, 0, 0]
                },
                tableOpacityExample: {
                    margin: [0, 5, 0, 15],
                    fillColor: 'blue',
                    fillOpacity: 0.3
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9.5,
                    color: 'black'
                }
            },
            defaultStyle: {
                // alignment: 'justify'
            },
            patterns: {
                stripe45d: {
                    boundingBox: [1, 1, 4, 4],
                    xStep: 3,
                    yStep: 3,
                    pattern: '1 w 0 1 m 4 5 l s 2 0 m 5 3 l s'
                }
            }
        };

        var options = {
            // ...
        }
        var printer = new PdfPrinter(Roboto);

        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        // pdfDoc.pipe(fs.createWriteStream('document.pdf'));
        pdfDoc.pipe(res);
        pdfDoc.end();


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
const portaLogin = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });

        var lses = school_data.sessions.length - 1;
        var currTermIndex = school_data.sessions[lses].terms.findIndex(i => i.name === school_data.sessions[lses].current_term);

        for (var i = 0; i < school_data.sessions[lses].terms[currTermIndex].students.length; i++) {
            if (req.body.name === school_data.sessions[lses].terms[currTermIndex].students[i].name) {
                if (req.body.password === school_data.sessions[lses].terms[currTermIndex].students[i].password) {
                    return res.send({ success: true, school_name: school_data.school_info.name, student_info: school_data.sessions[lses].terms[currTermIndex].students[i] });
                } else {
                    return res.send({ success: false });
                }
            }
        }
        return res.send({ success: false });
    } catch (error) {
        return res.send({ message: error });
    }
}

// ADMIN . . .
const login = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'admin.admin_username': req.body.username.trim() });
        if (school_data) {
            if (school_data.admin.admin_password === req.body.password.trim()) {
                if (req.xhr || req.accepts('json,html') === 'json') {
                    return res.send({ success: true, school_name: school_data.school_info.name });
                } else {
                    return res.redirect(303, '/admin');
                }
            } else {
                res.send({ success: false });
            }
        }
        else {
            res.send({ success: false });
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

        return res.redirect(303, '/admin/' + req.params.sname + '/upcoming-news');
    } catch (error) {
        console.log(error);
    }
}
const createSession = async (req, res) => {
    try {

        var session_model = {
            name: req.body.name.trim(),
            terms: [
                {
                    name: "first",
                    start_date: 'null',
                    stop_date: 'null',
                    attendance_dates: [],
                    attendance_model: [],
                    results: 'false',
                    students: []
                },
                {
                    name: "second",
                    start_date: 'null',
                    stop_date: 'null',
                    attendance_dates: [],
                    attendance_model: [],
                    results: 'false',
                    students: []
                },
                {
                    name: "third",
                    start_date: 'null',
                    stop_date: 'null',
                    attendance_dates: [],
                    attendance_model: [],
                    results: 'false',
                    students: []
                },
            ],
            current_term: 'first'
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").updateOne({ 'school_info.name': req.params.sname },
            { $push: { sessions: session_model } }
        );

        return res.redirect(303, '/admin/' + req.params.sname + '/sessions');
    } catch {
        console.log(error);
    }
}
const createClass = async (req, res) => {
    try {

        class_model = {
            name: req.body.name.trim(),
            subjects: []
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").updateOne({ 'school_info.name': req.params.sname },
            { $push: { classes: class_model } }
        );
        if (req.xhr || req.accepts('json,html') === 'json') {
            return res.send({ success: true });
        } else {
            return res.redirect(303, '/admin/' + req.params.sname + '/classes');
        }
    } catch {
        console.log(error);
    }
}
const createSubject = async (req, res) => {
    try {

        class_subject = {
            name: req.body.name.trim(),
            class: req.body.class_name,
            teacher: req.body.teacher.trim(),
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").findOneAndUpdate({ "school_info.name": req.params.sname }, { $push: { "classes.$[t].subjects": class_subject } }, { arrayFilters: [{ "t.name": req.body.class_name }] })
        return res.redirect(303, '/admin/' + req.params.sname + '/subjects');
    } catch {
        console.log(error);
    }
}
const createStudent = async (req, res) => {
    try {
        var s_subjects = [];

        var student_model = {
            name: req.body.name.trim(),
            password: req.body.dob,
            gender: req.body.gender,
            dob: req.body.dob,
            session: req.body.session,
            term: req.body.term,
            class: req.body.class,
            subjects: [],
            total: -1,
            average: -1,
            position: -1,
            morning_attendance: [],
            afternoon_attendance: []
        }

        await mongoClient.connect();
        const database = mongoClient.db(dbConfig.database);
        database.collection("schools").findOneAndUpdate({ "school_info.name": req.params.sname }, { $push: { "sessions.$[sess].terms.$[term].students": student_model } }, { arrayFilters: [{ "sess.name": req.body.session }, { "term.name": req.body.term }] })

        let school_data = await database.collection("schools").findOne({ 'school_info.name': req.params.sname });
        var lses = school_data.sessions.length - 1;
        var currTermIndex = school_data.sessions[lses].terms.findIndex(i => i.name === school_data.sessions[lses].current_term);
        var classIndex = school_data.classes.findIndex(i => i.name === req.body.class.trim());

        // Assign class subjects to a subjects list
        for (var i = 0; i < school_data.classes[classIndex].subjects.length; i++) {
            s_subjects.push(
                {
                    name: school_data.classes[classIndex].subjects[i].name,
                    ass: [-1, -1, -1, -1, -1],
                    total: -1,
                    position: -1,
                    highest: -1,
                    lowest: -1
                }
            )
        }

        database.collection("schools").findOneAndUpdate(
            { "school_info.name": req.params.sname },
            {
                $push: {
                    "sessions.$[sess].terms.$[term].students.$[stud].subjects": { $each: s_subjects },
                    "sessions.$[sess].terms.$[term].students.$[stud].morning_attendance": { $each: school_data.sessions[lses].terms[currTermIndex].attendance_model },
                    "sessions.$[sess].terms.$[term].students.$[stud].afternoon_attendance": { $each: school_data.sessions[lses].terms[currTermIndex].attendance_model }
                }
            },
            { arrayFilters: [{ "sess.name": req.body.session }, { "term.name": req.body.term }, { "stud.name": req.body.name }] });

        return res.redirect(303, '/admin/' + req.params.sname + '/student-info');
    } catch (error) {
        console.log(error);
    }
}
const getSubjects = async (req, res) => {
    try {
        let payload = req.body.payload.trim();
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });


        res.status(200).send({ payload: school_data.classes });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}
const getStudents = async (req, res) => {
    try {
        let studentsList = [];
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });

        var sessionIndex = school_data.sessions.findIndex(i => i.name === req.body.session);
        var termIndex = school_data.sessions[sessionIndex].terms.findIndex(i => i.name === req.body.term);

        var std = school_data.sessions[sessionIndex].terms[termIndex].students;

        std.forEach((student) => {
            if (student.class === req.body.class) {
                studentsList.push(student)
            }
        })

        res.status(200).send({ payload: studentsList, results_status: school_data.sessions[sessionIndex].terms[termIndex].results });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}
const getSubjectsResultsList = async (req, res) => {
    try {
        let subjectsResultsList = [];
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });

        for (var i = 0; i < school_data.classes.length; i++) {
            if (school_data.classes[i].name === req.body.class) {
                subjectsResultsList = school_data.classes[i].subjects;
                break;
            }
        }

        res.status(200).send({ payload: subjectsResultsList });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}
const getSubjectsResults = async (req, res) => {
    let subjectsResults = [];
    await mongoClient.connect();

    const database = mongoClient.db(dbConfig.database);
    const schools = database.collection("schools");
    let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });

    var sessionIndex = school_data.sessions.findIndex(i => i.name === req.body.session);
    var termIndex = school_data.sessions[sessionIndex].terms.findIndex(i => i.name === req.body.term);
    var classIndex = school_data.classes.findIndex(i => i.name === req.body.class);
    var subjectLength = school_data.classes[classIndex].subjects.length;

    for (var i = 0; i < school_data.sessions[sessionIndex].terms[termIndex].students.length; i++) {
        if (school_data.sessions[sessionIndex].terms[termIndex].students[i].class === req.body.class) {
            subjectsResults.push(school_data.sessions[sessionIndex].terms[termIndex].students[i])
        }
    }

    res.status(200).send({
        payload: subjectsResults,
        s_num: subjectLength
    });

}
const getStudentResults = async (req, res) => {
    try {
        await mongoClient.connect();
        var std = {};

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");

        orbital.computeResults(req.params.sname, req.body.session, req.body.term, req.body.class);

        let school_data = await schools.findOne({ 'school_info.name': { $regex: new RegExp('^' + req.params.sname + '.*', 'i') } });


        var sessionIndex = school_data.sessions.findIndex(i => i.name === req.body.session);
        var termIndex = school_data.sessions[sessionIndex].terms.findIndex(i => i.name === req.body.term);
        // var classIndex = school_data.classes.findIndex(i => i.name === req.body.class.trim());

        for (var i = 0; i < school_data.sessions[sessionIndex].terms[termIndex].students.length; i++) {
            if (school_data.sessions[sessionIndex].terms[termIndex].students[i].name === req.body.name && school_data.sessions[sessionIndex].terms[termIndex].students[i].class === req.body.class) {
                std = school_data.sessions[sessionIndex].terms[termIndex].students[i];
                break;
            }
        }

        res.status(200).send({ payload: std });

    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}
const updateSubjectsResults = async (req, res) => {
    try {
        await mongoClient.connect();

        let updatedRes = req.body.data;

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");
        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });

        var sessionIndex = school_data.sessions.findIndex(i => i.name === req.body.session);
        var termIndex = school_data.sessions[sessionIndex].terms.findIndex(i => i.name === req.body.term);
        var classIndex = school_data.classes.findIndex(i => i.name === req.body.class);
        var subjectIndex = school_data.classes[classIndex].subjects.findIndex(i => i.name === req.body.subname);


        for (var j = 0; j < updatedRes.length; j++) {
            for (var i = 0; i < school_data.sessions[sessionIndex].terms[termIndex].students.length; i++) {
                if (school_data.sessions[sessionIndex].terms[termIndex].students[i].name === updatedRes[j].name && school_data.sessions[sessionIndex].terms[termIndex].students[i].class === updatedRes[j].class) {
                    console.log(updatedRes[j].name);
                    schools.findOneAndUpdate({ "school_info.name": req.params.sname },
                        { $set: { "sessions.$[sess].terms.$[term].students.$[stud].subjects.$[sub]": updatedRes[j].subjects[subjectIndex] } },
                        {
                            arrayFilters:
                                [{ "sess.name": req.body.session },
                                { "term.name": req.body.term },
                                { "stud.name": school_data.sessions[sessionIndex].terms[termIndex].students[i].name },
                                { "sub.name": req.body.subname }]
                        })
                    break;
                }
            }
        }

        return res.redirect(303, '/admin/' + req.params.sname + '/assessment/' + req.body.class + '/' + req.body.subname);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}
const updateCurrentTerm = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");

        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        var lses = school_data.sessions.length - 1;
        var session = school_data.sessions[lses].name;

        schools.findOneAndUpdate({ "school_info.name": req.params.sname },
            { $set: { "sessions.$[sess].current_term": req.body.current_term } },
            {
                arrayFilters:
                    [{ "sess.name": session }]
            }).then(res.send({ success: true }));
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}
const updateResultStatus = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");

        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        var lses = school_data.sessions.length - 1;
        var session = school_data.sessions[lses].name;
        // var currTermIndex = school_data.sessions[lses].terms.findIndex(i => i.name === school_data.sessions[lses].current_term);


        schools.findOneAndUpdate({ "school_info.name": req.params.sname },
            { $set: { "sessions.$[sess].terms.$[term].results": req.body.results_status } },
            {
                arrayFilters:
                    [{ "sess.name": session }, { "term.name": school_data.sessions[lses].current_term }]
            }).then(res.send({ success: true }));
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}
const updateTermDates = async (req, res) => {
    try {

        var start = new Date(req.body.start_date);
        var end = new Date(req.body.stop_date);
        let attendance_dates = [];
        let attendance_model = [];

        while (start <= end) {
            var mm = ((start.getMonth() + 1) >= 10) ? (start.getMonth() + 1) : '0' + (start.getMonth() + 1);
            var dd = ((start.getDate()) >= 10) ? (start.getDate()) : '0' + (start.getDate());
            var yyyy = start.getFullYear();
            var date = yyyy + "-" + mm + "-" + dd + "-" + start.getDay();

            start = new Date(start.setDate(start.getDate() + 1));
            attendance_dates.push(date);
            attendance_model.push("Mark");
        }

        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const schools = database.collection("schools");

        let school_data = await schools.findOne({ 'school_info.name': req.params.sname });
        var lses = school_data.sessions.length - 1;
        var session = school_data.sessions[lses].name;

        schools.findOneAndUpdate({ "school_info.name": req.params.sname },
            { $set: { "sessions.$[sess].terms.$[term].start_date": req.body.start_date, "sessions.$[sess].terms.$[term].stop_date": req.body.stop_date, "sessions.$[sess].terms.$[term].attendance_dates": attendance_dates, "sessions.$[sess].terms.$[term].attendance_model": attendance_model } },
            {
                arrayFilters:
                    [{ "sess.name": session }, { "term.name": school_data.sessions[lses].current_term }]
            }).then(res.redirect(303, '/admin/' + req.params.sname + '/student-register'));
        return;
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
}

// TEACHERS APP . . .


module.exports = {
    uploadRegForm,
    regAgent,
    verifyTransaction,
    getSchools,
    getSubjects,
    getStudents,
    getListFiles,
    downloadImage,
    downloadPdf,
    downloadNewsImage,
    login,
    portaLogin,
    upload_news,
    createSession,
    createClass,
    createSubject,
    createStudent,
    getSubjectsResultsList,
    getSubjectsResults,
    getStudentResults,
    updateSubjectsResults,
    updateCurrentTerm,
    updateResultStatus,
    updateTermDates
};

function htremarkHelper(score) {
    if (score <= 100 && score >= 80) {
        return "Wonderful performance. Keep it up.";
    } else {
        if (score < 80 && score >= 70) {
            return "An Amazing Result. Keep it up";
        } else {
            if (score < 70 && score >= 60) {
                return "Good Result. You can more";
            } else {
                if (score < 60 && score >= 50) {
                    return "Satisfactory Result. You can better.";
                } else {
                    if (score < 50 && score >= 40) {
                        return "Average Result, Work harder";
                    } else if (score < 40 && score >= 0) {
                        return "Poor performance. Do better next time.";
                    } else {
                        return "Your Scores are not within the stipulated range.";
                    }
                }
            }
        }
    }
}

function date_obj_converter(date) {
    var mm = ((date.getMonth() + 1) >= 10) ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    var dd = ((date.getDate()) >= 10) ? (date.getDate()) : '0' + (date.getDate());
    var yyyy = date.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
}