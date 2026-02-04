const express = require('express');
const path = require('path');
const connectToMongoDB = require('./connect');
const urlrouter = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");
const app = express();
const PORT = 8002;

connectToMongoDB('mongodb://localhost:27017/url-shortner')
.then(() => console.log("MongoDB connected"));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./view'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/url', urlrouter)
app.use("/", staticRoute);


app.get("/:shortid", async (req, res) => {
    const shortId = req.params.shortid;
    const entry = await URL.findOneAndUpdate(
        {shortId},
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        }
    )
    if(!entry) return res.status(404).json({error: 'short URL not found'});
    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));