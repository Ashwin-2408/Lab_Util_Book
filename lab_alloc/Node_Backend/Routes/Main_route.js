import express from 'express';

const Router = express.Router();

Router.get('/', (req, res) => {
    res.send('Hello from Main_route.js!');
});

export { Router };
