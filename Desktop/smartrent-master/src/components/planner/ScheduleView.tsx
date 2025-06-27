
'use client';

import type { Task } from '@/types/planner';
import { PREDEFINED_CATEGORIES } from '@/config/planner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryChip from './CategoryChip';
import { Button } from '@/components/ui/button';
import { format, isPast, isToday } from 'date-fns';
import { CalendarIcon, Edit3, Trash2, BellRing, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete?: (taskId: string) => void; // Optional: For marking tasks complete
  showCompleted?: boolean; // Optional: To filter completed tasks if status is added
}

export default function ScheduleView({ tasks, onEditTask, onDeleteTask, onToggleComplete, showCompleted = true }: ScheduleViewProps) {
  const sortedTasks = tasks
    .sort((a,b) => (a.dueDate?.getTime() || Infinity) - (b.dueDate?.getTime() || Infinity))
    .sort((a,b) => { // High priority tasks first
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center py-10">
        <img src="https://placehold.co/300x200.png" alt="Empty schedule illustration showing a blank calendar" data-ai-hint="empty calendar illustration" className="mx-auto mb-4 rounded-lg shadow-sm" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Your schedule is looking clear!</h3>
        <p className="text-muted-foreground">Add some tasks to get started with your planning.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => {
        const category = PREDEFINED_CATEGORIES.find(c => c.id === task.categoryId);
        const isOverdue = task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate);
        
        return (
          <Card key={task.id} className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", isOverdue && "border-red-500 bg-red-50/50")}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-xl font-headline">{task.name}</CardTitle>
                {category && <CategoryChip category={category} className="flex-shrink-0"/>}
              </div>
              {task.description && <CardDescription className="pt-1 text-sm">{task.description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {task.dueDate && (
                <div className={cn("flex items-center", isOverdue ? "text-red-600 font-semibold" : "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Due: {format(task.dueDate, 'PPP')} {isOverdue && <span className="ml-2 text-xs">(Overdue)</span>}</span>
                </div>
              )}
              <div className="flex items-center">
                 <span className={cn(`capitalize px-2 py-0.5 text-xs rounded-full font-medium border`,
                    task.priority === 'high' ? 'bg-red-100 text-red-700 border-red-300' : 
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 
                    'bg-green-100 text-green-700 border-green-300'
                  )}>
                    Priority: {task.priority}
                  </span>
              </div>
              {task.duration && (
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Duration: {task.duration}</span>
                </div>
              )}
              {task.reminder && (
                <div className="flex items-center text-amber-600">
                  <BellRing className="mr-2 h-4 w-4" />
                  <span>Reminder: {format(task.reminder, 'PPP p')}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 border-t pt-3 pb-3">
              <Button variant="outline" size="sm" onClick={() => onEditTask(task)} aria-label={`Edit task ${task.name}`}>
                <Edit3 className="mr-1 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteTask(task.id)} aria-label={`Delete task ${task.name}`}>
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
