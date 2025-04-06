// ProductivityTools.tsx
import React, { useState, useEffect } from 'react';
import {
  ClockIcon,
  CalendarIcon,
  DocumentTextIcon,
  ListBulletIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface ProductivityTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ProductivityTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');
  const [notes, setNotes] = useState('');
  const [habits] = useState<string[]>(['Exercise', 'Read', 'Meditate']);
  const [completedHabits, setCompletedHabits] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask]);
      setNewTask('');
    }
  };

  const toggleHabit = (habit: string) => {
    setCompletedHabits((prev) => ({
      ...prev,
      [habit]: !prev[habit],
    }));
  };

  const tools: ProductivityTool[] = [
    {
      id: 'pomodoro',
      name: 'Pomodoro Timer',
      description: 'Stay focused with timed work sessions and breaks',
      icon: <ClockIcon className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 'calendar',
      name: 'Calendar',
      description: 'Schedule and manage your appointments',
      icon: <CalendarIcon className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'todo',
      name: 'To-Do List',
      description: 'Keep track of tasks and deadlines',
      icon: <ListBulletIcon className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'notes',
      name: 'Notes',
      description: 'Capture ideas and information quickly',
      icon: <DocumentTextIcon className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'habit',
      name: 'Habit Tracker',
      description: 'Build and maintain positive habits',
      icon: <ListBulletIcon className="w-6 h-6" />,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: 'analytics',
      name: 'Productivity Analytics',
      description: 'Visualize your productivity patterns',
      icon: <ChartBarIcon className="w-6 h-6" />,
      color: 'bg-indigo-100 text-indigo-600',
    },
  ];

  const handleToolClick = (id: string) => {
    setSelectedTool((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold text-white mb-6">Productivity Tools</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool.id} className={`p-6 rounded-lg shadow-md transition-all ${tool.color}`}>
            {/* Header */}
            <div
              className="flex items-center mb-3 cursor-pointer"
              onClick={() => handleToolClick(tool.id)}
            >
              {tool.icon}
              <h3 className="text-xl font-semibold ml-2">{tool.name}</h3>
            </div>
            <p>{tool.description}</p>

            {/* Expanded Tool */}
            {selectedTool === tool.id && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                {tool.id === 'pomodoro' && (
                  <>
                    <p className="text-lg font-bold">{formatTime(timeLeft)}</p>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => setIsRunning(true)}
                      >
                        Start
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-300 text-black rounded"
                        onClick={() => setIsRunning(false)}
                      >
                        Pause
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-200 text-black rounded"
                        onClick={() => {
                          setIsRunning(false);
                          setTimeLeft(1500);
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </>
                )}

                {tool.id === 'calendar' && (
                  <input type="date" className="mt-2 p-2 border rounded w-full" />
                )}

                {tool.id === 'todo' && (
                  <>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="p-2 border rounded w-full"
                        placeholder="New task"
                      />
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded"
                        onClick={addTask}
                      >
                        Add
                      </button>
                    </div>
                    <ul className="list-disc ml-6 mt-2">
                      {tasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </>
                )}

                {tool.id === 'notes' && (
                  <textarea
                    className="w-full mt-2 p-2 border rounded"
                    rows={5}
                    placeholder="Write your notes here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                )}

                {tool.id === 'habit' && (
                  <ul className="space-y-2 mt-2">
                    {habits.map((habit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!completedHabits[habit]}
                          onChange={() => toggleHabit(habit)}
                        />
                        <span>{habit}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {tool.id === 'analytics' && (
                  <div className="text-sm text-gray-700">
                    <p>Charts and stats coming soon...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductivityTools;
