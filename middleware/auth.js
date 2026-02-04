const {getUser} = require("../service/auth");

async function restricToLoggedInUserOnly(req, res, next) {
    const sessionId = req.cookies["uuid"];
    if(!sessionId) {
        return res.redirect("/login");
    }
    const user = getUser(sessionId);

    if(!user) {
        return res.redirect("/login");
    }
    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
    const sessionId = req.cookies["uuid"];
    const user = getUser(sessionId);
    req.user = user;
    next();
}

module.exports = {
    restricToLoggedInUserOnly,
    checkAuth
}