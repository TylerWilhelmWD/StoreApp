
var mongoose = require('mongoose');

var Item = mongoose.model('Item', {
    itemName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    adminPrice: {
        type: Number,
        
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: 140 
    },
    amount: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    itemImage: {
        type: String,
        minlength: 1,
        trim: true
     }

});

//Use ES6
module.exports = {Item};