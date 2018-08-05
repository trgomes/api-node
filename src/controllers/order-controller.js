'use strict'

const repository = require('../repositories/order-repository');
const guid = require('guid');

exports.get = async(req, res) => {
    try {
        let data = await repository.get();
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Erro ao processar a requisição =('
        });
    }
};

exports.post = async(req, res, next) => {    
    try {
        await repository.create({
            customer: req.body.customer,
            number: guid.raw().substring(0,6),
            items: req.body.items
        });
        res.status(201).send({
            message: 'Pedido cadastrado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao cadastrar o pedido =(',
            data: error.message
        });
    }
};