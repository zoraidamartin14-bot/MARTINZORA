import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, Tag, AlertCircle } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  color: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    title: string;
    description: string;
    priority: string;
    categoryId?: number | null;
    dueDate?: string | null;
  }) => Promise<void>;
  categories: Category[];
  initialTask?: any;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [categoryId, setCategoryId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'medium');
      setCategoryId(initialTask.categoryId ? String(initialTask.categoryId) : '');
      setDueDate(initialTask.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategoryId('');
      setDueDate('');
    }
    setError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        dueDate: dueDate || null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Implement PostgreSQL user auth"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details or context..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              {submitting ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
