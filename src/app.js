import azure from 'azure-storage';
import express from 'express';
import logger from 'morgan'
import uuid from 'node-uuid';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const blobService = azure.createBlobService();
const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use((req, res, next) => {
    req.id = uuid.v4()
    next()
})
logger.token('id', req => req.id)
app.use(logger(':id :method :url :response-time'));
app.use(bodyParser.json())

// static assets
app.use(express.static(path.join(__dirname, '../public')));

// forward responses to Azure blob storage
// TODO: prevent spam; throttle the same IP address
app.post('/submitResponse', function (req, res) {
    if (!req.body)
        res.sendStatus(400)

    const responses = req.body.computedStates[20].state.main.responses;
    if (responses.length === 0)
        res.sendStatus(200);

    const experimentId = responses[0].experimentId;

    blobService.createBlockBlobFromText(
        'responses', // the container
        experimentId + '/' + req.id + '-' + Date.now() + '.json', // the blob: {id}-{date}.json
        JSON.stringify(responses),
        function(error, result, response){
            if(error){
                ("Error saving response JSON!");
                console.log(responses);
                console.error(error);
                res.sendStatus(400)
            } else {
                console.log('Responses JSON uploaded successfully');
                res.sendStatus(200);
            }
        });
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.sendStatus(err.status || 500);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.sendStatus(err.status || 500);
});

export default app;
