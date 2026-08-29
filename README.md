# my-blog-app

Um blog interativo desenvolvido com **Next.js**, **Prisma**, **Tailwind CSS**, **PostgreSQL** e **AWS S3**, permitindo a criação, edição e visualização de posts, além da interação por meio de comentários.

> **Status:** 🚧 Em desenvolvimento

---

# Sobre o projeto

O **my-blog-app** é uma aplicação web desenvolvida com o objetivo de aprimorar conhecimentos em desenvolvimento Full Stack utilizando o ecossistema do React e tecnologias modernas.

A aplicação permite que usuários publiquem conteúdos, compartilhem ideias e interajam através de comentários, utilizando uma arquitetura escalável e boas práticas de desenvolvimento.

## Funcionalidades

* ✍️ Criação de posts
* 📝 Edição de posts
* 🗑️ Exclusão de posts
* 💬 Sistema de comentários
* 🖼️ Upload de imagens para AWS S3
* 📱 Interface responsiva
* 🔒 Autenticação utilizando JWT

---

# Tecnologias utilizadas

| Tecnologia       | Descrição                                                          |
| ---------------- | ------------------------------------------------------------------ |
| **Next.js**      | Framework React para construção de aplicações Full Stack modernas. |
| **Prisma ORM**   | ORM para comunicação com o banco de dados PostgreSQL.              |
| **Tailwind CSS** | Framework utilitário para estilização rápida e responsiva.         |
| **PostgreSQL**   | Banco de dados relacional utilizado pela aplicação.                |
| **Docker**       | Containerização da aplicação e do banco de dados.                  |
| **AWS S3**       | Armazenamento das imagens dos posts.                               |
| **LocalStack**   | Simulação dos serviços da AWS durante o desenvolvimento.           |

---

# Preparando o ambiente de desenvolvimento

## Pré-requisitos

Antes de iniciar, certifique-se de possuir instalado em sua máquina:

* Docker
* Docker Compose

---

## Configurando as variáveis de ambiente

Na raiz do projeto, crie um arquivo chamado **`.env`** utilizando o arquivo **`.env.example`** como referência.

```env
# Banco de dados
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL=

# AWS / LocalStack
AWS_S3_REGION=sa-east-1
AWS_S3_ACCESS_KEY_ID=
AWS_S3_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
LOCALSTACK_AUTH_TOKEN=

# Front-end
NEXT_PUBLIC_AWS_ENDPOINT=
NEXT_PUBLIC_AWS_S3_CLOUD_ENDPOINT=
NEXT_PUBLIC_DOMAIN=

# Desenvolvimento
WATCHPACK_POLLING=true

# Autenticação
JWT_SECRET=
```

### Descrição das variáveis

| Variável                            | Obrigatória | Descrição                                                                                             |
| ----------------------------------- | :---------: | ----------------------------------------------------------------------------------------------------- |
| `POSTGRES_USER`                     |      ✅      | Usuário utilizado pelo PostgreSQL.                                                                    |
| `POSTGRES_PASSWORD`                 |      ✅      | Senha do usuário do PostgreSQL.                                                                       |
| `POSTGRES_DB`                       |      ✅      | Nome do banco de dados criado pelo PostgreSQL.                                                        |
| `DATABASE_URL`                      |      ✅      | String de conexão utilizada pelo Prisma para acessar o banco de dados.                                |
| `AWS_S3_REGION`                     |      ✅      | Região onde o bucket S3 está localizado (ex.: `sa-east-1`).                                           |
| `AWS_S3_ACCESS_KEY_ID`              |      ✅      | Access Key da AWS (ou LocalStack durante o desenvolvimento).                                          |
| `AWS_S3_SECRET_ACCESS_KEY`          |      ✅      | Secret Access Key da AWS (ou LocalStack).                                                             |
| `AWS_S3_BUCKET_NAME`                |      ✅      | Nome do bucket utilizado para armazenar as imagens dos posts.                                         |
| `LOCALSTACK_AUTH_TOKEN`             |      ⚠️     | Token utilizado para autenticação no LocalStack Cloud. Necessário para alguns recursos da plataforma. |
| `NEXT_PUBLIC_AWS_ENDPOINT`          |      ✅      | Endpoint utilizado pela aplicação para acessar o serviço S3 (LocalStack ou AWS).                      |
| `NEXT_PUBLIC_AWS_S3_CLOUD_ENDPOINT` |      ✅      | Endpoint público utilizado para acessar os arquivos armazenados no bucket.                            |
| `NEXT_PUBLIC_DOMAIN`                |      ✅      | URL base da aplicação (ex.: `http://localhost:3000`).                                                 |
| `WATCHPACK_POLLING`                 |      ❌      | Habilita o modo de polling para detecção de alterações em ambientes Docker.                           |
| `JWT_SECRET`                        |      ✅      | Chave secreta utilizada para assinatura e validação dos tokens JWT.                                   |

---

# Executando a aplicação

Após configurar o arquivo `.env`, execute:

```bash
docker compose up --build
```

Na primeira execução, as imagens serão construídas e os containers iniciados.

---

# Configurando o bucket S3 (LocalStack)

Após iniciar os containers, acesse:

https://app.localstack.cloud/

Em seguida:

1. Faça login em sua conta.
2. Acesse o serviço **S3**.
3. Crie um bucket com o mesmo nome informado na variável:

```env
AWS_S3_BUCKET_NAME=
```

Esse bucket será utilizado para armazenar as imagens enviadas pelos usuários durante o desenvolvimento.

---

# 📂 Estrutura do projeto

```text
.
├── prisma/
├── public/
├── src/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── package.json
└── README.md
```

---

# 📄 Licença

Este projeto foi desenvolvido para fins de estudo e aprimoramento técnico.