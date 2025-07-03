const express = require('express');
const app = express();
require('dotenv').config();
const userRoute = require('./routes/user.router')
const urlRoute = require('./routes/url.router')
const sanitizeInput = require('./middleware/sanitizeInput')
const limiter = require('./middleware/rateLimiter')
const cors = require('cors');

const db = require('./config/dbConnect');
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(sanitizeInput);
app.use(limiter);

app.get("/", (req, res) => {
    res.send("Hello world");
});

db.dbConnect();

app.use(
    cors({
        origin: "https://file-share-delta.vercel.app/",
        credentials: true
    })
);


app.use('/api/v1/auth', userRoute);
app.use('/api/v1/url', urlRoute)



app.listen(PORT, () => {
    console.log("Server is running on part 8080");
})
