
'use client';

import { useState, useEffect } from 'react';
import TaskForm from '@/components/planner/TaskForm';
import ScheduleView from '@/components/planner/ScheduleView';
import IntelligentScheduler from '@/components/planner/IntelligentScheduler';
import type { Task } from '@/types/planner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Brain, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const LOCAL_STORAGE_KEY = 'landlordPlannerTasks';

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isAISchedulerOpen, setIsAISchedulerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            reminder: task.reminder ? new Date(task.reminder) : undefined,
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Error parsing tasks from localStorage:", error);
        setTasks([]); // Reset to empty if parsing fails
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task: Task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    toast({ title: "Task Added", description: `"${task.name}" has been added to your planner.` });
    setIsTaskFormOpen(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast({ title: "Task Updated", description: `"${updatedTask.name}" has been updated.` });
    setEditingTask(undefined);
    setIsTaskFormOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const taskToDelete = tasks.find(t => t.id === taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      if (taskToDelete) {
        toast({ title: "Task Deleted", description: `"${taskToDelete.name}" has been removed.`, variant: "destructive" });
      }
    }
  };

  const openEditTaskForm = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const openNewTaskForm = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <CalendarDays className="mr-3 h-8 w-8 text-primary" />
          My Personal Planner
        </h1>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={openNewTaskForm} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Task
          </Button>
          <Dialog open={isAISchedulerOpen} onOpenChange={setIsAISchedulerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Brain className="mr-2 h-5 w-5 text-primary" /> AI Scheduler
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline flex items-center">
                   <Brain className="mr-2 h-7 w-7 text-primary" /> Intelligent Scheduler
                </DialogTitle>
                <DialogDescription>
                    Let AI help you find the optimal times for your tasks based on priority, duration, and your daily rhythms.
                </DialogDescription>
              </DialogHeader>
              <IntelligentScheduler onClose={() => setIsAISchedulerOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Dialog open={isTaskFormOpen} onOpenChange={(isOpen) => {
          setIsTaskFormOpen(isOpen);
          if (!isOpen) setEditingTask(undefined); // Clear editing task when dialog closes
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription>
              {editingTask ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSubmit={editingTask ? handleEditTask : handleAddTask}
            initialTask={editingTask}
            onClose={() => {
                setIsTaskFormOpen(false);
                setEditingTask(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-1"> {/* Simplified to one tab for now */}
          <TabsTrigger value="schedule">Task Schedule</TabsTrigger>
          {/* Add more tabs like "Calendar View", "Completed Tasks" if needed later */}
        </TabsList>
        <TabsContent value="schedule" className="mt-4">
           <ScheduleView tasks={tasks} onEditTask={openEditTaskForm} onDeleteTask={handleDeleteTask} />
        </TabsContent>
      </Tabs>


    </div>
  );
}
