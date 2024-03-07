# Install

Install dependencies: `npm install`

Update git hooks: `npx simple-git-hooks`

build shared folder: `npm run build -w shared`

## Start development

In `frontend` and `backend` workspace create a `.env` then run `npm run dev` in each directory.

## Start production

Build: `npm run build`

Create `.env` inside `build` directory using `.env.example` from `backend` workspace, then run `npm start`.
