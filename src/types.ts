export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: number;
  userId: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  userId: string;
}

export interface Habit {
  id: string;
  title: string;
  completedDates: string[]; // Array of YYYY-MM-DD
  createdAt: number;
  userId: string;
}

export interface UserStats {
  xp: number;
  level: number;
}
