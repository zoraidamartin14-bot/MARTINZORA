import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    urgent: number;
    high: number;
  };
}

export const StatsCards: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
          <ListTodo className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
          <p className="text-xs font-medium text-slate-400">Total Tasks</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
          <p className="text-xs font-medium text-slate-400">In Progress</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
          <p className="text-xs font-medium text-slate-400">Completed</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
        <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.urgent}</p>
          <p className="text-xs font-medium text-slate-400">Urgent Priority</p>
        </div>
      </div>
    </div>
  );
};
