'use strict';

const pool = require('../db/firebird');

exports.query = async (xSQL) => {
  try {
    return new Promise((resolver, rejeitar) => {
      pool.get((err, db) => {
        if (err) {
          rejeitar(err);
          return;
        }

        db.query(xSQL, (erro, resultado) => {
          if (erro) {
            rejeitar(erro);
            return;
          }

          /*resultado[0].LOGO1(function (err, name, e) {

            if (err)
              throw err;

            e.on('data', function (chunk) {
              console.log('1');
              // reading data
            });

            e.on('end', function () {
              console.log('2');
              db.detach();
            });
          });*/

          db.detach();
          resolver(resultado);
        });
      });
    });
  }
  catch (err) {
    return { status: 500, message: err.message };
  }
}

exports.update = async (xSQL) => {
  try {
    return new Promise((resolver, rejeitar) => {
      pool.get((err, db) => {
        if (err) {
          rejeitar(err);
          return;
        }

        db.query(xSQL, (erro, resultado) => {
          if (erro) {
            rejeitar(erro);
            return;
          }
          db.detach();
          resolver(resultado);
        });
      });
    });
  }
  catch (err) {
    return { status: 500, message: err.message };
  }
}

