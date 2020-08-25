'use strict';

const _ = require('lodash');
const moment = require('moment');
const util = require('../util/util');
const authService = require('../services/auth-service');
const { mapMethods } = require('../util/methods-helper')
const emailService = require('../services/email-service');
//const uuidV1 = require('uuid/v1');
//const uuidV4 = require('uuid/v4');
const { v1: uuidv1 } = require('uuid');
const { v4: uuidv4 } = require('uuid');

const fbRep = require('../repositories/firebird-rep');

exports.createPassword = async (req, res, next) => {
  try {

    let cpf = req.body.cpf || "";

    let nasc = req.body.nasc || "";
    let dtNasc = moment(nasc).utc();

    let email = req.body.email || "";
    if (!util.isEmail(email)) {
      res.status(403).json({ message: "Email inválido" });
      return;
    }
    let password = req.body.password || "";
    let passwordteste = util.passwordValidation(password);
    if (password == "" || passwordteste == false) {
      res.status(403).json({ message: "A Senha deve conter pelo menos oito caracteres, uma letra maiúscula, um número e um caractere especial:" });
      return;
    }

    cpf = util.validaCpf(cpf);
    if (cpf != "") {
      let result = await fbRep.query(`select RESPONSAVEL, CPF, NASCIMENTO, SENHA_WEB from responsaveis where cpf= '${cpf}'`);
      if (result.length > 0) {

        let nomeResp = result[0].RESPONSAVEL;
        let senhaResp = result[0].SENHA_WEB;
        if (senhaResp && senhaResp != "") {
          res.status(403).json({ message: "Esse usuário ja possui senha cadastrada! Por favor utilize a opção de recuperação de senha." });
          return;
        }

        password = util.tratarString(password);

        let dtNascDb = result[0].NASCIMENTO;
        dtNascDb = moment(dtNascDb).utc();
        let dtCompara = dtNasc.isSame(dtNascDb, 'day')
        if (dtCompara == false) {
          res.status(403).json({ message: "Data de Nascimento Inválida" });
          return;
        }
        await fbRep.update(`update responsaveis set SENHA_WEB = '${password}', EMAIL = '${email}' where  CPF= '${cpf}' `);
        emailService.send(
          email,
          'Bem vindo ao Sônia Academic',
          global.EMAIL_TMPL.replace('{0}', nomeResp));
        res.status(201).json({ message: "Criado com sucesso!" });

      } else {
        res.status(404).json({
          message: "CPF não encontrado!"
        });
      }
    } else {
      res.status(403).json({
        message: "CPF Inválido!"
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  };


}

exports.authenticate = async (req, res, next) => {
  try {
    let cpf = req.body.cpf || "";
    let password = req.body.password || "";
    if (password == "" || cpf == "") {
      res.status(404).json({ message: "dados inválidos!" });
      return;
    }
    cpf = util.validaCpf(cpf);
    if (cpf != "") {
      password = util.tratarString(password);
      let result = await fbRep.query(`select RESPONSAVEL, RESP_ID, SENHA_WEB from responsaveis where cpf= '${cpf}'`);
      if (result.length > 0) {
        if (result[0].SENHA_WEB != password) {
          res.status(404).json({ message: "dados inválidos!" });
          return;
        }
        const tokenGerado = await authService.generateToken({
          id: result[0].RESP_ID
        });

        await mapMethods();

        res.status(200).json({
          token: tokenGerado,
          name: result[0].RESPONSAVEL
        });
      } else {
        res.status(404).json({
          message: "Dados inválidos"
        });
      }
    } else {
      res.status(403).json({
        message: "CPF Inválido!"
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.recoverPassword = async (req, res, next) => {
  try {

    let cpf = req.body.cpf || "";

    let nasc = req.body.nasc || "";
    let dtNasc = new moment(nasc).utc();

    let email = req.body.email || "";
    if (!util.isEmail(email)) {
      res.status(403).json({ message: "Email inválido" });
      return;
    }
    cpf = util.validaCpf(cpf);
    if (cpf != "") {
      let result = await fbRep.query(`select RESPONSAVEL, CPF, NASCIMENTO, EMAIL from responsaveis where cpf= '${cpf}'`);
      if (result.length > 0) {

        let nomeResp = result[0].RESPONSAVEL;
        let emailResp = result[0].EMAIL;

        let dtNascDb = result[0].NASCIMENTO;
        dtNascDb = moment(dtNascDb).utc();
        let dtCompara = dtNasc.isSame(dtNascDb, 'day')
        if (dtCompara == false) {
          res.status(403).json({ message: "Data de Nascimento Inválida" });
          return;
        }
        if (emailResp != email) {
          res.status(403).json({ message: "Email é diferente do informado na base dados!" });
          return;
        }
        let pass1 = uuidv1();
        let pass2 = uuidv4();
        let pass = pass1.substring(0, 4) + pass2.substring(0, 4);

        //enviar email
        res.status(200).json({ message: "Senha Enviada para o email cadastrado!" });
      } else {
        res.status(404).json({
          message: "CPF não encontrado!"
        });
      }
    } else {
      res.status(403).json({
        message: "CPF Inválido!"
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  };

}

exports.changePassword = async (req, res, next) => {
  try {
    let cpf = req.body.cpf || "";
    let password = req.body.password || "";
    let new_password = req.body.new_password || "";
    if (password == "" || cpf == "") {
      res.status(404).json({ message: "dados inválidos!" });
      return;
    }
    cpf = util.validaCpf(cpf);
    if (cpf != "") {
      let passwordteste = util.passwordValidation(new_password);
      if (new_password == "" || passwordteste == false) {
        res.status(403).json({ message: "A Senha deve conter pelo menos oito caracteres, uma letra maiúscula, um número e um caractere especial:" });
        return;
      }
      new_password = util.tratarString(new_password);
      let result = await fbRep.query(`select RESPONSAVEL, RESP_ID, SENHA_WEB from responsaveis where cpf= '${cpf}'`);
      if (result.length > 0) {
        if (result[0].SENHA_WEB != password) {
          res.status(404).json({ message: "dados inválidos!" });
          return;
        }
        await fbRep.query(`update responsaveis set SENHA_WEB = '${new_password}' where  CPF= '${cpf}'`);
        res.status(200).json({ message: "Senha alterada com Sucesso!" });
      } else {
        res.status(404).json({
          message: "Dados inválidos"
        });
      }
    } else {
      res.status(403).json({
        message: "CPF Inválido!"
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
