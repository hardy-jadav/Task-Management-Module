# Task Manager Dashboard

A simple task management application built with Next.js, leveraging in-memory storage for data persistence during the session.

## Features

- **Authentication**: Sign Up, Sign In (JWT-based, stored in HTTP-only cookies).
- **Projects**: Create and list projects.
- **Tasks**: Create, Update, Delete tasks within projects.
- **Kanban Board**: Visualize tasks by status (TODO, IN_PROGRESS, DONE).
- **Responsive UI**: Built with Material UI and Tailwind CSS.
- **State Management**: Zustand for global state.

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material UI (MUI)
- **State Management**: Zustand
- **Auth**: `jose` (JWT)

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000).

4.  **Usage**:
    - Sign Up with a name, email, and password.
    - Login with your credentials.
    - Create a project.
    - Add tasks to the project.

## Folder Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Shared utilities (Database simulation).
- `src/store`: Zustand store.
- `src/theme.ts`: MUI Theme configuration.

## Notes

- **Data Persistence**: Data is stored **in-memory** (`src/lib/db.ts`). Restarting the server will wipe all data.
- **Security**: Passwords are stored in plain text for demonstration purposes as requested.
