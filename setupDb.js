const ContaCorrenteModel = require('./models/ContaCorrente');

async function populateDB() {
  const contas = [54321,12345,56789];
  for (item of contas) {
    let conta = await ContaCorrenteModel.findOne({conta:item});
    if (!conta) {
      await ContaCorrenteModel.create(
        {conta:item,
        saldo:260,
        mensagem:""}
      )  
    }
  }
}

module.exports = {
  populateDB
}