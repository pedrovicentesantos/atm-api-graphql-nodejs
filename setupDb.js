const ContaCorrenteModel = require('./models/ContaCorrente');

function populateDB() {
  const contas = [54321,12345,56789];
  contas.forEach(async (value) => {
    let conta = await ContaCorrenteModel.findOne({conta:value});
    if (!conta) {
      await ContaCorrenteModel.create(
        {conta:value,
        saldo:260,
        mensagem:""}
      )  
    }
  });
}

module.exports = {
  populateDB
}