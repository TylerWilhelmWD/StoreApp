const express = require("express");
const bodyParser = require('body-parser');


const app = express();
const passport = require("passport");
const session = require("cookie-session");
const handlebarsT = require("handlebars");
const handlebars = require("express-handlebars").create({ defaultLayout: 'storeApp' });
const uploads = require("./helpers/multer_config");

const mongoose = require("mongoose");
var {ObjectID} = require('mongodb');

handlebarsT.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

handlebarsT.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 <= v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
  handlebarsT.registerHelper('ifLess', function(v1, v2, options) {
    if(v1 >= v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

//saving images to DB
// const fs = require('file-system');
// const multer = require('multer');
// var upload = multer({ dest: 'uploads/' })

require("./mongodb/models/User");
require("./services/passport");

app.use("/uploads", express.static("uploads"));
//local imports
//var {mongoose} = require('./mongoose');
var {Item} = require('./mongodb/models/Item');

mongoose.connect("mongodb://localhost:27017/StoreApp").then(() => console.log("db connected")).catch(error => console.log(error));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
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
//serve local js files
app.route({
    method: 'GET',
    path: '/{filename*}',
    handler: {
      directory: {
        path:    __dirname + '/public',
        listing: false,
        index:   false
      }
    }
  });
  
  app.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply.view('homepage');
    }
  });

//   app.use(multer({dest:'./uploads/'}).single('photo'));




app.get('/showItems', (request, response) => {
    Item.find().then((items) => {
        response.render('showItems', {items: items})
        //response.send(items);
    }, (error) => {

    });
});
app.get('/', (request, response) => {
    response.render('home', {layout:'storeApp.handlebars'});
});

app.get('/home', (request, response) => {
    response.render('home', {layout:'storeApp.handlebars'});
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
        itemImage: request.body.itemImage,
        adminPrice: request.body.adminPrice
    });
    item.save().then((document) => {
        response.render('showItems');
    }, (error) => {
        response.status(400).send(error);
        //response.send(JSON.stringify(response.body));
    });
});

app.get('/listItems', (request, response) => {
    Item.find().then((items) => {
        response.render('listItems', {items: items})
        //response.send(items);
    }, (error) => {

    });
});

app.get('/items/:itemid', (request, response) =>{
    var itemid = request.params.itemid;
    
    if (!ObjectID.isValid(itemid)) {
        return response.status(404).send();
    }
    Item.findById(itemid).then((item) => {
        if (!item) {
            return response.status(404).send();
        }

        response.send({item});
    }).catch((error) => {
        response.status(400).send();
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
