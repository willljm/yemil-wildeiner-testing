'use client'

import { useEffect, useState } from 'react'
import { Task, Priority } from '@/types/task'
import { 
  CalendarIcon, 
  FlagIcon, 
  PlusCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM)
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState<Priority | 'all'>('all')
  const [isFormVisible, setIsFormVisible] = useState(false)

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    checkDueDates()
  }, [tasks])

  const checkDueDates = () => {
    tasks.forEach(task => {
      if (!task.completed) {
        const timeUntilDue = new Date(task.dueDate).getTime() - new Date().getTime()
        if (timeUntilDue > 0 && timeUntilDue <= 24 * 60 * 60 * 1000) {
          new Notification('¡Tarea por vencer!', {
            body: `La tarea "${task.title}" vence pronto.`
          })
        }
      }
    })
  }

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      dueDate,
      completed: false
    }
    setTasks([...tasks, newTask])
    setTitle('')
    setDescription('')
    setPriority(Priority.MEDIUM)
    setDueDate('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? {...task, completed: !task.completed} : task
    ))
  }

  const getPriorityIcon = (priority: Priority) => {
    switch(priority) {
      case Priority.HIGH:
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
      case Priority.MEDIUM:
        return <FlagIcon className="w-5 h-5 text-yellow-500" />
      case Priority.LOW:
        return <ClockIcon className="w-5 h-5 text-green-500" />
    }
  }

  const filteredTasks = tasks.filter(task => 
    filter === 'all' ? true : task.priority === filter
  )

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="glass-effect rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Organizador de Tareas
              </h1>
              <p className="text-gray-600 mt-2">Organiza tus tareas por prioridad</p>
            </div>
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Nueva Tarea
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl transition-all ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              Todas
            </button>
            {Object.values(Priority).map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
                  filter === p 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                {getPriorityIcon(p)}
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        {isFormVisible && (
          <div className="fade-in">
            <form onSubmit={addTask} className="glass-effect p-8 rounded-2xl shadow-lg mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Título</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Descripción</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
                  >
                    <option value={Priority.HIGH}>Alta</option>
                    <option value={Priority.MEDIUM}>Media</option>
                    <option value={Priority.LOW}>Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Fecha límite</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map(task => (
              <div
                key={task.id}
                className={`task-card glass-effect p-6 rounded-2xl ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(task.priority)}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`transition-colors ${
                        task.completed 
                          ? 'text-gray-400 hover:text-gray-600' 
                          : 'text-blue-500 hover:text-blue-600'
                      }`}
                    >
                      {task.completed ? 
                        <XCircleIcon className="w-6 h-6" /> : 
                        <CheckCircleIcon className="w-6 h-6" />
                      }
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 p-2 rounded-lg">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(task.dueDate).toLocaleString()}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  )
}
