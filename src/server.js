import express from 'express';


export function startServer() {
    const activeExperiment = require('../config/experiment.json');
    const app = express();

    app.get('/', (req, res) => {
        res.set('Access-Control-Allow-Origin', ['http://localhost:8080']).send(activeExperiment);
    });

    app.listen(3000, function() {
        console.log('App runing on port 3000');
    });
}
