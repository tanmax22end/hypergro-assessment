const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./src/routes.js');
const router = routes(express);
const app = express();
require('dotenv').config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
app.use(bodyParser.json());

app.use('/api', router);

const PORT = 8080;
app.listen(PORT, async () => {
    const db = await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.pqaih.mongodb.net/hypergro?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log("Server started successfully");
})
