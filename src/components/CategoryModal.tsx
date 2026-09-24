import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, AlertCircle } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  color: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreateCategory: (name: string, color: string) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
}

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categories,
  onCreateCategory,
  onDeleteCategory,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onCreateCategory(name.trim(), selectedColor);
      setName('');
    } catch (err: any) {
      setError(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Manage Categories</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Add New Category
            </h3>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name (e.g. Backend, Design)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Color Label</label>
              <div className="flex items-center space-x-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      selectedColor === color ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Adding...' : 'Add Category'}</span>
            </button>
          </form>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Existing Categories ({categories.length})
            </h3>
            {categories.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No custom categories added yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-sm font-medium text-slate-200">{c.name}</span>
                    </div>
                    <button
                      onClick={() => onDeleteCategory(c.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
