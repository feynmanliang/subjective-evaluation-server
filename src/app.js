import azure from 'azure-storage';
import cors from 'cors';
import express from 'express';
import logger from 'morgan'
import uuid from 'node-uuid';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const blobService = azure.createBlobService(process.env.CUSTOMCONNSTR_bachbotBlobstore);
const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';


const whitelist = [
  'http://localhost:8080',
  'http://bachbot.com',
  'http://bachbot.azureedge.net',
  'http://bachbot-server.azurewebsites.net'];
const corsOptions = {
  origin: (origin, callback) => {
    const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};
app.use(cors(corsOptions))

app.use((req, res, next) => {
    req.id = uuid.v4()
    next()
})
logger.token('id', req => req.id)
app.use(logger(':id :method :url :response-time'));

app.use(bodyParser.urlencoded({ extended: true }))

// static assets
app.use(express.static(path.join(__dirname, '../public')));

// forward responses to Azure blob storage
// TODO: prevent spam; throttle the same IP address
app.post('/submitResponse', function (req, res) {
    if (!req.body)
        res.sendStatus(400)

    const { responses, userInfo } = req.body;
    if (responses.length === 0)
        res.sendStatus(200);

    const experimentId = responses[0].experimentId;

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const responseBlob = {
      ip,
      datetime: Date.now(),
      responses,
      userInfo
    }
    const blobName = req.id + '-' + Date.now() + '.json'; // {id}-{date}.json
    blobService.createBlockBlobFromText(
        'responses', // the container
        experimentId + '/' + blobName, // the blob
        JSON.stringify(responseBlob),
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
    res.send({
      blobName,
      ip
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
    res.send(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err);
  res.send(err);
});

export default app;
