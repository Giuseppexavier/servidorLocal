'use strict';

const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');

const mapMethods = async () => {
  global.methodsList = {};

  try {
    const fbRep = require('../repositories/firebird-rep');

    let result = await fbRep.query(`select * from METODOS`);

    if (result.length > 0) {

      for (let i = 0; i < result.length; i++) {
        let metodo = {
          ID: result[i].METODO_ID,
          TIPO: result[i].TIP_METODO
        };

        if (result[i].TIP_METODO == 1) {
          for (let nEtapa = 1; nEtapa <= 4; nEtapa++) {//etapas
            if (result[i][`USA_SM${nEtapa}`]) {
              metodo[`USA_SM${nEtapa}`] = 1;


              for (let c = 1; c <= 5; c++) {//campos
                if (result[i][`NT${nEtapa}${c}`]) metodo[`NT${nEtapa}${c}`] = 1;
                if (result[i][`NT${nEtapa}${c}_DESC`]) metodo[`NT${nEtapa}${c}_DESC`] = result[i][`NT${nEtapa}${c}_DESC`];
              }

              if (result[i][`USA_REC${nEtapa}`]) {
                metodo[`USA_REC${nEtapa}`] = 1;


                for (let c = 1; c <= 3; c++) {//campos
                  if (result[i][`REC${nEtapa}${c}`]) metodo[`REC${nEtapa}${c}`] = 1;
                  if (result[i][`REC${nEtapa}${c}_DESC`]) metodo[`REC${nEtapa}${c}_DESC`] = result[i][`REC${nEtapa}${c}_DESC`];
                }
                metodo[`REC${nEtapa}`] = result[i][`REC${nEtapa}`];
              }

              metodo[`SM${nEtapa}`] = result[i][`SM${nEtapa}`];
            }

            metodo[`MF${nEtapa}`] = result[i][`MF${nEtapa}`];

          }

        } else {  //TIP_METODO

        } //TIP_METODO

        global.methodsList[result[i].METODO_ID] = metodo;
      }

    }

    //let teste = getSelectFields(2);

    //  console.log('1');
  } catch (err) {
  }
}

const getSelectFields = (id, nEtapa) => {
  let listFields = [];

  if (global.methodsList && global.methodsList[id]) {
    if (global.methodsList[id].TIPO == 1) {  //normal

      if (global.methodsList[id][`USA_SM${nEtapa}`]) {
        for (let c = 1; c <= 5; c++) {//campos
          if (global.methodsList[id][`NT${nEtapa}${c}`])
            listFields.push(`NT${nEtapa}${c}`);
        }


        if (global.methodsList[id][`USA_REC${nEtapa}`]) {
          for (let c = 1; c <= 3; c++) {//campos
            if (global.methodsList[id][`REC${nEtapa}${c}`])
              listFields.push(`REC${nEtapa}${c}`);
          }

          listFields.push(`REC${nEtapa}`);
        }

        listFields.push(`SM${nEtapa}`);
      }

      listFields.push(`MF${nEtapa}1`);

    } //tipo
    else if (global.methodsList[id].TIPO == 2) { //conceito
      listFields.push(`NC${nEtapa}`);
    } //tipo

  }

  listFields.push('NF');
  listFields.push('TP');
  listFields.push('MA');
  listFields.push('PF');

  return listFields.join(',');
}

module.exports = { mapMethods, getSelectFields };

//mapMethods();
