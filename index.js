const app = require('express')();
const expressGraphql = require('express-graphql');
const {buildSchema} = require('graphql');

function contaExiste(conta) {
  return providers.contas.find(item => item.conta === Number(conta))
}

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

const providers = {
  contas: [{'conta': 54321, 'saldo': 160}]
};

const resolvers = {
  saldo({conta}) {
    return contaExiste(conta) || {"mensagem":"Conta não existe"}
  },
  sacar({conta,valor}) {
    if (contaExiste(conta)) {
      const { saldo } = providers.contas.find(item => item.conta === Number(conta));
      if (valor <= saldo) {
        providers.contas.map(item => {
          if (item.conta === Number(conta)) {
            item.saldo = item.saldo - valor;
            item.mensagem = "Saque realizado com sucesso"
          }
        })
      } else {
        providers.contas.map(item => {
          if (item.conta === Number(conta)) {
            item.mensagem = "Erro: Saldo insuficiente para saque";
          }
        });
      }
      return providers.contas.find(item => item.conta === Number(conta));  
    }
    return {"mensagem":"Conta não existe"}
    
  },
  depositar({conta,valor}) {
    if (contaExiste(conta)) {
      if (valor >= 0) {
        providers.contas.map(item => {
          if (item.conta === Number(conta)) {
            item.saldo = item.saldo + valor;
            item.mensagem = "Depósito realizado com sucesso"
          }
        });
      } else {
        providers.contas.map(item => {
          if (item.conta === Number(conta)) {
            item.mensagem = "Erro: Não é possível fazer depósitos de valores negativos";
          }
        });
      }
      return providers.contas.find(item => item.conta === Number(conta));
    }
    return {"mensagem":"Conta não existe"}
  }
};

app.use(
  '/graphql',
  expressGraphql({
    schema,
    rootValue: resolvers,
    graphiql: true
  })
);

app.listen(3000);