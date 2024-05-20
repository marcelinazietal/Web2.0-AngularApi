const middleware = require("../middleware/middleware");

exports.mainPage = async function(req, res) {
    req.session.isLoggedIn = await middleware.isLoggedIn(req);
    req.session.isAdmin = await middleware.isAdmin(req);
    console.log("req.session.isLoggedIn")
    console.log(req.session.isLoggedIn)
    console.log("req.session.isAdmin")
    console.log(req.session.isAdmin)
    res.render('index', {isLoggedIn: req.session.isLoggedIn, isAdmin: req.session.isAdmin});
}

exports.login = async function(req, res) {
    res.render('login', {isLoggedIn: req.session.isLoggedIn, isAdmin: req.session.isAdmin});
}

exports.register = async function(req, res) {
    res.render('register', {isLoggedIn: req.session.isLoggedIn, isAdmin: req.session.isAdmin});
}

exports.changepassword = async function(req, res) {
    res.render('changepassword', {isLoggedIn: req.session.isLoggedIn, isAdmin: req.session.isAdmin});
}