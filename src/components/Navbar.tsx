import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Database, LogIn, LogOut, CheckSquare, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">TaskFlow Pro</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database className="w-3 h-3 mr-1" />
                Cloud SQL
              </span>
            </div>
            <p className="text-xs text-slate-400">PostgreSQL + Drizzle ORM Powered</p>
          </div>
        </div>

        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-slate-800/80 rounded-full py-1.5 px-3 border border-slate-700">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-200 hidden sm:inline">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-600/20 space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
