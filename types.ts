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
