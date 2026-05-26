
# 🛠️ HelpDesk

Um sistema completo de gerenciamento de chamados de suporte técnico, desenvolvido com foco em performance, experiência do usuário e controle de acessos baseado em perfis (**RBAC - Role-Based Access Control**). 

Este projeto foi desenvolvido como um desafio prático da trilha Full-stack da **Rocketseat**.

---

## 🚀 Demonstração

* **Link da Aplicação (Frontend):** [HelpDesk na Vercel](https://helpdesk-six-xi.vercel.app/)
* **Backend Hospedado em:** Render

---

## 📌 Visão Geral e Arquitetura

O **HelpDesk** centraliza o fluxo de suporte entre clientes, técnicos e administradores. A aplicação utiliza uma arquitetura baseada em **Perfis de Usuário (Roles)**, onde a interface, as rotas e as permissões se adaptam dinamicamente ao tipo de conta logada.

### Perfis e Funcionalidades

#### 👤 Cliente
* **Abertura de Chamados:** Criar novos chamados detalhando o problema enfrentado.
* **Acompanhamento:** Listar e monitorar exclusivamente os seus próprios chamados e históricos de atualização.

#### 👨‍🔧 Técnico
* **Painel Técnico:** Visualização detalhada dos chamados especificamente atribuídos ao seu perfil.
* **Gerenciamento de Fluxo:** Opção de iniciar o atendimento ou encerrar um chamado em andamento.
* **Lançamento de Serviços:** Vincular e registrar serviços específicos realizados dentro de um determinado chamado.

#### 👑 Administrador (Admin)
* **Visão Global:** Listar, visualizar e editar absolutamente todos os chamados abertos no sistema.
* **Gestão de Cadastros:** Listar, editar e adicionar novos usuários com o perfil de **Técnico**, além de gerenciar dados de **Clientes**.
* **Catálogo de Serviços:** Listar, criar, editar e desativar os serviços que podem ser acoplados aos chamados.

#### ⚙️ Recursos Comuns (Todos os Perfis)
* Atualização de perfil (Alterar nome e upload/troca de avatar com compressão de imagem).
* Alteração de senha de acesso de forma segura.

---

## 🛠️ Tecnologias e Dependências

A aplicação foi construída utilizando o ecossistema moderno do **React 19** com compilação ultra-rápida via **Vite** e tipagem estática com **TypeScript**.

* **Core:** `React 19` & `TypeScript`
* **Tooling/Bundler:** `Vite 8`
* **Roteamento:** `React Router 7` (Gerenciamento de rotas privadas e layouts de autenticação/aplicação)
* **Estilização:** `Tailwind CSS 4` (com `@tailwindcss/vite` para integração nativa e `tailwind-scrollbar-hide`)
* **Validação de Dados:** `Zod 4` (Esquemas de validação rigorosos para formulários e dados de entrada)
* **Comunicação API:** `Axios` (Instância configurada para consumo do backend hospedado no Render)
* **Otimização de Mídia:** `CompressorJS` (Compressão client-side automatizada de avatares antes do upload)
* **Manipulação de Datas:** `date-fns` (Formatação e cálculos de tempo dos chamados)
* **Componentes Visuais:** `SweetAlert2` (Alertas e modais de confirmação interativos) & `React SVG`

---

## 📁 Estrutura de Pastas (`src`)

A estrutura do projeto foi organizada seguindo boas práticas de modularização, separando componentes globais, páginas, contextos de estado e utilitários:

```text
src/
├── assets/          # Arquivos de mídia estáticos
├── components/      # Componentes reutilizáveis (Botões, Modais, Inputs, Layouts)
├── constants/       # Dados estáticos e configurações fixas
├── contexts/        # Estados globais (Ex: AuthContext para sessão do usuário)
├── dtos/            # Definições de Tipos e Interfaces de dados (Data Transfer Objects)
├── hooks/           # Custom Hooks compartilhados (Ex: useAuth)
├── pages/           # Telas completas da aplicação separadas por contextos
├── routes/          # Definição e proteção de rotas (Admin, Técnico, Cliente)
├── services/        # Configuração do Axios e chamadas de requisições API
├── utils/           # Funções utilitárias (Formatação de valores, datas, etc.)
├── App.tsx          # Componente raiz da aplicação
├── main.tsx         # Ponto de entrada do ecossistema React
└── index.css        # Estilos globais e diretivas do Tailwind

```
---
## 🔧 Como Executar o Projeto Localmente
**Pré-requisitos**
* Certifique-se de ter o Node.js instalado em sua máquina.

Passo a Passo
**Clonar o repositório:**

Bash
```
git clone [https://github.com/seu-usuario/HelpDesk.git](https://github.com/seu-usuario/HelpDesk.git)
cd HelpDesk
```

**Instalar as dependências:**

Bash
```
npm install
```

**Configurar variáveis de ambiente:**
Crie um arquivo .env na raiz do projeto e defina a URL da sua API:

**Iniciar o servidor de desenvolvimento:**
Bash
```
npm run dev
```
A aplicação estará disponível no seu navegador através do endereço informado no terminal (geralmente http://localhost:5173).

## 📄 Licença
Este projeto foi desenvolvido para fins estritamente acadêmicos e de estudo como parte do programa da Rocketseat.



