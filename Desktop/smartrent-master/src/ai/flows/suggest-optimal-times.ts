
// This is an autogenerated file from Firebase Studio.
'use server';
/**
 * @fileOverview An AI agent that suggests optimal times for tasks based on user input, priorities, and daily rhythms.
 *
 * - suggestOptimalTimes - A function that suggests optimal times for tasks.
 * - SuggestOptimalTimesInput - The input type for the suggestOptimalTimes function.
 * - SuggestOptimalTimesOutput - The return type for the suggestOptimalTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSchema = z.object({
  name: z.string().describe('The name of the task.'),
  priority: z
    .enum(['high', 'medium', 'low'])
    .describe('The priority of the task (high, medium, or low).'),
  duration: z
    .string()
    .describe(
      'The estimated duration of the task, e.g., 30 minutes, 1 hour, 2 hours 30 minutes'
    ),
});

const DailyRhythmSchema = z.object({
  time: z.string().describe('The time of day (e.g., 9:00 AM).'),
  activity: z.string().describe('The typical activity at this time.'),
  energyLevel: z
    .enum(['high', 'medium', 'low'])
    .describe('The user provided energy level during the activity (high, medium, or low).'),
  impactful: z.boolean().describe('Whether or not the LLM should consider this when planning the day'),
});

const SuggestOptimalTimesInputSchema = z.object({
  tasks: z.array(TaskSchema).describe('The tasks to schedule.'),
  dailyRhythm: z.array(DailyRhythmSchema).describe('The users daily rhythm.'),
  timeBlockingPreference: z
    .string()
    .describe(
      'The users preference for time blocking. For example: prefer to have 2 hour blocks.'
    ),
});
export type SuggestOptimalTimesInput = z.infer<typeof SuggestOptimalTimesInputSchema>;

const SuggestedTimeSchema = z.object({
  taskName: z.string().describe('The name of the task.'),
  suggestedTime: z.string().describe('The suggested time for the task (e.g., 2:00 PM).'),
  reason: z.string().describe('The reason for suggesting this time.'),
});

const SuggestOptimalTimesOutputSchema = z.object({
  suggestedTimes: z.array(SuggestedTimeSchema).describe('The suggested times for each task.'),
  summary: z.string().describe('A summary of the schedule, including the total workload.'),
});
export type SuggestOptimalTimesOutput = z.infer<typeof SuggestOptimalTimesOutputSchema>;

export async function suggestOptimalTimes(input: SuggestOptimalTimesInput): Promise<SuggestOptimalTimesOutput> {
  return suggestOptimalTimesFlow(input);
}

const shouldConsiderDailyRhythm = ai.defineTool({
  name: 'shouldConsiderDailyRhythm',
  description: 'Decides whether a piece of information about the users daily rhythm should affect the output or not.',
  inputSchema: z.object({
    impactful: z.boolean().describe('Whether or not the piece of information should affect the output.'),
    reason: z.string().describe('The reason why it should or should not affect the output.')
  }),
  outputSchema: z.boolean()
}, async (input) => {
  return input.impactful;
});

const prompt = ai.definePrompt({
  name: 'suggestOptimalTimesPrompt',
  input: {schema: SuggestOptimalTimesInputSchema},
  output: {schema: SuggestOptimalTimesOutputSchema},
  tools: [shouldConsiderDailyRhythm],
  prompt: `You are an AI scheduling assistant that suggests optimal times for tasks based on user input.

Consider the following tasks:
{{#each tasks}}
- Task: {{name}}, Priority: {{priority}}, Duration: {{duration}}
{{/each}}

Take into account the following daily rhythm:
{{#each dailyRhythm}}
- Time: {{time}}, Activity: {{activity}}, Energy Level: {{energyLevel}}
{{/each}}

User Time Blocking Preference: {{{timeBlockingPreference}}}

Suggest optimal times for each task, providing a reason for each suggestion. The tool shouldConsiderDailyRhythm should be used when deciding if a daily rhythm should affect the planning. Return the output as a list of
"suggestedTimes" objects, and a summary of the schedule, including the total workload.

Here is the format of the objects in the suggestedTimes array.
{
  taskName: string, // Task Name
  suggestedTime: string, // Suggested time for the task, example '2:00 PM'
  reason: string // Short explanation of the suggested time
}

Here is the format of the output:
{
  suggestedTimes: [],
  summary: string // summary
}
`,
});

const suggestOptimalTimesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalTimesFlow',
    inputSchema: SuggestOptimalTimesInputSchema,
    outputSchema: SuggestOptimalTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

