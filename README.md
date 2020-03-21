# Projeto

Criação de uma API GraphQL em Node.js que simula um caixa eletrônico.

Baseada no desafio proposto em: https://github.com/funcional-health/challenge

## Tecnologias

- Node.js
  * Uso do framework Express
- Docker
  * Uso do Docker Compose para linkar a aplicação em Node.js com o banco de dados
- Banco de Dados MongoDB
- Testes unitários feitos utilizando Mocha, Chai, Supertest e Mongodb Memory Server

## Instalação

Para utilizar o projeto é necessário ter o Docker e Docker Compose instalado. O projeto foi testado e está funcionando corretamente com o Docker Toolbox no Windows.

Para começar a utilizar deve-se clonar o repositório:

```shell
git clone https://github.com/pedrovicentesantos/challenge-funcional-health.git
cd challenge-funcional-health
```

É importante manter a seguinte estrutura dos arquivos. Caso contrário, o `docker-compose` não irá encontrar os arquivos e não vai funcionar.
  
    challenge-funcional-health  
    └── models
    │    └── ContaCorrente.js
    └── test
    |    ├── apiTest.js
    │    ├── dbHandler.js
    │    └── dbTest.js
    ├── .gitignore
    ├── ContaCorrenteSchema.js
    ├── docker-compose.yml
    ├── Dockerfile
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── server.js
    └── setupDb.js

Depois de fazer o download dos arquivos deste repositório, para começar a usar deve-se fazer:

```shell
docker-compose build  
docker-compose up
```

Feito isto, o container Docker já estará funcionando. Dependendo do sistema operacional utilizado pode-se acessar a API por meio de:
- Linux: http://localhost:3000/graphql
- Windows: http://192.168.99.100:3000/graphql

O IP `192.168.99.100` é o default no Windows, mas caso não funcione, para pegar o IP correto pode-se usar o comando `docker-machine ip`.

## Comandos úteis

- Para parar o container:

Pode-se usar CTRL+C ou o seguinte comando:

```shell
docker-compose stop
```

- Para retomar o uso do container:

```shell
docker-compose start
```

- Para criar os containers novamente após alterações no código:

```shell
docker-compose up --build
```

- Para rodar os containers sem travar o terminal:

```shell
docker-compose up -d    # Pode-se usar --detach também
```

É importante comentar que o seguinte comando fará com que os dado não sejam persistidos no Banco de Dados, voltando a base de dados ao estado inicial:

```shell
docker-compose down   # Este comando deleta os containers e os dados do BD são reiniciados ao dar up nos containers novamente
```

Portanto, deve-se tomar cuidado ao usar este comando, pois pode gerar perda de dados.

## Acesso ao Banco de Dados
Pode-se acessar o MongoDB Admin para conferir se a base de dados está funcionando corretamente. Isso é feito acessando:

- Linux: http://localhost:8082
- Windows: http://192.168.99.100:8082

Para criar uma conexão para acessar a base dados basta seguir os seguintes passos:

1. Escolher um nome para conexão, por exemplo `conn`.
2. Usar a string para conexão: `mongodb://mongo:27017/db`
3. Clicar em `Connections`
4. Clicar em `Connect` em `Actions` para conectar a conexão criada anteriormente
5. Acessar a collection `contas` que se encontra dentro da base de dados `db`

## Funcionamento
Ao usar a API pela primeira vez, o Banco de Dados é inicializado com 3 contas correntes para permitir a realização de testes. 

Os números dessas contas são: `54321`, `12345` e `56789`. As 3 contas possuem saldo de `260` inicialmente.

O projeto utiliza a interface gráfica `graphiql` para poder testar e utilizar a API.

As requisições que podem ser feitas são as seguintes:

- Sacar um valor:

```shell
  mutation {
    sacar(conta: 54321, valor: 140) {
      conta
      saldo
      mensagem
    }
  }
```

- Depositar um valor:

```shell
  mutation {
    depositar(conta: 54321, valor: 200) {
      conta
      saldo
      mensagem
    }
  }
```

- Checar saldo da conta: 

```shell
  query {
    saldo(conta: 54321) {
      conta
      saldo
    }
  }
```

Cada uma das requisições retorna o que foi pedido no challenge e lida com erros como tentar acessar contas que não estão na base de dados, sacar valores maiores que o saldo, depositar valores negativos, entre outros possíveis cenários.

## Testes Unitários
O projeto também conta com testes unitários para verificar o funcionamento da API e das funções que acessam e alteram o Banco de dados.

Primeiro deve-se instalar as dependências para poder realizar os testes:

```shell
  npm install
```

Feito isto, para rodar os testes basta usar o comando:

```shell
  npm test
```

Para que os testes funcionem corretamente é importante que o servidor esteja rodando, ou seja, o container Docker tem que estar funcionando durante os testes.