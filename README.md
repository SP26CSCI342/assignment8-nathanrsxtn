[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/jYpz8rDY)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=24044821&assignment_repo_type=AssignmentRepo)

Assignment 8  
Nathan Sexton

## Live URLs

- **Client:** https://platescout-ohf1.vercel.app
- **Server:** https://platescout-ohf1.onrender.com
- **Server health check:** https://platescout-ohf1.onrender.com/api/health

## Local setup

1. Clone the repo
2. Copy `server/.env.example` to `server/.env` and fill in `MONGO_URI` + `JWT_SECRET`
3. From the root: `npm install` (client) and `cd server && npm install` (server)
4. Two terminals: `npm run dev` (root, client) + `npm run dev` (server)
5. Open http://localhost:5173

## What I learned during deployment

During the deployment of this app, I was surprised by the amount of controls and features available in Vercel and Render.
There are a lot of options to manage and monitor the deployment that I am not yet taking advantage of.
The longest thing for me to debug during deployment was the API URLs.
I found it significantly more difficult to debug issues with a deployed website than when hosting locally.
Next time, I would allocate more time to learning all of the important features of the deployment tools I am using so that I can be more familiar and proficient with them.
