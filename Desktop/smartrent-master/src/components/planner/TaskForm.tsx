
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle, ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Task } from '@/types/planner';
import { PREDEFINED_CATEGORIES, TASK_PRIORITIES } from '@/config/planner';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';

const taskFormSchema = z.object({
  name: z.string().min(1, 'Task name is required.'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  categoryId: z.string().min(1, 'Category is required.'),
  reminderEnabled: z.boolean().default(false),
  reminderDate: z.date().optional(),
  duration: z.string().optional(), 
}).refine(data => {
    if (data.reminderEnabled && !data.reminderDate) {
        return false; // Invalid if reminder is enabled but no date is set
    }
    return true;
}, {
    message: "Reminder date is required when reminders are enabled.",
    path: ["reminderDate"], // Field to highlight for the error
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  initialTask?: Task; 
  onClose?: () => void;
}

export default function TaskForm({ onSubmit, initialTask, onClose }: TaskFormProps) {
  const [selectedCategoryColor, setSelectedCategoryColor] = useState<string | undefined>(
    initialTask ? PREDEFINED_CATEGORIES.find(c => c.id === initialTask.categoryId)?.color : 
                  PREDEFINED_CATEGORIES[0]?.color // Default to first category color if new task
  );

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialTask
      ? {
          ...initialTask,
          reminderEnabled: !!initialTask.reminder,
          reminderDate: initialTask.reminder,
        }
      : {
          name: '',
          description: '',
          priority: 'medium',
          categoryId: PREDEFINED_CATEGORIES[0]?.id || '',
          reminderEnabled: false,
          duration: '',
        },
  });

  const reminderEnabled = form.watch('reminderEnabled');

  function handleFormSubmit(data: TaskFormValues) {
    const submittedTask: Task = {
      id: initialTask?.id || crypto.randomUUID(), // Use existing ID or generate new
      ...data,
      reminder: data.reminderEnabled ? data.reminderDate : undefined,
    };
    onSubmit(submittedTask);
    if (!initialTask) form.reset(); // Reset only if it's a new task form
    onClose?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter task name" {...field} aria-required="true" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} aria-required="true">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TASK_PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority} className="capitalize">
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <div className="flex items-center gap-2">
                {selectedCategoryColor && (
                   <span className="inline-block w-5 h-5 rounded-full border" style={{ backgroundColor: selectedCategoryColor }} aria-hidden="true" />
                )}
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedCategoryColor(PREDEFINED_CATEGORIES.find(c => c.id === value)?.color);
                  }} 
                  defaultValue={field.value} 
                  aria-required="true"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PREDEFINED_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <span className="w-3 h-3 rounded-full mr-2 border" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1"><ClockIcon className="h-4 w-4 text-muted-foreground" />Duration (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1 hour 30 minutes, 45m" {...field} />
              </FormControl>
              <FormDescription>Useful for time blocking and AI scheduling.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="reminderEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-labelledby="reminder-label"
                  />
                </FormControl>
                <div className="space-y-0.5 leading-none">
                  <FormLabel id="reminder-label" className="cursor-pointer">
                    Set Reminder
                  </FormLabel>
                  <FormDescription>
                    Get a notification before the task is due (feature depends on system notifications).
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

        {reminderEnabled && (
          <FormField
            control={form.control}
            name="reminderDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Reminder Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP p') 
                        ) : (
                          <span>Pick a date and time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      // TODO: Add time picker capability to Calendar component or use a separate time input
                    />
                    <Input type="time" className="mt-2" 
                      defaultValue={field.value ? format(field.value, 'HH:mm') : ''}
                      onChange={(e) => {
                        const time = e.target.value;
                        const [hours, minutes] = time.split(':').map(Number);
                        const newDate = field.value ? new Date(field.value) : new Date();
                        newDate.setHours(hours, minutes);
                        field.onChange(newDate);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Select the date and time for the reminder.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-3 pt-4">
          {onClose && <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>}
          <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> {initialTask ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
