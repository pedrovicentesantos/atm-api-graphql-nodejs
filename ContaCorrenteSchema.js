const { buildSchema } = require('graphql');
const ContaCorrenteModel = require('./models/ContaCorrente');

const schema = buildSchema(`
  type ContaCorrente {
    conta: Int
    saldo: Int
    mensagem: String
  }
  type Query {
    saldo(conta: Int!): ContaCorrente
  }
  type Mutation {
    sacar(conta: Int!, valor: Int!): ContaCorrente
    depositar(conta: Int!, valor: Int!): ContaCorrente
  }
`);

const resolvers = {
  async saldo({conta}) {
    const contaOnDb = await ContaCorrenteModel.findOneAndUpdate({conta},{$set: {mensagem:""}},{new:true});
    return contaOnDb || {"mensagem":"Erro: Conta não existe"}
  },
  async sacar({conta,valor}) {
    if (valor > 0) {
      let contaOnDb = await ContaCorrenteModel.findOne({conta});
      if (contaOnDb) {
        const saldo = contaOnDb.saldo;
        if (valor <= saldo) {
          contaOnDb = await ContaCorrenteModel.findOneAndUpdate({conta},
            {$set: 
              {saldo:saldo-valor,mensagem:"Saque realizado com sucesso"}
            },
            {new:true});
        } else {
          contaOnDb = await ContaCorrenteModel.findOneAndUpdate({conta},
            {$set: 
              {mensagem:"Erro: Saldo insuficiente para saque"}
            },
            {new:true});
        }  
        return contaOnDb
      }
      return {"mensagem":"Erro: Conta não existe"}
    }
    return {"mensagem":"Erro: Não é possível sacar valores negativos"}
  },
  async depositar({conta,valor}) {
    let contaOnDb = await ContaCorrenteModel.findOne({conta});
    if (contaOnDb) {
      const saldo = contaOnDb.saldo;
      if (valor >= 0) {
        contaOnDb = await ContaCorrenteModel.findOneAndUpdate({conta},
          {$set: 
            {saldo:saldo+valor,mensagem:"Depósito realizado com sucesso"}
          },
          {new:true});
        return contaOnDb
      } else {
        return {"mensagem":"Erro: Não é possível fazer depósitos de valores negativos"} 
      }
    }
    return {"mensagem":"Erro: Conta não existe"}
  }
};

module.exports = {
  schema,
  resolvers
}