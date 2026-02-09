const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectToMongoDB = require('./connect');
const urlrouter = require("./routes/url");
const {checkForAuthentication, restrictTo} = require("./middleware/auth");
const URL = require("./models/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8002;

connectToMongoDB('mongodb://localhost:27017/url-shortner')
.then(() => console.log("MongoDB connected"));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./view'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use('/url',restrictTo(['normal','admin']), urlrouter);
app.use('/user', userRoute);
app.use("/",checkForAuthentication, staticRoute);


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