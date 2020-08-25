'use strict';

const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');

exports.fromTimeStampToDateUTC = (value) => {
  try {
    if (!value) {
      return new Date(0);
    }

    if (_.isString(value)) {
      value = _.toInteger(value);
    }

    if (_.isInteger(value) && value >= 0) {
      return new Date(value * 1000);
    } else {
      return new Date(0);
    }
  } catch (e) {
    return new Date(0);
  }
}

exports.sleep = (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

exports.saveLogError = (err, fileName) => {
  try {
    //fs.ensureDirSync('./logs');

    let errorData =
    {
      datetime: new Date().toLocaleString(),
      stack: err.stack
    };

    try {
      errorData.errorUrl = err.response.request.res.responseUrl;
    } catch (er) {

    }

    fs.appendFileSync(`./logs/${fileName}`, JSON.stringify(errorData, undefined, 2));
  }
  catch (e) { }
}

exports.validaCpf = (cpf) => {

  cpf = cpf.replace(/[^0-9]*/g, '')

  if (cpf.length == 11) {
    if (cpf == "00000000000"
      || cpf == "11111111111"
      || cpf == "22222222222"
      || cpf == "33333333333"
      || cpf == "44444444444"
      || cpf == "55555555555"
      || cpf == "66666666666"
      || cpf == "77777777777"
      || cpf == "88888888888"
      || cpf == "99999999999")
      return false;
    var soma = 0
    var resto
    for (var i = 1; i <= 9; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(cpf.substring(9, 10))) return "";
    soma = 0
    for (var i = 1; i <= 10; i++)
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11
    if ((resto == 10) || (resto == 11)) resto = 0
    if (resto != parseInt(cpf.substring(10, 11))) return "";
    return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9, 11);

  } else if (cpf.length == 14) {
    if (cpf == "00000000000000"
      || cpf == "11111111111111"
      || cpf == "22222222222222"
      || cpf == "33333333333333"
      || cpf == "44444444444444"
      || cpf == "55555555555555"
      || cpf == "66666666666666"
      || cpf == "77777777777777"
      || cpf == "88888888888888"
      || cpf == "99999999999999")
      return false
    var tamanho = cpf.length - 2
    var numeros = cpf.substring(0, tamanho)
    var digitos = cpf.substring(tamanho)
    var soma = 0
    var pos = tamanho - 7
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != digitos.charAt(0)) return "";
    tamanho = tamanho + 1
    numeros = cpf.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != digitos.charAt(1)) return "";
    return cpf.substring(0, 2) + '.' + cpf.substring(2, 5) + '.' + cpf.substring(5, 8) + '/'
      + cpf.substring(8, 12) + '-' + cpf.substring(12, 14);
  }
  return "";
}

exports.isEmail = (email) => {
  let reg = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  return reg.test(email);
}



// let valido = true;
// if (valido) {
//   return "035.483.127-56";
// } else {
//   return "";

// }

exports.tratarString = (str) => {
  if (str != "") {
    let novaStr = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] == "'") {
        novaStr = novaStr + "''";
      } else {
        novaStr = novaStr + str[i];
      }
    }
    return novaStr;
  }
  return "";
}

exports.tratarDtNasc = (nasc) => {
  nasc = nasc.replace(/[^0-9]*/g, '')
  if (nasc != 8) {
    return false;
  }
}

exports.passwordValidation = (password) => {
  //let regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  //return (regex.exec(password) != null);
  let reg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
  return reg.test(password);
}
