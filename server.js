const express = require('express');
const mongoose = require('mongoose');
const graphqlExpress = require("express-graphql");

const { schema, resolvers } = require('./ContaCorrenteSchema');
const populateDb = require('./setupDb').populateDB;

const app = express();

mongoose.connect('mongodb://mongo:27017/db', 
                {useNewUrlParser: true, useUnifiedTopology: true}, 
                (err) => {
                  if (err) {
                    console.log("Erro ao conectar com o MongoDB");
                  } else{
                    console.log("Conectado ao MongoDB");
                  }
});

populateDb();

app.set('port', 3000);
app.listen(app.get('port'), ()=> {
    console.log("Node app is running at localhost:" + app.get('port'))
});

app.use('/graphql', graphqlExpress({
  schema: schema,
  rootValue: resolvers,
  graphiql: true
}));