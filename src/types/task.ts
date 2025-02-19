export enum Priority {
  HIGH = 'alta',
  MEDIUM = 'media',
  LOW = 'baja'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
}
