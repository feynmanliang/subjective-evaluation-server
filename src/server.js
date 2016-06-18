import express from 'express';

export function startServer() {
    const app = express();

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(3000, function() {
        console.log('App runing on port 3000');
    });
}
