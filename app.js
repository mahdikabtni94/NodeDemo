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
const routeSite = require("./routes/site");
const routeMachine = require("./routes/machine");
const routeEmployee = require("./routes/employee");
const routeJob = require("./routes/job");
const routeLine = require("./routes/line");
const routeMachineType = require("./routes/machine_type");
const routeBox = require("./routes/box");
const routeProfile = require("./routes/profile");
const routePermission = require("./routes/permission");
const routeOrder = require("./routes/order");
const routeBundle = require("./routes/bundle");
const routeOperation = require("./routes/operation");
const routeOperationTemplate = require("./routes/operation_template");
const routeCartPendingOperation = require("./routes/cart_pending_operation");
const routeCartPendingSession = require("./routes/cart_pending_session");
const routeUserSession = require("./routes/usersession");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/images", express.static(path.join("images")));
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
app.use("/api/customer", routeCustomer);
app.use("/api/article", routeArticle);
app.use("/api/country", routeCountry);
app.use("/api/state", routeState);
app.use("/api/city", routeCity);
app.use("/api/site", routeSite);
app.use("/api/machine", routeMachine);
app.use("/api/employee",routeEmployee);
app.use("/api/job",routeJob);
app.use("/api/line",routeLine);
app.use("/api/machinetype",routeMachineType);
app.use("/api/box",routeBox);
app.use("/api/profile",routeProfile);
app.use("/api/permission",routePermission);
app.use("/api/order",routeOrder);
app.use("/api/bundle",routeBundle);
app.use("/api/operation",routeOperation);
app.use("/api/operation_template",routeOperationTemplate);
app.use("/api/cart_pending_operation",routeCartPendingOperation);
app.use("/api/cart_pending_session",routeCartPendingSession);
app.use("/api/usersession",routeUserSession);


module.exports = app;
