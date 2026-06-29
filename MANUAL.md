# Book Favorites App Manual

This manual explains how to install, start, and use the Book Favorites App.

## What the application does

Book Favorites is a small full-stack application for tracking favorite books. It lets you:

- create an account
- log in with an existing account
- browse the available book list
- add books to your favorites
- review your saved favorites
- log out and return to the welcome page

The `/books` and `/favorites` pages are protected. If you are not logged in, the app sends you back to the home page.

## Prerequisites

Before you start, make sure you have:

- Node.js 20 or later
- npm

## Installation

From the repository root:

```bash
npm install
cd frontend
npm install
cd ..
```

## Starting the application

Open two terminals in the repository root.

### Terminal 1: start the backend

```bash
npm run start:backend
```

The backend API listens on `http://localhost:4000`.

### Terminal 2: start the frontend

```bash
npm run start:frontend
```

The frontend runs on `http://localhost:5173`.

When both servers are running, open `http://localhost:5173` in your browser.

## Using the application

### Option 1: log in with the seeded account

The repository includes a default user:

- username: `sandra`
- password: `sandra`

From the welcome page:

1. Select **Login**
2. Enter the username and password
3. Submit the form

After login, the header shows your username plus links to **Books** and **Favorites**.

### Option 2: create a new account

From the welcome page:

1. Select **Create Account**
2. Enter a username and password
3. Select **Register**

After successful registration, the app shows a confirmation message and automatically redirects you to the login page after about two seconds.

## Common workflows

### Browse books

1. Log in
2. Open **Books**
3. Review the available titles

### Add a favorite

1. Open **Books**
2. Select **Add to Favorites** on a book
3. Open **Favorites** to confirm it was saved

If a book is already in your favorites, the button changes to **In Favorites** and the book card shows a heart icon.

### Review favorites

1. Open **Favorites**
2. Read your saved list

If you have not added any favorites yet, the page shows an empty state with a link back to the book list.

### Log out

1. Select **Logout** in the header
2. The app returns you to the home page

If you try to open a protected page after logout, the app redirects you back to `/`.

## Useful commands

Run these commands from the repository root:

```bash
npm run start:backend
npm run start:frontend
npm run build:frontend
npm run test:backend
npm run test:frontend
npm run test
```

## Troubleshooting

### The frontend cannot reach the backend

- make sure `npm run start:backend` is still running
- confirm the backend is using `http://localhost:4000`
- confirm the frontend is using `http://localhost:5173`

### Login does not work

- verify the username and password are correct
- if you just registered, wait for the success message and redirect before logging in

### Protected pages send you back to the home page

This happens when you are not logged in or your session token is missing. Log in again and reopen the page.

## Related documentation

- [README.md](./README.md) for the project overview and setup summary
- [frontend/README.md](./frontend/README.md) for the default Vite frontend notes
- [demos/README.md](./demos/README.md) and [hands-on/README.md](./hands-on/README.md) for the training material included in this repository
