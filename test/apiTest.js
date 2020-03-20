const assert = require('chai').assert;
let url = "http://localhost:3000/graphql";
if (process.platform === "win32") {
  url = "http://192.168.99.100:3000/graphql";
}
const request = require('supertest')(url);

describe('API GraphQL', function() {
  describe('Query saldo', function() {
    it('should return an Object', function(done) {
      request.post('/')
      .send({ query: '{ saldo(conta: 54321) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const result = res.body.data;
        assert.isObject(result);
        done();
      })
    });
    it('should return an Object with keys:[conta, saldo, mensagem]', function(done) {
      request.post('/')
      .send({ query: '{ saldo(conta: 54321) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const keys = Object.keys(res.body.data.saldo);
        const expected = ['conta','saldo','mensagem'];
        assert.deepEqual(keys,expected);
        done();
      })
    });
    it('should return mensagem vazia when conta is on DB', function(done) {
      request.post('/')
      .send({ query: '{ saldo(conta: 54321) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.saldo.mensagem;
        const expected = "";
        assert.equal(mensagem,expected);
        done();
      })
    })
    it('should return mensagem = Erro: Conta não existe when conta is not on DB', function(done) {
      request.post('/')
      .send({ query: '{ saldo(conta: 543) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.saldo.mensagem;
        const expected = "Erro: Conta não existe";
        assert.equal(mensagem,expected);
        done();
      })
    });
    it('should return typeof(conta)==typeof(saldo)==Number and typeof(mensagem)==String when conta is on DB', function(done) {
      request.post('/')
      .send({ query: '{ saldo(conta: 54321) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        assert.isNumber(res.body.data.saldo.conta);
        assert.isNumber(res.body.data.saldo.saldo);
        assert.isString(res.body.data.saldo.mensagem);
        done();
      })
    });
    it('should return null for conta and saldo when conta is not on DB', function(done) {
      request.post('/')
      .send({ query: '{ saldo(conta: 543) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        assert.isNull(res.body.data.saldo.conta);
        assert.isNull(res.body.data.saldo.saldo);
        done();
      })
    });
  });
  describe('Mutation depositar', function() {
    it('should return an Object', function(done) {
      request.post('/')
      .send({ query: 'mutation{ depositar(conta: 54321, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const result = res.body.data;
        assert.isObject(result);
        done();
      })
    });
    it('should return an Object with keys=[conta,saldo,mensagem]', function(done) {
      request.post('/')
      .send({ query: 'mutation{ depositar(conta: 54321, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const keys = Object.keys(res.body.data.depositar);
        const expected = ['conta','saldo','mensagem'];
        assert.deepEqual(keys,expected);
        done();
      })
    });
    it('should return mensagem = Erro: Conta não existe when conta is not on DB', function(done) {
      request.post('/')
      .send({ query: 'mutation{ depositar(conta: 543, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.depositar.mensagem;
        const expected = "Erro: Conta não existe";
        assert.equal(mensagem,expected);
        done();
      })
    });
    it('should return mensagem = Erro: Não é possível fazer depósitos de valores negativos when valor < 0', function(done){
      request.post('/')
      .send({ query: 'mutation{ depositar(conta: 54321, valor:-100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.depositar.mensagem;
        const expected = "Erro: Não é possível fazer depósitos de valores negativos";
        assert.equal(mensagem,expected);
        done();
      })
    });
    it('should return typeof(conta)==typeof(saldo)==Number and typeof(mensagem)==String when conta is on DB', function(done){
      request.post('/')
      .send({ query: 'mutation{ depositar(conta: 54321, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        assert.isNumber(res.body.data.depositar.conta);
        assert.isNumber(res.body.data.depositar.saldo);
        assert.isString(res.body.data.depositar.mensagem);
        done();
      })
    });
    it('should return mensagem = Depósito realizado com sucesso on success', function(done){
      request.post('/')
      .send({ query: 'mutation{ depositar(conta: 54321, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.depositar.mensagem;
        const expected = "Depósito realizado com sucesso";
        assert.equal(mensagem,expected);
        done();
      })
    });
    it('should return null for conta and saldo when conta is not on DB', function(done){
      request.post('/')
      .send({ query: 'mutation{ depositar(conta: 543, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        assert.isNull(res.body.data.depositar.conta);
        assert.isNull(res.body.data.depositar.saldo);
        done();
      })
    });
    it('should return null for conta and saldo when valor < 0', function(done){
      request.post('/')
      .send({ query: 'mutation{ depositar(conta: 54321, valor:-100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        assert.isNull(res.body.data.depositar.conta);
        assert.isNull(res.body.data.depositar.saldo);
        done();
      })
    });
  });
  describe('Mutation sacar', function(){
    it('should return an Object', function(done) {
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 54321, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const result = res.body.data;
        assert.isObject(result);
        done();
      })
    });
    it('should return an Object with keys=[conta,saldo,mensagem]', function(done) {
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 54321, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const keys = Object.keys(res.body.data.sacar);
        const expected = ['conta','saldo','mensagem'];
        assert.deepEqual(keys,expected);
        done();
      })
    });
    it('should return mensagem = Erro: Conta não existe when conta is not on DB', function(done) {
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 543, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.sacar.mensagem;
        const expected = "Erro: Conta não existe";
        assert.equal(mensagem,expected);
        done();
      })
    });
    it('should return mensagem = Erro: Não é possível sacar valores negativos when valor < 0', function(done){
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 54321, valor:-100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.sacar.mensagem;
        const expected = "Erro: Não é possível sacar valores negativos";
        assert.equal(mensagem,expected);
        done();
      })
    });
    it('should return typeof(conta)==typeof(saldo)==Number and typeof(mensagem)==String when conta is on DB', function(done){
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 54321, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        assert.isNumber(res.body.data.sacar.conta);
        assert.isNumber(res.body.data.sacar.saldo);
        assert.isString(res.body.data.sacar.mensagem);
        done();
      })
    });
    it('should return mensagem = Saque realizado com sucesso on success', function(done){
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 54321, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.sacar.mensagem;
        const expected = "Saque realizado com sucesso";
        assert.equal(mensagem,expected);
        done();
      })
    });
    it('should return null for conta and saldo when conta is not on DB', function(done){
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 543, valor:100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        assert.isNull(res.body.data.sacar.conta);
        assert.isNull(res.body.data.sacar.saldo);
        done();
      })
    });
    it('should return null for conta and saldo when valor < 0', function(done){
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 54321, valor:-100) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        assert.isNull(res.body.data.sacar.conta);
        assert.isNull(res.body.data.sacar.saldo);
        done();
      })
    });
    it('should return mensagem = Erro: Saldo insuficiente para saque when valor > saldo', function(done){
      request.post('/')
      .send({ query: 'mutation{ sacar(conta: 54321, valor:2000000000) { conta saldo mensagem } }'})
      .end((err,res) => {
        if (err) {
          return done(err)
        }
        const mensagem = res.body.data.sacar.mensagem;
        const expected = "Erro: Saldo insuficiente para saque";
        assert.equal(mensagem,expected);
        done();
      })
    });
  });
});

