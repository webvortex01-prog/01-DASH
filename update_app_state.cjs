const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "useState<'overview' | 'kanban' | 'notes' | 'focus'>('overview')",
  "useState<'overview' | 'kanban' | 'notes' | 'focus' | 'habits'>('overview')"
);

content = content.replace(
  "import { Task, Note, TaskStatus } from './types';",
  "import { Task, Note, TaskStatus, Habit, UserStats } from './types';"
);

content = content.replace(
  "const [notes, setNotes] = useState<Note[]>([]);",
  "const [notes, setNotes] = useState<Note[]>([]);\n  const [habits, setHabits] = useState<Habit[]>([]);\n  const [stats, setStats] = useState<UserStats>({ xp: 0, level: 1 });"
);

const newUseEffect = `
    const tasksRef = collection(db, 'tasks');
    const qTasks = query(tasksRef, where('userId', '==', user.uid));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
       const fetchedTasks = snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
       fetchedTasks.sort((a, b) => a.createdAt - b.createdAt);
       setTasks(fetchedTasks);
    });

    const notesRef = collection(db, 'notes');
    const qNotes = query(notesRef, where('userId', '==', user.uid));
    const unsubNotes = onSnapshot(qNotes, (snap) => {
       const fetchedNotes = snap.docs.map(d => ({ id: d.id, ...d.data() } as Note));
       fetchedNotes.sort((a, b) => b.createdAt - a.createdAt);
       setNotes(fetchedNotes);
    });

    const habitsRef = collection(db, 'habits');
    const qHabits = query(habitsRef, where('userId', '==', user.uid));
    const unsubHabits = onSnapshot(qHabits, (snap) => {
       const fetchedHabits = snap.docs.map(d => ({ id: d.id, ...d.data() } as Habit));
       fetchedHabits.sort((a, b) => a.createdAt - b.createdAt);
       setHabits(fetchedHabits);
    });

    const statsRef = doc(db, 'stats', user.uid);
    const unsubStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data());
      } else {
        // Initialize stats if not exist
        setStats({ xp: 0, level: 1 });
      }
    });

    return () => {
      unsubTasks();
      unsubNotes();
      unsubHabits();
      unsubStats();
    };`;

const oldUseEffect = `    const tasksRef = collection(db, 'tasks');
    const qTasks = query(tasksRef, where('userId', '==', user.uid));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
       const fetchedTasks = snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
       fetchedTasks.sort((a, b) => a.createdAt - b.createdAt);
       setTasks(fetchedTasks);
    });

    const notesRef = collection(db, 'notes');
    const qNotes = query(notesRef, where('userId', '==', user.uid));
    const unsubNotes = onSnapshot(qNotes, (snap) => {
       const fetchedNotes = snap.docs.map(d => ({ id: d.id, ...d.data() } as Note));
       fetchedNotes.sort((a, b) => b.createdAt - a.createdAt);
       setNotes(fetchedNotes);
    });

    return () => {
      unsubTasks();
      unsubNotes();
    };`;

content = content.replace(oldUseEffect, newUseEffect);

fs.writeFileSync('src/App.tsx', content);
