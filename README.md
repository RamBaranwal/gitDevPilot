# DevPilot

**Chat with your code.** An AI-powered assistant for exploring, understanding, and querying your GitHub repositories.

DevPilot turns your codebase into a conversational interface. By syncing your GitHub repositories and indexing them into a vector database, DevPilot allows you to ask questions about your architecture, find specific implementations, and understand complex logic through a Retrieval-Augmented Generation (RAG) pipeline.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Retrieval-Augmented Generation (RAG) Engine](#retrieval-augmented-generation-rag-engine)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Limitations & Roadmap](#limitations--roadmap)
- [Contributing](#contributing)

## Overview

Modern codebases are massive, and finding the context you need across hundreds of files can be tedious. Keyword searches often fail to capture semantic meaning, and standard AI assistants lack the specific context of your private repositories.

DevPilot solves this by bringing the AI directly to your code:
- Authenticates securely via **GitHub OAuth** to access your repositories.
- Syncs and fetches the repository tree directly from the GitHub API.
- Processes, chunks, and embeds your source code into a high-dimensional vector space using OpenAI embeddings.
- Retrieves semantically relevant code snippets when you ask a question and feeds them to an LLM to generate grounded, accurate answers.
- Wrapped in a premium, responsive, glassmorphism UI for a top-tier developer experience.

**Target users:**
- Developers onboarding to a new codebase who need to understand the architecture quickly.
- Engineers debugging complex issues spread across multiple files.
- Open-source contributors looking to find where specific features are implemented.

## Key Features

| Feature | Description |
|---|---|
| Seamless GitHub Integration | One-click login and repository syncing via GitHub OAuth2. |
| Automated Code Indexing | Background job processing to fetch, parse, and chunk source code while respecting rate limits. |
| Vector-Based Semantic Search | High-performance similarity search powered by `pgvector` and Spring AI. |
| Grounded AI Chat | LLM responses are strictly bounded by the retrieved context from your repository to prevent hallucinations. |
| Premium Glassmorphism UI | A state-of-the-art frontend built with Next.js, Tailwind CSS, and Base UI for a responsive and beautiful experience. |
| Session Management | Persistent chat sessions allow you to pick up previous conversations where you left off. |

## System Architecture

```text
       ┌────────────────────────┐
       │     User Interface     │
       │ (Next.js + Tailwind)   │
       └───────────┬─────────────┘
                   ▼
┌──────────────────────────────────┐
│        Spring Boot Backend       │
│   (REST APIs + Spring Security)  │
└────────────────┬─────────────────┘
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
┌────────────┐        ┌────────────┐
│ GitHub API │        │ OpenAI API │
│  (OAuth)   │        │ (LLM/RAG)  │
└────────────┘        └─────┬──────┘
                            ▼
                  ┌───────────────────┐
                  │ PostgreSQL DB     │
                  │ (pgvector store)  │
                  └───────────────────┘
```

### Component Breakdown

- **Frontend Client** — A Next.js application that provides the authentication flows, dashboard, repository management, and real-time chat interface.
- **Backend API** — A Spring Boot application managing users, handling GitHub API interactions, orchestrating indexing, and coordinating the chat pipeline.
- **Indexing Engine** — A multi-threaded executor that traverses a GitHub repository, filters out binary/irrelevant files, chunks text, and generates vector embeddings.
- **Vector Store** — PostgreSQL equipped with the `pgvector` extension to store 1536-dimensional embeddings and perform cosine-distance similarity searches.
- **LLM Pipeline** — Spring AI integration with OpenAI (`gpt-4o-mini` for chat and `text-embedding-3-small` for embeddings) to generate contextual answers.

## Retrieval-Augmented Generation (RAG) Engine

Every question you ask is processed through a strict pipeline to ensure accuracy:

1. **Query Embedding:** Your natural language question is converted into a vector using the OpenAI embedding model.
2. **Semantic Search:** The backend queries `pgvector` using Cosine Distance to find the top `K` most relevant code chunks within the specific repository.
3. **Context Assembly:** The retrieved source code chunks (including file paths) are combined into a system prompt.
4. **Generation:** The LLM processes your question alongside the retrieved code context to formulate a response.

This guarantees that the AI mentor's responses are grounded in your actual implementation, not just generic programming knowledge.

## Tech Stack

### Frontend
- Next.js 14+ (App Router), React 18
- Tailwind CSS (with custom Oklch color palettes and glassmorphism utilities)
- Base UI (headless accessible components)
- Lucide React (icons)
- React Query (data fetching and caching)

### Backend
- Java 21+, Spring Boot 3.2+
- Spring Security (OAuth2 Client)
- Spring AI (OpenAI integration & Vector Store)
- Flyway (Database migrations)

### Database & Infrastructure
- PostgreSQL 16+ with `pgvector` extension
- Docker Compose (local database provisioning)

## Project Structure

```text
gitDevPilot/
├── backend/            # Spring Boot backend application
│   ├── src/main/java/  # Java source code
│   └── src/main/resources/ # application.properties & Flyway migrations
├── client/             # Next.js frontend application
│   ├── app/            # App Router pages and layouts
│   └── components/     # React components and UI library
├── docker-compose.yml  # PostgreSQL + pgvector infrastructure
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites
- Java 21+ and Maven (or use the included `mvnw` wrapper)
- Node.js 18+ and npm
- Docker and Docker Compose (for the database)
- An OpenAI API Key
- A GitHub OAuth App (Client ID & Secret)

### Quickstart

**1. Start the Database**
```bash
docker-compose up -d
```
This spins up a PostgreSQL instance with the `pgvector` extension on port `5433`.

**2. Configure Environment Variables**
In the `backend` directory, create a `.env` file (or export these in your shell):
```env
OPENAI_API_KEY=your_openai_api_key
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```
*(Ensure your GitHub OAuth app has the callback URL set to `http://localhost:8080/login/oauth2/code/github`)*

**3. Run the Backend**
```bash
cd backend
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`.

**4. Run the Frontend**
```bash
cd client
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## Database Schema

- `users` — Stores developer profiles authenticated via GitHub.
- `repositories` — Tracks connected GitHub repositories, branch names, and their indexing status (e.g., `PENDING`, `INDEXING`, `READY`, `FAILED`).
- `chat_sessions` — Groups messages for a specific user and repository.
- `chat_messages` — A log of user prompts and AI responses within a session.
- `vector_store` — The Spring AI managed table storing document chunks, metadata (file paths), and vector embeddings.

## Limitations & Roadmap

- **Repository Size Limits:** Currently configured to handle small-to-medium sized repositories. Extremely large monorepos may hit GitHub API rate limits during the initial tree fetch.
- **Public Repositories:** Best suited for public repositories or private repositories where your OAuth App has explicit access.
- **Single-Tenant Infrastructure:** The current architecture is optimized for a self-hosted or localized environment rather than a massive multi-tenant SaaS.

**Planned Improvements:**
- Webhooks for automatic re-indexing when code is pushed to the default branch.
- Support for selecting alternative LLM providers (e.g., Anthropic Claude, local Ollama).
- Enhanced codebase summarization and automated architecture diagram generation.

## Contributing

This is a personal, private project created for showcase and portfolio purposes. **Contributions, pull requests, and issues are currently not being accepted.** Feel free to explore the code, but please note that this repository is maintained solely by the author as a demonstration of skills and architecture.
