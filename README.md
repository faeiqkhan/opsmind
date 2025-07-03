# OpsMind Backend

This is the backend for the OpsMind project, built with Node.js and Express.

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your environment variables in `.env`.
3. Start the server:
   ```sh
   npm start
   ```

## Project Structure

See `src/` for the main codebase. Follows a modular, domain-driven design. 

# OpsMind

A backend intelligence toolkit for dev teams. Includes:

- 🛠️ Real-time Audit Logging
- ☁️ File Uploads & Quota Limits
- 🧠 AI-Powered Meeting Summarizer
- 🧩 Sprint Planner via User Story Parsing

## Stack
- Node.js
- Redis + BullMQ
- PostgreSQL
- MinIO
- OpenAI APIs
- Docker + Compose

## Folder Structure
See `/src/modules` for feature logic and `/src/jobs` for background workers.

## Modules
- `auth`: JWT login, roles, and user auth
- `audit`: Middleware-based event logging via queues
- `fileops`: File uploads, MinIO integration, access control
- `ai-meeting`: Audio upload → AI transcription + summarization
- `planner`: AI sprint planner via user story input

## Status
- [x] Folder setup
- [x] Audit logger flow
- [x] Redis queue integration
- [ ] FileOps base logic
- [ ] AI modules
