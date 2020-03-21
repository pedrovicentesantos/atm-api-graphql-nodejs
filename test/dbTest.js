const assert = require('chai').assert;

const dbHandler = require('./dbHandler');
const { resolvers } = require('../ContaCorrenteSchema');

const contaCorrenteExample = {
  conta: 54321,
  saldo: 160,
  mensagem: ""
}

describe('Functions acting on MongoDB', function(){
  const conta = 54321;
  const valor = 140;

  before(async () => {
    await dbHandler.connect();
  });
  
  after(async() => {
    await dbHandler.closeDatabase();
  });
  
  afterEach(async() => {
    await dbHandler.clearDatabase();
  });
  
  beforeEach(async() => {
    await dbHandler.createDoc(contaCorrenteExample);
  });

  describe('Function saldo', function(){
    it('should return the correct saldo when conta is on DB', async function(){
      const result = await resolvers.saldo({conta});
      const expected = contaCorrenteExample.saldo;
      assert.equal(result.saldo,expected);
    });
    it('should return Erro: Conta não existe when conta is not on DB', async function(){
      const result = await resolvers.saldo({conta:5});
      const expected = 'Erro: Conta não existe';
      assert.equal(result.mensagem,expected);
    });
  });
  describe('Function sacar', function() {
    it('should return saldo-valor when conta is on DB', async function(){
      const result = await resolvers.sacar({conta,valor});
      const expected = contaCorrenteExample.saldo - valor;
      assert.equal(result.saldo,expected);
    });
    it('should return saldo when valor > saldo and conta is on DB', async function(){
      const result = await resolvers.sacar({conta,valor:2000000});
      const expected = contaCorrenteExample.saldo;
      assert.equal(result.saldo,expected);
    });
    it('should return Erro: Conta não existe when conta is not on DB', async function(){
      const result = await resolvers.sacar({conta:5,valor});
      const expected = 'Erro: Conta não existe';
      assert.equal(result.mensagem,expected);
    });
    it('should return Erro: Não é possível sacar valores negativos when valor < 0', async function(){
      const result = await resolvers.sacar({conta,valor:-100});
      const expected = 'Erro: Não é possível sacar valores negativos';
      assert.equal(result.mensagem,expected);
    });
  });
  describe('Function depositar', function() {
    it('should return saldo+valor when conta is on DB', async function(){
      const result = await resolvers.depositar({conta,valor});
      const expected = contaCorrenteExample.saldo + valor;
      assert.equal(result.saldo,expected);
    });
    it('should return Erro: Conta não existe when conta is not on DB', async function(){
      const result = await resolvers.depositar({conta:5,valor});
      const expected = 'Erro: Conta não existe';
      assert.equal(result.mensagem,expected);
    });
    it('should return Erro: Não é possível fazer depósitos de valores negativos when valor < 0', async function(){
      const result = await resolvers.depositar({conta,valor:-100});
      const expected = 'Erro: Não é possível fazer depósitos de valores negativos';
      assert.equal(result.mensagem,expected);
    });
  });
})