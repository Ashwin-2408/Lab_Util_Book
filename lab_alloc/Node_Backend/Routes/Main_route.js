import express from 'express';

const Router = express.Router();

// Define routes
Router.get('/', (req, res) => {
    res.send('Hello from Main_route.js!');
});

// Named export
export { Router };
