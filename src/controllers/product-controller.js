'use strict'

const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const config = require('../config');
const guid = require('guid');

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
        // Cria o Blob Service
        const blobSvc = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');

        // Salva a imagem
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
            contentType: type
        }, function (error, result, response) {
            if (error) {
                filename = 'default-product.png'
            }
        });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: 'https://nodetrgomes.blob.core.windows.net/product-images/' + filename
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso!'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e.message

        });
    }
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

