export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  reminder: string;
  tags: string[];
  recurring?: 'daily' | 'weekly';
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completion: number;
  color: string;
}

export interface StudyEntry {
  id: string;
  subject: string;
  hours: number;
  date: string;
  notes: string;
}

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Finish design system review',
    category: 'Work',
    priority: 'High',
    dueDate: '2026-07-02',
    completed: false,
    reminder: '09:00',
    tags: ['design', 'review']
  },
  {
    id: '2',
    title: 'Practice DSA for 45 mins',
    category: 'Study',
    priority: 'Medium',
    dueDate: '2026-07-02',
    completed: true,
    reminder: '19:30',
    tags: ['dsa'],
    recurring: 'daily'
  },
  {
    id: '3',
    title: 'Meditation session',
    category: 'Wellness',
    priority: 'Low',
    dueDate: '2026-07-03',
    completed: false,
    reminder: '07:00',
    tags: ['mindfulness'],
    recurring: 'daily'
  }
];

export const habits: Habit[] = [
  { id: 'h1', name: 'Drink Water', streak: 12, completion: 86, color: 'from-cyan-500 to-blue-500' },
  { id: 'h2', name: 'Exercise', streak: 8, completion: 72, color: 'from-fuchsia-500 to-pink-500' },
  { id: 'h3', name: 'Coding Practice', streak: 15, completion: 90, color: 'from-emerald-500 to-green-500' }
];

export const studyEntries: StudyEntry[] = [
  { id: 's1', subject: 'Algorithms', hours: 2.5, date: '2026-07-01', notes: 'Greedy practice' },
  { id: 's2', subject: 'System Design', hours: 1.5, date: '2026-07-02', notes: 'Scalability notes' }
];
