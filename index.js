const express = require('express');
const connectToMongoDB = require('./connect');
const urlrouter = require("./routes/url");
const URL = require("./models/url");
const app = express();
const PORT = 8002;

connectToMongoDB('mongodb://localhost:27017/url-shortner')
.then(() => console.log("MongoDB connected"));
app.use(express.json());
app.use('/url', urlrouter)

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
    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));