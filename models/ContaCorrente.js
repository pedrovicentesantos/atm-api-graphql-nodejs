const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContaCorrenteSchema = new Schema({
  conta: Number,
  saldo: Number,
  mensagem: String},
  {collection: 'contas'}
);

module.exports = mongoose.model('ContaCorrenteModel', ContaCorrenteSchema);