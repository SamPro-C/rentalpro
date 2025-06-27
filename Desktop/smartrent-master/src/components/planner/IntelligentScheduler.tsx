
'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { suggestOptimalTimes } from '@/ai/flows/suggest-optimal-times';
import type { AISuggestOptimalTimesInput, AISuggestOptimalTimesOutput, AITaskInput, AIDailyRhythmInput } from '@/types/planner';
import { TASK_PRIORITIES, ENERGY_LEVELS } from '@/config/planner';
import { AlertCircle, Bot, Brain, CalendarCheck, Lightbulb, Loader2, PlusCircle, Trash2, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const aiTaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  priority: z.enum(['high', 'medium', 'low']),
  duration: z.string().min(1, 'Duration is required (e.g., 30 minutes, 1 hr)'),
});

const aiDailyRhythmSchema = z.object({
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)\s*(AM|PM)?$/i, "Invalid time format. Use HH:MM AM/PM or 24-hour.").min(1, 'Time is required (e.g., 9:00 AM)'),
  activity: z.string().min(1, 'Activity is required'),
  energyLevel: z.enum(['high', 'medium', 'low']),
  impactful: z.boolean().default(true),
});

const intelligentSchedulerSchema = z.object({
  tasks: z.array(aiTaskSchema).min(1, 'At least one task is required.'),
  dailyRhythm: z.array(aiDailyRhythmSchema).min(1, 'At least one daily rhythm entry is required.'),
  timeBlockingPreference: z.string().min(1, 'Time blocking preference is required.'),
});

type IntelligentSchedulerFormValues = z.infer<typeof intelligentSchedulerSchema>;

interface IntelligentSchedulerProps {
  onClose?: () => void;
}

export default function IntelligentScheduler({ onClose }: IntelligentSchedulerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestOptimalTimesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<IntelligentSchedulerFormValues>({
    resolver: zodResolver(intelligentSchedulerSchema),
    defaultValues: {
      tasks: [{ name: '', priority: 'medium', duration: '1 hour' }],
      dailyRhythm: [
        { time: '09:00 AM', activity: 'Peak Focus Work', energyLevel: 'high', impactful: true },
        { time: '02:00 PM', activity: 'Meetings/Calls', energyLevel: 'medium', impactful: true },
        { time: '04:00 PM', activity: 'Admin/Emails', energyLevel: 'low', impactful: true },
    ],
      timeBlockingPreference: 'Prefer 1-2 hour focused work blocks. Schedule shorter tasks around these blocks. Avoid scheduling high-energy tasks during low-energy periods.',
    },
  });

  const { fields: taskFields, append: appendTask, remove: removeTask } = useFieldArray({
    control: form.control,
    name: 'tasks',
  });

  const { fields: rhythmFields, append: appendRhythm, remove: removeRhythm } = useFieldArray({
    control: form.control,
    name: 'dailyRhythm',
  });

  async function onSubmit(data: IntelligentSchedulerFormValues) {
    setIsLoading(true);
    setAiSuggestions(null);
    try {
      // Cast to the exact input type expected by the AI flow
      const aiInput: AISuggestOptimalTimesInput = {
        tasks: data.tasks.map(task => ({
            name: task.name,
            priority: task.priority,
            duration: task.duration,
        })),
        dailyRhythm: data.dailyRhythm.map(rhythm => ({
            time: rhythm.time,
            activity: rhythm.activity,
            energyLevel: rhythm.energyLevel,
            impactful: rhythm.impactful,
        })),
        timeBlockingPreference: data.timeBlockingPreference,
      };
      const result = await suggestOptimalTimes(aiInput);
      setAiSuggestions(result);
      toast({
        title: "Suggestions Ready!",
        description: "AI has generated optimal time suggestions for your tasks.",
        variant: "default",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Error Generating Suggestions",
        description: `Failed to get AI suggestions. ${errorMessage}. Please check your input or try again later.`,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-h-[calc(80vh-var(--dialog-header-height,0px))] overflow-y-auto p-1 pt-4">
      {/* Removed Card, CardHeader and CardContent that were wrapping the Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Tasks Section */}
          <section className="space-y-4 p-4 border rounded-lg shadow-sm bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground">Tasks to Schedule</h3>
            {taskFields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded-md space-y-3 relative bg-background/80">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Write report" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.priority`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TASK_PRIORITIES.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`tasks.${index}.duration`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., 1 hour, 45m" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {taskFields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(index)} className="absolute top-1 right-1 text-destructive hover:bg-destructive/10 p-1 h-auto w-auto">
                    <Trash2 className="h-4 w-4" /> <span className="sr-only">Remove task</span>
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendTask({ name: '', priority: 'medium', duration: '30 minutes' })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </section>

          <Separator />

          {/* Daily Rhythm Section */}
          <section className="space-y-4 p-4 border rounded-lg shadow-sm bg-muted/30">
            <h3 className="text-lg font-semibold text-foreground">Your Daily Rhythm</h3>
            {rhythmFields.map((field, index) => (
              <div key={field.id} className="p-3 border rounded-md space-y-3 relative bg-background/80">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   <FormField
                    control={form.control}
                    name={`dailyRhythm.${index}.time`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., 9:00 AM or 14:30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`dailyRhythm.${index}.activity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Deep work, Lunch" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`dailyRhythm.${index}.energyLevel`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Energy Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select energy level" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ENERGY_LEVELS.map(e => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name={`dailyRhythm.${index}.impactful`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 pt-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} id={`impactful-${index}`} />
                        </FormControl>
                        <FormLabel htmlFor={`impactful-${index}`} className="text-sm font-normal cursor-pointer">
                          AI should consider this entry for scheduling
                        </FormLabel>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                {rhythmFields.length > 1 && (
                   <Button type="button" variant="ghost" size="icon" onClick={() => removeRhythm(index)} className="absolute top-1 right-1 text-destructive hover:bg-destructive/10 p-1 h-auto w-auto">
                    <Trash2 className="h-4 w-4" /> <span className="sr-only">Remove rhythm</span>
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendRhythm({ time: '', activity: '', energyLevel: 'medium', impactful: true })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Daily Rhythm
            </Button>
          </section>

          <Separator />

          {/* Time Blocking Preference Section */}
          <section className="p-4 border rounded-lg shadow-sm bg-muted/30">
            <FormField
              control={form.control}
              name="timeBlockingPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground">Time Blocking Preference</FormLabel>
                  <FormControl>
                    <Textarea placeholder="E.g., Prefer 2 hour blocks for focused work, shorter blocks for admin tasks." {...field} rows={3} />
                  </FormControl>
                  <FormDescription>How do you like to structure your work sessions? Give the AI guidance.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
          
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            {onClose && <Button type="button" variant="outline" onClick={onClose}>Cancel & Close</Button>}
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Suggestions...</>
              ) : (
                <><Lightbulb className="mr-2 h-5 w-5" /> Get AI Suggestions</>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* AI Suggestions Display */}
      {aiSuggestions && (
        <Card className="shadow-lg mt-6 animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center">
              <CalendarCheck className="mr-2 h-6 w-6 text-primary" />
              AI Generated Schedule
            </CardTitle>
            <CardDescription>
              Here are the optimal times suggested by AI for your tasks. Review and adjust as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                <h4 className="font-semibold text-primary mb-1 flex items-center"><Bot className="mr-2 h-5 w-5"/>AI Summary:</h4>
                <p className="text-sm text-foreground">{aiSuggestions.summary}</p>
            </div>
            
            <h4 className="text-lg font-semibold text-foreground pt-2">Suggested Times:</h4>
            {aiSuggestions.suggestedTimes.length > 0 ? (
              <ul className="space-y-3">
                {aiSuggestions.suggestedTimes.map((suggestion, index) => (
                  <li key={index} className="p-4 border rounded-md bg-background shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-semibold text-lg text-foreground">{suggestion.taskName}: <span className="font-bold text-accent">{suggestion.suggestedTime}</span></p>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.reason}</p>
                  </li>
                ))}
              </ul>
            ) : (
                 <div className="text-center py-6 border rounded-md bg-amber-50 border-amber-200">
                    <XCircle className="mx-auto h-12 w-12 text-amber-500 mb-3" />
                    <p className="font-medium text-amber-700">AI couldn't generate specific time slots.</p>
                    <p className="text-sm text-amber-600 mt-1">This might be due to conflicting constraints or insufficient information. Try adjusting your inputs or being more flexible with your preferences.</p>
                 </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setAiSuggestions(null)}>
                Clear Suggestions
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
