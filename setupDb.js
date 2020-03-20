const ContaCorrenteModel = require('./models/ContaCorrente');

async function populateDB() {
  const conta = await ContaCorrenteModel.findOne({conta:54321})
  if(!conta) {
    await ContaCorrenteModel.create(
      {conta:54321,
      saldo:260,
      mensagem:""}
    )
  }
}

module.exports = {
  populateDB
}


// db.contas.insert({
//   conta:54321,
//   saldo:160,
//   mensagem:""
// })