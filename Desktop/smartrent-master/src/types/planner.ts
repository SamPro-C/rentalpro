
import type { SuggestOptimalTimesInput, SuggestOptimalTimesOutput } from '@/ai/flows/suggest-optimal-times';
import type { Task as AITask, DailyRhythm as AIDailyRhythm } from '@/ai/flows/suggest-optimal-times';


export interface Category {
  id: string;
  name: string;
  color: string; // hex color string e.g., "#FF0000"
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  categoryId: string;
  reminder?: Date; // Simplified reminder
  duration?: string; // For AI tasks, e.g. "30 minutes"
}

// Re-export AI types for easier access within planner context
export type AITaskInput = AITask; // Directly use the Zod inferred type from the flow
export type AIDailyRhythmInput = AIDailyRhythm; // Directly use the Zod inferred type
export type AISuggestOptimalTimesInput = SuggestOptimalTimesInput;
export type AISuggestOptimalTimesOutput = SuggestOptimalTimesOutput;
export type AISuggestedTime = SuggestOptimalTimesOutput['suggestedTimes'][number];
