'use strict';

const _ = require('lodash');
const moment = require('moment');
const util = require('../util/util');
const authService = require('../services/auth-service');
const { mapMethods, getSelectFields } = require('../util/methods-helper');

const fbRep = require('../repositories/firebird-rep');

exports.consultMatric = async (req, res, next) => {
    try {

        let token = req.headers['x-access-token'];
        let data = await authService.decodeToken(token);
        let ano = new Date().getFullYear();
        let result = await fbRep.query(`select distinct MATRIC_ID, SITUACAO, ALUNO_NOME, TURMA_NOME from turma_matricula b inner join cursos on b.PRINCIPAL = 1 where RESP_ID =${data.id} and ANO_LETIVO = ${ano}`);

        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.consultNotas = async (req, res, next) => {
    try {
        await mapMethods();

        let token = req.headers['x-access-token'];
        let data = await authService.decodeToken(token);

        let ano = new Date().getFullYear();
        let matric_id = req.params.matric_id || 0;
        let etapa = req.params.etapa || 0;
        if (!matric_id) {
            res.status(404).json({ message: "Matricula inválida!" });
            return;
        }
        if (etapa < 1 || etapa > 4) {
            res.status(404).json({ message: "Etata inválida" });
            return;
        }

        let matriculas = await fbRep.query(`select MATRIC_ID, METODO_ID from turma_matricula where RESP_ID = ${data.id} and MATRIC_ID=${matric_id} and ano_letivo = ${ano} and PRINCIPAL=1`);
        if (matriculas.length > 0) {
            let metodoId = matriculas[0].METODO_ID || 0;
            if (!(metodoId && global.methodsList[metodoId])) {
                res.status(404).json({ message: "Metodo não encontrado!" });
                return;
            }
            let notas1 = getSelectFields(metodoId, etapa);

            let notas = await fbRep.query(`select NOME_PROF, NOME_DISC, ${notas1} from v_notas where MATRICULA_ID = ${matric_id}`);
            res.status(200).json(notas);
        } else {
            res.status(404).json({ message: "Matricula inexistente!" });
        }



    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.consultBoletos = async (req, res, next) => {
    try {

        let token = req.headers['x-access-token'];
        let data = await authService.decodeToken(token);
        let ano = new Date().getFullYear();
        let matric_id = req.params.matric_id || 0;
        if (!matric_id) {
            res.status(404).json({ message: "dados inválidos!" })
        } else {
            let matriculas = await fbRep.query(`select MATRIC_ID from turma_matricula where RESP_ID = ${data.id} and MATRIC_ID=${matric_id} and ano_letivo = ${ano} and PRINCIPAL=1`);
            if (matriculas.length > 0) {
                let notas = await fbRep.query(`select BOLETO_ID, DESCRICAO, SITUACAO_BOLETO, VALOR_APAGAR, VENCIMENTO, LINHA_DIGITAVEL from BOLETOS where MATRICULA_ID = ${matric_id}`);
                res.status(200).json(notas);
            } else {
                res.status(404).json({ message: "Matricula inexistente!" });
            }


        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}