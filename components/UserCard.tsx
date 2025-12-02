import React from 'react';
import { User } from '../types';
import { User as UserIcon, Trash2, Sparkles } from 'lucide-react';

interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onDelete(user.id)}
          className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 border border-indigo-50">
            <UserIcon size={24} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-indigo-600 mb-0.5">
            {user.role || 'Membre'}
          </p>
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {user.firstName} {user.lastName}
          </h3>
          {user.bio && (
            <div className="mt-2 flex items-start space-x-2 text-sm text-slate-500 leading-relaxed">
              <Sparkles size={14} className="mt-1 flex-shrink-0 text-amber-400" />
              <p>{user.bio}</p>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">
            Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};
