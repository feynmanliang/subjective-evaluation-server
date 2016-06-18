import express from 'express';


export function startServer() {
    const activeExperiment = require('../config/experiment.json');
    const app = express();

    app.get('/', (req, res) => {
        res.send(activeExperiment);
    });

    app.listen(3000, function() {
        console.log('App runing on port 3000');
    });
}
