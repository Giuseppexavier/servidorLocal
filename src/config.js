
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>, seja bem vindo ao nosso App Sônia Academic, \r\n\
 o mais completo onde poderá ter acesso ao boletim dos seus filhos, conferir seus boletos e o mais importante \r\n\
 receber notificações sobre reuniões, feriados, eventos e muito mais!';

module.exports = {
  sendgridKey: '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',
  SALT_KEY: "93b4c811-fb7c-4a54-a4b0-316364f98449",
  PORT: 9157,
  FIREBIRD_OPTIONS: {
    host: 'localhost',
    port: 3050,
    database: 'X:/sl7_database/anamelia.fdb',
    user: 'SYSDBA',
    password: 'masterkey',
    //lowercase_keys = false,
    //role = null,
    //pageSize = 4096,
  }
}