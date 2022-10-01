const express = require("express");

const mongoose = require("mongoose");
const app = express();
const server = require("http").Server(app);
const bodyParser = require("body-parser");


let uri =
    "mongodb+srv://vins:Vins46185@cluster0.1243w2d.mongodb.net/orbital?retryWrites=true&w=majority";

let url = "mongodb://localhost:27017/orbital";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => err ? console.log(err) : console.log("Connected to Database"));

const schoolSchema = new mongoose.Schema(
    {
        name: 'String',
        email: 'String',
        phone: 'String',
        about: 'String',
        d_about: 'String',
        p_name: 'String',
        fees: 'String',
        e_register: 'String',
    },
    { collection: "schools" }
);

const School = mongoose.model("School", schoolSchema);

const schoolData = (bodyData) => {
    School({
        name: bodyData.name,
        email: bodyData.email,
        phone: bodyData.phone,
        about: bodyData.about,
        d_about: bodyData.d_about,
        p_name: bodyData.p_name,
        fees: bodyData.fees,
        e_register: bodyData.e_register,
    }).save((err) => {
        if (err) {
            throw err;
        }
    });
};

const urlencodedParser = bodyParser.urlencoded({ extended: false });


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



// Landing . . .
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});
app.get('/services', (req, res) => {
    res.sendFile(__dirname + '/views/services.html');
});
app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/views/contact.html');
});
app.get('/register', (req, res) => {
    res.render("register");
});
app.post("/register", urlencodedParser, (req, res) => {
    schoolData(req.body);
    res.render("success", { name: req.body.name });
});
app.post('/getSchools', async (req, res) => {
    let payload = req.body.payload.trim();
    let search = School.find({ name: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
    //Limit Search Results to 10
    search = (await search).slice(0, 10);
    res.send({ payload: search });
});

// $regex: new RegExp('^' + payload + '.*', 'i')

// School . . .
app.get('/school', async (req, res) => {
    let school_data = await School.findOne({ name: { $regex: new RegExp('^' + req.query.q + '.*', 'i') } }).exec();
    res.render("../school/index", { school_obj: school_data});
});
app.get('/admissions', (req, res) => {
    res.render("../school/admissions", { school_obj: school_data});
});
app.get('/portal', (req, res) => {
    res.render("../school/portal", { school_obj: school_data});
});
app.get('/fees', (req, res) => {
    res.render("../school/fees", { school_obj: school_data});
});
app.get('/s_contact', (req, res) => {
    res.render("../school/contact", { school_obj: school_data});
});
app.get('/s_about', (req, res) => {
    res.render("../school/about", { school_obj: school_data});
});





app.listen(process.env.PORT || 3000, () => {
    console.log('Server has started on PORT 3000');
});



/* 
const username = encodeURIComponent("vins");
const password = encodeURIComponent("Vins46185");
let uri =
  `mongodb+srv://${username}:${password}@cluster0.1243w2d.mongodb.net/orbital?retryWrites=true&w=majority`; */