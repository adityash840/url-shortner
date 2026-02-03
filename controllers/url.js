const shortid = require('shortid');
const URL = require("../models/url");

async function handleGenerateNewURL(req, res) {
    const body = req.body;
    if(!body) return res.status(400).json({error: 'url is required'});
    const shortID = shortid();
    await URL.create({
        shortId : shortID,
        redirectURL : body.url,
        visitHistory : []
    });
    return res.json({ id: shortID});
}

async function handleGetAnalytics(req, res) {
    const shortid = req.params.shortid;
    const result = await URL.findOne({shortId: shortid});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory
    });
}

module.exports = {
    handleGenerateNewURL,
    handleGetAnalytics
}