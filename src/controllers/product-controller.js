'use strict'

const repository = require('../repositories/product-repository');

exports.get = async (req, res, next) => {
    try {
        let data = await repository.get();
        res.status(201).send(data);
    } catch (error) {
        res.status(400).send(error);
    };
};

exports.getBySlug = async (req, res, next) => {
    try {
        let data = await repository.getBySlug(req.params.slug);
        res.status(201).send(data);
    } catch (error) {
        res.status(400).send(error);
    };
};

exports.getById = async (req, res, next) => {
    try {
        let data = await repository.getById(req.params.id);
        res.status(201).send(data);
    } catch (error) {
        res.status(400).send(error);
    };
};

exports.getByTag = async (req, res, next) => {
    try {
        let data = await repository.getByTag(req.params.tag);
        res.status(201).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.post = async (req, res, next) => {
    try {
        await repository.create(req.body);
        res.status(200).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Falha ao cadastrar o produto!',
            data: error
        });  
    };    
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: 'Produto atualizado com sucesso!'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Falha ao atualizar o produto',
            data: error
        });
    };    
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Falha ao remover o produto',
            data: error
        });
    };    
};

