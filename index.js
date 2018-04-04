const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const passport = require("passport");
const session = require("cookie-session");

const handlebars = require("express-handlebars").create({ defaultLayout: 'main' });

const mongoose = require("mongoose");

require("./mongodb/models/User");
require("./services/passport");

//local imports
//var {mongoose} = require('./mongoose');
var {Item} = require('./mongodb/models/Item');

mongoose.connect("mongodb://localhost:27017/StoreApp").then(() => console.log("db connected")).catch(error => console.log(error));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set("port", process.env.PORT || 8080);

app.use(bodyParser.json());

//allows form submission to submit JSON
app.use(bodyParser.urlencoded({extended: false}));
//Google passport middleware
app.use(session({maxAge: 30*24*60*60*1000, keys: ["asdfhuqeadfhjladhfuawefjablhguiaweohlajd"]}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

app.get('/', (request, response) => {
    response.render('home');
});



// app.get('/login', (request, response) => {
//     response.render('login', {layout:'signUI.handlebars'});
// });

// app.get('/signup', (request, response) => {
//     response.render('signup', {layout:'signUI.handlebars'});
// });

app.get('/addItem', (request, response) => {
    response.render('addItem');
});
app.post('/addItem', (request, response) => {
    var item = new Item({
        itemName: request.body.itemName,
        price: request.body.price,
        description: request.body.description,
        amount: request.body.amount,
        imageURL: request.body.imageURL
    });

    item.save().then((document) => {
        response.send(document);
    }, (error) => {
        response.status(400).send(error);
        //response.send(JSON.stringify(response.body));
    });
});
require("./routes/authRoutes")(app);
app.use((request, response) => {
    response.status(404);
    response.render('404');
});

app.listen(app.get("port"), () => {
  console.log(
    "Express started on http://localhost:" +
      app.get("port") +
      "; press Ctrl-C to terminate."
  );
});
