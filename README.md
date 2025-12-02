#  AniNote

Aplicação para adicionar e visualizar comentários de animes.  
Frontend em React + Backend em Node.js com SQLite.

---

## Estrutura do projeto

- **frontend/** → Código da aplicação React  
- **backend/** → Código do servidor Node.js com SQLite

---

##  Pré-requisitos

- Node.js  
- npm  

---

##  Rodando o backend (Node.js)

1. Abra o terminal na pasta `backend`:

```bash
cd aninote/backend
```

2. Instale as dependências:

```bash
npm install
```
3. Inicie o servidor:

```bash
node server.js
```
O backend estará rodando em: http://localhost:4000

## Rodando o frontend (React)

1. Abra o terminal na pasta `frontend`:

```bash
cd aninote/frontend
```

2. Instale as dependências:

```bash
npm install
```
3. Inicie o servidor de desenvolvimentp:

```bash
npm run dev
```
O frontend será aberto no navegador (geralmente http://localhost:5174)

---

##  Banco de dados

O projeto utiliza **SQLite** como banco de dados, armazenado no arquivo `backend/aninote.db`.  
O banco de dados será criado automaticamente na primeira execução do backend, utilizando a biblioteca `better-sqlite3`. 

**Não há necessidade de instalar o SQLite separadamente**. A biblioteca `better-sqlite3` é responsável por gerenciar o banco de dados diretamente no backend.


---

## Como usar

1. Abra o site no navegador.

**O site é o o link que está em `Local` quando rodamos o frontend**

Normalmente:
```bash
Local:   http://localhost:5174/
```
2. Clique em um anime para ver detalhes.
3. Preencha seu nome e comentário.
4. Todos os comentários são salvos no banco de dados e exibidos na tela.

---

## Observações

1. O backend deve estar rodando antes do frontend.
2. Comentários são salvos localmente no SQLite.
