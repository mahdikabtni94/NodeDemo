const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const routeUser = require("./routes/user");
const routeArticle = require("./routes/article_route");
const routeCustomer = require("./routes/customer");
const routeCountry = require("./routes/country");
const routeState = require("./routes/state");
const routeCity = require("./routes/city");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/images",express.static(path.join("images")));
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
app.use("/api/country", routeCountry);
app.use("/api/state", routeState);
app.use("/api/city", routeCity);



module.exports = app;
