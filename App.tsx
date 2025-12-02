import React, { useState, useCallback, useEffect } from 'react';
import { Plus, Users, Sparkles, Wand2 } from 'lucide-react';
import { User } from './types';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { UserCard } from './components/UserCard';
import { generateUserProfile } from './services/geminiService';
import { db } from './services/db';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Load users from "Database" on mount
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true);
      const loadedUsers = await db.getAll();
      setUsers(loadedUsers);
      setIsLoadingUsers(false);
    };
    loadUsers();
  }, []);
  
  // Form submission handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      createdAt: Date.now(),
    };

    try {
      // Save to database
      await db.add(newUser);

      // Update UI locally to feel instant (optimistic update), or reload
      setUsers(prev => [newUser, ...prev]);
      
      // Reset form
      setFirstName('');
      setLastName('');
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    }
  }, [firstName, lastName]);

  // Handler for adding user WITH AI enhancement
  const handleAddWithAI = useCallback(async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    
    setIsGenerating(true);
    try {
      // Fetch AI profile
      const profile = await generateUserProfile(firstName, lastName);
      
      const newUser: User = {
        id: crypto.randomUUID(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: profile.bio,
        role: profile.role,
        createdAt: Date.now(),
      };

      // Save to database
      await db.add(newUser);

      // Update UI
      setUsers(prev => [newUser, ...prev]);
      setFirstName('');
      setLastName('');
    } catch (error) {
      console.error("Failed to generate user", error);
    } finally {
      setIsGenerating(false);
    }
  }, [firstName, lastName]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      // Remove from database
      await db.remove(id);
      // Update UI
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  }, []);

  const handleClearAll = useCallback(async () => {
    if (confirm('Êtes-vous sûr de vouloir tout effacer ?')) {
      try {
        await db.clear();
        setUsers([]);
      } catch (error) {
        console.error("Failed to clear", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-2xl rotate-3 flex items-center justify-center shadow-lg mb-4">
            <Users className="h-8 w-8 text-white -rotate-3" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
            Registre Nominal
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Gérez vos inscriptions simplement. Utilisez l'IA Gemini pour générer des rôles et biographies créatifs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-500" />
                Nouvelle Entrée
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="firstName"
                  label="Prénom"
                  placeholder="Ex: Jean"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                
                <Input
                  id="lastName"
                  label="Nom"
                  placeholder="Ex: Dupont"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />

                <div className="pt-2 space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full justify-center"
                    disabled={!firstName || !lastName || isGenerating}
                  >
                    Enregistrer
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-400 font-medium">Ou avec IA</span>
                    </div>
                  </div>

                  <Button 
                    type="button" 
                    variant="secondary"
                    className="w-full justify-center group border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700"
                    onClick={handleAddWithAI}
                    isLoading={isGenerating}
                    disabled={!firstName || !lastName || isGenerating}
                    icon={<Wand2 className="w-4 h-4 group-hover:text-indigo-600" />}
                  >
                    Générer Profil Magique
                  </Button>
                  <p className="text-xs text-center text-slate-400 mt-2">
                    *Powered by Gemini 2.5 Flash
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Inscrits ({users.length})
              </h2>
              {users.length > 0 && (
                <button 
                  onClick={handleClearAll}
                  className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline"
                >
                  Tout effacer
                </button>
              )}
            </div>

            {isLoadingUsers ? (
              <div className="flex justify-center p-12">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="mx-auto h-12 w-12 text-slate-300 mb-4">
                  <Users className="h-full w-full" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Aucun inscrit</h3>
                <p className="text-slate-500 mt-1">Commencez par ajouter un nom et prénom via le formulaire.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;