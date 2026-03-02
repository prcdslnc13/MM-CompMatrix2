# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MM-CompMatrix2 — MM Compatibility Matrix.

## Repository Status

Vite + React SPA with public (read-only) and admin (password-protected) views for CNC machine compatibility data. See ARCHITECTURE.md for full details.

## Tech Stack

- Vite 6 + React 18
- Static JSON data (`public/data/machines.json`) + localStorage for admin edits
- Inline styles (no CSS framework)
- Deployed via Vercel (production) or Docker/nginx (local)

## Commands (no host Node.js required)

All build and dev workflows run inside Docker containers. No local Node.js installation needed.

### Dev Server

```bash
./docker-dev.sh                           # http://localhost:5173 (password: changeme)
ADMIN_PASSWORD=secret ./docker-dev.sh     # custom password
```

### Production Build + Export

```bash
./docker-build.sh              # build image only
./docker-build.sh --export     # build + save mm-compmatrix.tar
```

### Run Production Image

```bash
docker run -d -p 8080:80 -e ADMIN_PASSWORD=mysecret mm-compmatrix:latest
```

### npm Commands (requires host Node.js — optional)

```bash
npm run dev       # local dev server
npm run build     # production build to dist/
npm run preview   # preview production build
```

## Docker Image Mapping

| Image Name | Tar File | Source |
|---|---|---|
| `mm-compmatrix` | `mm-compmatrix.tar` | This repo (root Dockerfile) |

## Agent Instructions
1. First think through the problem, read the codebase for the relevant files or resources.
2. Before you make any major changes check in with me and I will verify the plan.
3. Give a high level explanation of the changes you make every step of the way.
4. Make every task and code change as simple as possible. Avoid making massive or complex changes. Every change should impact as little code as possible. Maintain simplicity everywhere possible.
5. Maintain a documentation file that describes how the architecture of the app works inside and out.
6. Never speculate about code or files you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering or making changes to the codebase. Never make any claims about the code before investigating unless you are certain of the correct answer. Give grounded and hallucination-free answers.
7. Create and add/update an html docs site in the parent project that matches the planning and requirements we are building here for a more visually friendly and navigatable reflection of the overview, planning/project plan, requirements, architecture, services, schema and frontend.  So if you are updating the markdown files you should also be updating the html if applicable.
8. Whenever work is done on a service that has a Dockerfile, a Docker tar package should always be built as part of the deliverable. All images are built for the linux/amd64 platform since the deployment target is Synology. Every build must be dual-tagged with both the semantic version from package.json (e.g., 1.2.3) and latest, with both tags pointing to the same image. The tar export must contain both tags so that the recipient can load either one. Image names should use a short, readable name rather than the full repo directory name — for example, lb-db-proxy instead of db-webservice-proxy-psql. The tar file name should match the image name (e.g., lb-db-proxy.tar). Each sub-repo's CLAUDE.md or the parent CLAUDE.md should document the image name mapping so there's no ambiguity about what an image is called.