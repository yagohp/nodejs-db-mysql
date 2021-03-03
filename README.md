# Mysql Database Connection
Módulo para executar as operações de CRUD em um banco MYSQL e executar strings SQLs customizadas.

## Utilização

Esse módulo foi construído para ser utilizado como um módulo em `node_modules`. Para instalar este repositório em um projeto utilize o seguinte comando:

```
npm install --save git+https://github.com/yagohp/nodejs-db-mysql.git
```

## Testes

Para executar os testes unitários desse módulo e verificar se está operando corretamente, execute o seguinte comando:

```
npm test
```

Caso ocorra um erro, mesmo que seja dos testes, o módulo criará uma pasta chamada `db_logs` na raiz do seu projeto, essa pasta conterá os arquivos `stderr.log` e `stdout.log`, os quais conterão os detalhes de log e stacktrace registrados.

## Nomenclatura de Arquivos

O padrão para os nomes de arquivos é o lower `camelCase`, onde a primeira palavra é iniciada com a letra minúscula e as demais com letra maiúscula e, para as palavras subsequentes o mesmo se aplica, sem espaços ou caracteres especiais entre elas.

Veja os exemplos abaixo:

```
userRoutes.js
userController.js
server.js
```

Já o padrão para pastas é o `snake_case`, onde as palavras são conectadas com o caractere `underline`. Exemplo:

```
wiring_plugins
upload_pics
```
## Estrutura de Pastas

A estrutura de diretórios deste módulo é organizada da seguinte forma:

```
├── tests
└── utils
```


**Pasta tests**

Contém os arquivos de `Testes unitários` e `Testes de integração` seguindo respectivamente a mesma estrutura de diretórios da raiz, exceto a pasta utils.

Os arquivos de teste unitário possuem os mesmos nomes de seus respectivos arquivos que serão testados, como por exemplo:

```
mysql.js >>> mysql.test.js
```

**Pasta utils**

Essa pasta contém scripts diversos, com mecanismos simples que possam ser reaproveitados. Como por exemplo `logger.js`, script que escreve logs e erros em um arquivo.

## Bugfix


## Hotfix