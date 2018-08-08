'use strict'

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const emailService = require('../services/email-services');
const authService = require('../services/auth-service');

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        emailService.send(
            req.body.email,
            'Bem vindo a node store',
            global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(200).send({
            message: 'Cliente cadastrado com sucesso!'
        });
    } catch (error) {
        res.status(500).send({
            message: 'Falha ao cadastrar o cliente =(',
            data: error.message
        });
    }
};

exports.authenticate = async (req, res, next) => {

    try {
        let customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if(!customer){
            res.status(404).send({
                message: 'Usuário ou senha inválidos!'
            });
            return;
        }

        let token = await authService.generateToken({
            email: customer.email,
            name: customer.name
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
         res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};