const {MongoClient, ObjectID} = require('mongodb');


//change db location here
MongoClient.connect("mongodb://localhost:27017/StoreApp", (error, client) => {
    if(error){
       return console.log("Mongo Connection Failed");
    }
    console.log("Connected to Mongo DB");

    const db = client.db('StoreApp');

    // db.collection('Users').insertOne({
    //     username: "admin",
    //     password: "password1"
    // }, (error, result) => {
    //     if(error){
    //    return console.log("Unable to insert user");
    // }
    // console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    client.close();
});