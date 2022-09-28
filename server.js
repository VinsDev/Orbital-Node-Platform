const express = require("express");
const Fruit = require('./liveSearch');
const mongoose = require("mongoose");
const { db } = require("./liveSearch");

mongoose.connect(
    "mongodb://localhost:27017/",
    {
        dbName: "fruitLiveSearch",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) =>
        err ? console.log(err) : console.log(
            "Connected to " + db.name)
);

const app = express();
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
    res.sendFile(__dirname + '/views/register.html');
});

app.post('/getFruits', async (req, res) => {
    let payload = req.body.payload.trim();
    let search = Fruit.find({ name: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
    //Limit Search Results to 10
    search = (await search).slice(0, 10);
    res.send({ payload: search });
});


// School . . .
app.get('/school', (req, res) => {
    res.sendFile(__dirname + '/school/index.html');
});
app.get('/admissions', (req, res) => {
    res.sendFile(__dirname + '/school/admissions.html');
});
app.get('/portal', (req, res) => {
    res.sendFile(__dirname + '/school/portal.html');
});
app.get('/fees', (req, res) => {
    res.sendFile(__dirname + '/school/fees.html');
});
app.get('/s_contact', (req, res) => {
    res.sendFile(__dirname + '/school/contact.html');
});
app.get('/s_about', (req, res) => {
    res.sendFile(__dirname + '/school/about.html');
});





app.listen(process.env.PORT || 3000, () => {
    console.log('Server has started on PORT 3000');
});