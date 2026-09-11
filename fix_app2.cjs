const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I will just use regex to replace everything from `useEffect(() => {\n    if (!user || !db) return;` 
// to `  const handleLogin = async () => {`

const startStr = "  useEffect(() => {\n    if (!user || !db) return;";
const endStr = "  const handleLogin = async () => {";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const properBlock = `  useEffect(() => {
    if (!user || !db) return;

    const tasksRef = collection(db, 'tasks');
    const qTasks = query(tasksRef, where('userId', '==', user.uid));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
       const fetchedTasks = snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
       fetchedTasks.sort((a, b) => a.createdAt - b.createdAt);
       setTasks(fetchedTasks);
    }, (error) => {
       console.error("Erro Firebase (Tarefas):", error);
       alert("ERRO FIREBASE: O Banco de Dados recusou salvar/ler. Erro: " + error.message);
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
        setStats(docSnap.data() as UserStats);
      } else {
        setStats({ xp: 0, level: 1 });
      }
    });

    return () => {
      unsubTasks();
      unsubNotes();
      unsubHabits();
      unsubStats();
    };
  }, [user, db]);

  const addXP = async (amount: number) => {
    if (!user || !db) return;
    const statsRef = doc(db, 'stats', user.uid);
    let newXp = stats.xp + amount;
    let newLevel = Math.floor(newXp / 100) + 1;
    
    try {
      await updateDoc(statsRef, { xp: newXp, level: newLevel });
    } catch (e) {
      await setDoc(statsRef, { xp: newXp, level: newLevel });
    }
  };

  const handleTaskComplete = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    if (newStatus === 'done') {
      addXP(10);
    }
  };

  const addHabit = async (title: string) => {
    if (!user || !title.trim()) return;
    await addDoc(collection(db, 'habits'), {
      title,
      completedDates: [],
      createdAt: Date.now(),
      userId: user.uid
    });
  };

  const toggleHabit = async (habitId: string, dateStr: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const isCompleted = habit.completedDates.includes(dateStr);
    const newDates = isCompleted 
      ? habit.completedDates.filter(d => d !== dateStr)
      : [...habit.completedDates, dateStr];
      
    await updateDoc(doc(db, 'habits', habitId), {
      completedDates: newDates
    });
    
    if (!isCompleted) addXP(5);
  };

  const deleteHabit = async (id: string) => {
    await deleteDoc(doc(db, 'habits', id));
  };

`;

  content = content.substring(0, startIndex) + properBlock + content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', content);
}
