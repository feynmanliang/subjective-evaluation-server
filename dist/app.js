'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _azureStorage = require('azure-storage');

var _azureStorage2 = _interopRequireDefault(_azureStorage);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var blobService = _azureStorage2.default.createBlobService(process.env.CUSTOMCONNSTR_bachbotBlobstore);
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

var whitelist = ['http://localhost:8080', 'http://bachbot.com', 'http://bachbot.azureedge.net', 'http://bachbot-server.azurewebsites.net'];
var corsOptions = {
    origin: function origin(_origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(_origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};
app.use((0, _cors2.default)(corsOptions));

app.use(function (req, res, next) {
    req.id = _nodeUuid2.default.v4();
    next();
});
_morgan2.default.token('id', function (req) {
    return req.id;
});
app.use((0, _morgan2.default)(':id :method :url :response-time'));

app.use(_bodyParser2.default.urlencoded({ extended: true }));

// static assets
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));

// forward responses to Azure blob storage
// TODO: prevent spam; throttle the same IP address
app.post('/submitResponse', function (req, res) {
    if (!req.body) res.sendStatus(400);

    var _req$body = req.body;
    var responses = _req$body.responses;
    var userInfo = _req$body.userInfo;

    if (responses.length === 0) res.sendStatus(200);

    var experimentId = responses[0].experimentId;

    var responseBlob = {
        ip: req.connection.remoteAddress,
        datetime: Date.now(),
        responses: responses,
        userInfo: userInfo
    };

    blobService.createBlockBlobFromText('responses', // the container
    experimentId + '/' + req.id + '-' + Date.now() + '.json', // the blob: {id}-{date}.json
    JSON.stringify(responseBlob), function (error, result, response) {
        if (error) {
            "Error saving response JSON!";
            console.log(responses);
            console.error(error);
            res.sendStatus(400);
        } else {
            console.log('Responses JSON uploaded successfully');
            res.sendStatus(200);
        }
    });
});

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        console.log(err);
        res.send(err);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    console.log(err);
    res.send(err);
});

exports.default = app;