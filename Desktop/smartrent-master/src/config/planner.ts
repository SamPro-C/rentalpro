
import type { Category, Task } from '@/types/planner';
import type { AIDailyRhythmInput } from '@/types/planner';


export const PREDEFINED_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#89B3E5' }, // Primary color
  { id: 'personal', name: 'Personal', color: '#63CCAF' }, // A calm green
  { id: 'appointments', name: 'Appointments', color: '#F7B95C' }, // A warm orange
  { id: 'leisure', name: 'Leisure', color: '#B39DDB' }, // A soft purple
  { id: 'urgent', name: 'Urgent', color: '#FF6B6B' }, // A clear red
];

export const TASK_PRIORITIES: Array<Task['priority']> = ['high', 'medium', 'low'];
export const ENERGY_LEVELS: Array<AIDailyRhythmInput['energyLevel']> = ['high', 'medium', 'low'];
