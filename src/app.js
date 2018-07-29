'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

// Carrega rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');

// Middleware para fazer o parse do retorno das requisições para json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', indexRoute);
app.use('/products', productRoute);

module.exports = app;
