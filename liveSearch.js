const mongoose = require('mongoose');

const fruitsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Fruit', fruitsSchema);