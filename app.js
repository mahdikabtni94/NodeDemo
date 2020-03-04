const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routeUser = require("./routes/user");
const routeArticle = require("./routes/article_route");
const routeCustomer = require("./routes/customer");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("", routeUser);
app.use("/api/customer",routeCustomer);
app.use("/api/article", routeArticle);



module.exports = app;
