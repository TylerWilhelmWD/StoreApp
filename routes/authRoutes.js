const passport = require("passport");
const {ensureAuthenticated} = require("../helpers/auth");
module.exports = app => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );
  app.get("/auth/google/callback", passport.authenticate("google", {
      successRedirect: '/home'
  }));
  app.get("/auth/current_user", (req, res) => {
    res.send(req.user);
  });
  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });
  
app.get('/secret', ensureAuthenticated, (req, res) => {
    res.send("Logged in");
})

app.get('/home', (req, res) => {
  res.render('home')
})

};
