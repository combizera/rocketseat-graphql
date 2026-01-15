# Rocketseat - GRAPHQL

## GRAPHQL

O GraphQL é uma linguagem de consulta para APIs, foi criada pelo Facebook. Diferente do REST, onde você tem múltiplos endpoints para diferentes recursos, o GraphQL utiliza um único endpoint para todas as operações. Com o GraphQL, os clientes podem solicitar exatamente os dados de que precisam.

### Conceitos Fundamentais

- **Schema**: Define a estrutura da API, e quais dados existem e como acessá-los.

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}

type Query {
  users: [User!]!
  user(id: ID!): User
  posts: [Post!]!
}

type Mutation {
  createUser(name: String!, email: String!): User!
  deleteUser(id: ID!): Boolean!
}
```

- **Queries**: Busca os dados do servidor (como uma requisição GET no REST).

Anotação mental importante: Sempre para não ter erros no schema é necessário ter pelo menos uma query definida.

```graphql
#Busca
query {
  user(id: "123") {
    name
    email
    posts {
      title
    }
  }
}
#Resposta
{
  "data": {
    "user": {
      "name": "Fulaninho",
      "email": "fulano@gmail.com",
      "posts": [
        {
          "title": "Meu primeiro post"
        },
        {
          "title": "Aprendendo GraphQL"
        }
      ]
    }
  }
}
```

- **Mutations**: Modifica os dados no servidor (como POST, PUT, DELETE no REST).

```graphql
mutation {
  createUser(name: "Fulano", email: "fulano@gmail.com") {
    id
    name
    email
  }
}
#Resposta
{
  "data": {
    "createUser": {
      "id": "456",
      "name": "Fulano",
      "email": "fulano@gmail.com"
    }
  }
}
```

- **Resolvers**: Funções que buscam os dados para cada campo no schema.

```typescript
const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      return context.prisma.user.findUnique({
        where: { id: args.id },
      });
    },
  },
  Mutation: {
    createUser: async (parent, args, context) => {
      return context.prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
        },
      });
    },
  },
};
```

### Vantagens do GraphQL

- **Flexibilidade**: Os clientes podem solicitar exatamente os dados de que precisam.
- **Eficiência**: Reduz o número de requisições necessárias para obter dados relacionados.
- **Tipagem Forte**: O schema define claramente os tipos de dados e suas relações.
- **Versionamento Simplificado**: Novos campos podem ser adicionados sem impactar os clientes existentes.

### Desvantagens do GraphQL

- **Complexidade Inicial**: Curva de aprendizado mais íngreme comparada ao REST.
- **Caching**: Pode ser mais desafiador implementar caching eficazmente.
- **Overhead de Consulta**: Consultas complexas podem levar a problemas de desempenho se não forem bem gerenciadas.

## JWT - JSON Web Token

JWT é um padrão para **transmitir informações de forma segura** entre cliente e servidor. É a forma mais comum de autenticação em APIs modernas.

### Estrutura do JWT

Um JWT é composto por três partes principais, separadas por pontos (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     HEADER                          PAYLOAD                                             SIGNATURE
```

1. **Header (Cabeçalho)**: Contém informações sobre o tipo de token e o algoritmo de assinatura usado.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

2. **Payload (Corpo)**: Contém as declarações (claims) que são as informações que queremos transmitir, como o ID do usuário e o email.

```json
{
  "id": "123",
  "email": "fulano@gmail.com"
  "iat": 1516239022 // Issued At - Timestamp de quando o token foi emitido
  "exp": 1516242622 // Expiration - Timestamp de quando o token expira
}
```

3. **Signature (Assinatura)**: É usada para verificar se o token não foi alterado. É criada combinando o header codificado, o payload codificado e uma chave secreta.

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

### Como Funciona na Prática

1. Login(usuário envia credenciais)

```typescript
// Cliente envia credenciais
POST /graphql
{
  mutation {
    login(email: "teste@teste.com", password: "senha123") {
      token
      refreshToken
      user { id, name }
    }
  }
}

// Servidor valida e retorna tokens
{
  "data": {
    "login": {
      "token": "eyJhbGci...",           // Expira em 15min
      "refreshToken": "eyJhbGci...",    // Expira em 7 dias
      "user": { "id": "123", "name": "Combizera" }
    }
  }
}
```

2. Requisições autenticadas

```typescript
// Cliente envia token no header
POST /graphql
Headers: {
  Authorization: "Bearer eyJhbGci..."
}

{
  query {
    me {
      id
      name
      email
    }
  }
}
```

3. Validação do token no servidor

```typescript
const context = ({ req }) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return { user: null };

  try {
    const decoded = verifyJwt(token);
    return { userId: decoded.id };
  } catch (error) {
    return { user: null };
  }
};
```

### Vantagens do JWT

- **Stateless**: Não é necessário armazenar sessões no servidor.
- **Escalabilidade**: Fácil de escalar, pois o estado não é mantido no servidor.
- **Flexibilidade**: Pode ser usado em diferentes domínios e serviços.
- **Segurança**: Pode ser assinado e criptografado para proteger os dados.

### Desvantagens do JWT

- **Tamanho**: Tokens podem ser grandes, o que pode impactar a performance.
- **Revogação**: Difícil de revogar tokens antes do tempo de expiração.
- **Complexidade**: Implementação correta requer cuidado com segurança e gerenciamento de tokens.
