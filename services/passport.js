const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");
const User = mongoose.model("users");
//make a connection to User model and sort through users.

passport.serializeUser(function(user, done) {
 done(null, user.id);
});

//
passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, user) {
   done(err, user);
 });
});

passport.use(
 new googleStrategy(
   {
     clientID: keys.googleClientId,
     clientSecret: keys.googleClientSecret,
     callbackURL: "/auth/google/callback",
     proxy: true
   },
   (accessToken, refreshtoken, profile, done) => {
     console.log(profile);
     User.findOne({ googleID: profile.id }).then(user => {
       if (user) {
         done(null, user);
       } else {
         new User({
           googleID: profile.id,
           name: profile.displayName

         })
           .save()
           .then(user => {
             done(null, user);
           })
           .catch(err => {
             done(err, false);
           });
       }
     });
   }
 )
);

