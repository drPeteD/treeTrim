var restify = require("restify");
var fs = require("fs");

var controllers = {},
    controllers_path = process.cwd() + "/routes";

var corsMiddleware = require("restify-cors-middleware");

/* Search for controllers in the /routes folder */
fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf(".js") != -1) {
        controllers[file.split(".")[0]] = require(controllers_path + "/" + file);
    }
});

var server = restify.createServer();

var cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ["*"],
    allowHeaders: ["API-Token"],
    exposeHeaders: ["API-Token-Expiry"]
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

server.post('/insert', controllers.project.insertProject);

server.get('/master', controllers.project.selectProjects);

server.get('/project/:id', controllers.project.selectProject);

// server.get("/point/:pointID", controllers.project.selectPoint);
// server.get("/detail/:projectID", controllers.project.selectProjectDetail);


var port = process.env.PORT || 3001;
server.listen(port, function (err) {
    if (err)
        console.error(err);
    else
        console.log('App is ready at : ' + port);
});

