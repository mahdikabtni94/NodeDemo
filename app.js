const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routeUser = require("./routes/user");
const routeProduct = require("./routes/Products");
const routeArticle = require("./routes/article_route");
const routeCategory = require("./routes/category");

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
app.use("/api/article", routeArticle);
app.use("/api/Product", routeProduct);
app.use("/api/category", routeCategory);

module.exports = app;
