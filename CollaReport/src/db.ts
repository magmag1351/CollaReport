import Dexie, { type EntityTable } from 'dexie';

export interface Task {
  id: number;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'High' | 'Medium' | 'Low';
  deadline: Date | null;
  created_at: Date;
}

const db = new Dexie('CollaReportDB') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
};

db.version(2).stores({
  tasks: '++id, title, status, priority, deadline, created_at'
});

export { db };
