import express from 'express';
import cors from 'cors';


export function startServer() {
    const app = express();

    app.use([
        express.static('public'),
        cors()
    ]);

    app.listen(3000, function() {
        console.log('App runing on port 3000');
    });
}
