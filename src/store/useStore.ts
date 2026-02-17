import { create } from 'zustand';
import { Project, Task, User } from '@/lib/db'; // Types only

interface AppState {
  user: User | null;
  projects: Project[];
  tasks: Task[];
  projectsLoading: boolean;
  tasksLoading: boolean;

  // API Call Actions (CRUD Operation)
  fetchProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (projectId: string, title: string, description?: string, status?: Task['status']) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  projects: [],
  tasks: [],
  projectsLoading: false,
  tasksLoading: false,

  setUser: (user) => set({ user }),

  // For Get Project
  fetchProjects: async () => {
    set({ projectsLoading: true });
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const projects = await res.json();
        set({ projects });
      }
    } finally {
      set({ projectsLoading: false });
    }
  },

  // FOr Project get Operations...
  createProject: async (name, description) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    if (res.ok) {
      const newProject = await res.json();
      set((state) => ({ projects: [...state.projects, newProject] }));
    }
  },

  // FOr If Existing Task get Operations...
  fetchTasks: async (projectId) => {
    set({ tasksLoading: true });
    try {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);
      if (res.ok) {
        const tasks = await res.json();
        set({ tasks });
      }
    } finally {
      set({ tasksLoading: false });
    }
  },

  // FOr Task Creation Operations...
  createTask: async (projectId, title, description, status) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, title, description, status }),
    });
    if (res.ok) {
      const newTask = await res.json();
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    }
  },

  // FOr Task update Operations..
  updateTask: async (task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));

    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
  },

  // FOr Task Delete Operations..
  deleteTask: async (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));

    await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
  },
}));
