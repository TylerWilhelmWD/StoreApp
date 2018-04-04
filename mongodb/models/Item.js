
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
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    imageURL: {
        type: String,
        minlength: 1,
        trim: true
    }
});

// var newItem = new Item({

// });
// newItem.save().then({

// });

//Use ES6
module.exports = {Item};