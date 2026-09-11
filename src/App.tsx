import React, { useState, useEffect } from 'react';
import { LayoutDashboard, KanbanSquare, Crosshair, Hexagon, Timer, LogIn, LogOut, Loader2, Menu, X, Target } from 'lucide-react';
import { Task, Note, TaskStatus } from './types';
import { Kanban } from './components/Kanban';
import { Notes } from './components/Notes';
import { Overview } from './components/Overview';
import { Focus } from './components/Focus';
import { PWAInstallButton } from './components/PWAInstallButton';

import { initFirebase } from './lib/firebase';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'kanban' | 'notes' | 'focus'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Firebase State
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [auth, setAuth] = useState<any>(null);
  const [db, setDb] = useState<any>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    initFirebase().then(({ auth: fbAuth, db: fbDb }) => {
      setAuth(fbAuth);
      setDb(fbDb);
      onAuthStateChanged(fbAuth, (u) => {
        setUser(u);
        setIsInitializing(false);
      });
    });
  }, []);

  useEffect(() => {
    if (!user || !db) return;

    const tasksRef = collection(db, 'tasks');
    const qTasks = query(tasksRef, where('userId', '==', user.uid));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
       const fetchedTasks = snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
       fetchedTasks.sort((a, b) => a.createdAt - b.createdAt);
       setTasks(fetchedTasks);
    }, (error) => {
       console.error("Erro Firebase (Tarefas):", error);
       alert("ERRO FIREBASE: O Banco de Dados recusou salvar/ler. Provavelmente as 'Rules' no Firebase Console estão bloqueando. Erro: " + error.message);
    });

    const notesRef = collection(db, 'notes');
    const qNotes = query(notesRef, where('userId', '==', user.uid));
    const unsubNotes = onSnapshot(qNotes, (snap) => {
       const fetchedNotes = snap.docs.map(d => ({ id: d.id, ...d.data() } as Note));
       fetchedNotes.sort((a, b) => b.createdAt - a.createdAt);
       setNotes(fetchedNotes);
    }, (error) => {
       console.error("Erro Firebase (Notas):", error);
    });

    return () => { unsubTasks(); unsubNotes(); };
  }, [user, db]);

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = () => { 
     if (auth) signOut(auth);
  };

  // Firebase Mutations
  const addTask = async (status: TaskStatus, title: string, description: string) => {
    if (!user || !db) return;
    try {
      await addDoc(collection(db, 'tasks'), { title, description, status, userId: user.uid, createdAt: Date.now() });
    } catch (e: any) {
      alert("ERRO AO SALVAR TAREFA (O Firebase bloqueou): " + e.message);
    }
  };
  
  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'tasks', id), { status });
    } catch (e: any) {
      alert("ERRO AO ATUALIZAR TAREFA: " + e.message);
    }
  };
  
  const deleteTask = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e: any) {
      alert("ERRO AO DELETAR TAREFA: " + e.message);
    }
  };

  const addNote = async (title: string, content: string) => {
    if (!user || !db) return;
    try {
      await addDoc(collection(db, 'notes'), { title, content, userId: user.uid, createdAt: Date.now() });
    } catch (e: any) {
      alert("ERRO AO SALVAR NOTA: " + e.message);
    }
  };
  
  const deleteNote = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (e: any) {
      alert("ERRO AO DELETAR NOTA: " + e.message);
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-amber-500">
        <Loader2 size={48} className="animate-spin" />
        <span className="font-black uppercase tracking-widest">Carregando Império...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-500/[0.05] to-transparent pointer-events-none" />
        
        <div className="bg-zinc-900/50 p-12 rounded-[3rem] border border-zinc-800/80 flex flex-col items-center gap-6 relative z-10 max-w-md w-full shadow-2xl backdrop-blur-sm">
          <div className="bg-amber-500 p-4 rounded-3xl shadow-[0_0_30px_rgba(251,191,36,0.3)] mb-4">
             <Hexagon className="text-zinc-950 fill-zinc-950" size={48} strokeWidth={2} />
          </div>
          <div className="text-center">
            <h1 className="font-black text-4xl tracking-tighter text-zinc-100 uppercase mb-2">Zika<span className="text-amber-500">Board</span></h1>
            <p className="text-zinc-400 font-medium">Acesso restrito à base operacional.</p>
          </div>
          
          <button 
            onClick={handleLogin}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] mt-4 active:scale-95"
          >
            <LogIn size={20} strokeWidth={3} />
            Acessar o Painel
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'QG Principal', icon: LayoutDashboard },
    { id: 'kanban', label: 'Trincheira (Kanban)', icon: KanbanSquare },
    { id: 'focus', label: 'Foco Total', icon: Timer },
    { id: 'notes', label: 'Arsenal (Ideias)', icon: Crosshair },
    { id: 'habits', label: 'Hábitos (Tracker)', icon: Target },
  ] as const;

  useEffect(() => {
    if (!user) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case 'q':
          setActiveTab('overview');
          break;
        case 'k':
          setActiveTab('kanban');
          break;
        case 'f':
          setActiveTab('focus');
          break;
        case 'a':
        case 'n':
          setActiveTab('notes');
          break;
        case 'h':
          setActiveTab('habits');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 overflow-hidden font-sans selection:bg-amber-500/30">
      
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800/80 z-30 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-1.5 rounded-lg">
             <Hexagon className="text-zinc-950 fill-zinc-950" size={20} strokeWidth={2.5} />
          </div>
          <h1 className="font-black text-xl tracking-tighter leading-none text-zinc-100 uppercase">Zika<span className="text-amber-500">Board</span></h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col shrink-0 fixed lg:relative z-50 h-full transition-transform duration-300 ease-in-out shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 lg:h-28 flex items-center px-6 lg:px-8 border-b border-zinc-800/80 shrink-0">
          <div className="bg-amber-500 p-2 lg:p-2.5 rounded-xl mr-3 lg:mr-4 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
             <Hexagon className="text-zinc-950 fill-zinc-950" size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-xl lg:text-2xl tracking-tighter leading-none text-zinc-100 uppercase">Zika<span className="text-amber-500">Board</span></h1>
            <span className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase mt-1">Agency OS</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden ml-auto p-2 text-zinc-500 hover:text-zinc-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 py-6 lg:py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Painel de Controle</p>
          </div>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 font-bold text-sm tracking-wide ${
                  isActive 
                    ? 'bg-amber-500 text-zinc-950 shadow-[0_0_20px_rgba(251,191,36,0.15)] lg:translate-x-1' 
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 lg:hover:translate-x-1'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-zinc-950' : 'text-zinc-600'} strokeWidth={isActive ? 2.5 : 2.5} />
                <span className="uppercase">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 lg:p-6 border-t border-zinc-800/80 bg-zinc-950 shrink-0">
          <PWAInstallButton />
          <div className="flex items-center gap-3 lg:gap-4 bg-zinc-900 p-3 lg:p-4 rounded-2xl border border-zinc-800">
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-black text-zinc-950 shadow-inner text-base lg:text-lg shrink-0">
                {user.displayName?.charAt(0) || 'CE'}
              </div>
            )}
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-xs lg:text-sm font-black text-zinc-100 truncate uppercase">{user.displayName || 'Império'}</span>
              <span className="text-[9px] lg:text-[10px] text-amber-500 font-bold truncate uppercase tracking-widest">CEO Mode ON</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
              title="Sair da Base"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Work Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#09090b] pt-16 lg:pt-0">
        {/* Gritty background texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-amber-500/[0.03] to-transparent pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative z-10 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {activeTab === 'overview' && <Overview tasks={tasks} notes={notes} onNavigate={(t) => setActiveTab(t as any)} />}
          {activeTab === 'kanban' && <Kanban tasks={tasks} onAddTask={addTask} onDeleteTask={deleteTask} onUpdateStatus={updateTaskStatus} />}
          {activeTab === 'notes' && <Notes notes={notes} onAddNote={addNote} onDeleteNote={deleteNote} />}
          {activeTab === 'focus' && <Focus />}
        </div>
      </main>
    </div>
  );
}
