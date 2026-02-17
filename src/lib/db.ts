import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  projectId: string;
  userId: string;
  createdAt: string;
}

class InMemDatabase {
  users: User[] = [];
  projects: Project[] = [];
  tasks: Task[] = [];

  constructor() {
    console.log('Initializing In-Memory Database');
  }
}

const globalForDb = global as unknown as { db: InMemDatabase };

export const db = globalForDb.db || new InMemDatabase();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
