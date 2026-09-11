const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add addXP function before render
const renderStart = "  return (";
const addXpFunc = `  const addXP = async (amount) => {
    if (!user || !db) return;
    const statsRef = doc(db, 'stats', user.uid);
    let newXp = stats.xp + amount;
    let newLevel = Math.floor(newXp / 100) + 1;
    
    // Save to Firestore
    try {
      await updateDoc(statsRef, { xp: newXp, level: newLevel });
    } catch (e) {
      // If doc doesn't exist, create it
      const { setDoc } = require('firebase/firestore');
      // We need to import setDoc at the top. We will handle it by just using setDoc directly in the file.
      // Wait, we don't have require in the browser. 
    }
  };

`;

content = content.replace("import { collection", "import { collection, setDoc");

const betterAddXP = `  const addXP = async (amount: number) => {
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

content = content.replace("  return (", betterAddXP + "\\n  return (");

// Add habits to the render
content = content.replace(
  "{activeTab === 'focus' && <Focus />}",
  "{activeTab === 'focus' && <Focus onComplete={() => addXP(20)} />}\n          {activeTab === 'habits' && <Habits habits={habits} onAddHabit={addHabit} onToggleHabit={toggleHabit} onDeleteHabit={deleteHabit} />}"
);

// Update Kanban to use handleTaskComplete
content = content.replace(
  "onUpdateStatus={updateTaskStatus}",
  "onUpdateStatus={handleTaskComplete}"
);

// Update Overview to pass stats
content = content.replace(
  "{activeTab === 'overview' && <Overview tasks={tasks} notes={notes} onNavigate={(t) => setActiveTab(t as any)} />}",
  "{activeTab === 'overview' && <Overview tasks={tasks} notes={notes} stats={stats} onNavigate={(t) => setActiveTab(t as any)} />}"
);

// Add Habits import
content = content.replace(
  "import { Focus } from './components/Focus';",
  "import { Focus } from './components/Focus';\nimport { Habits } from './components/Habits';"
);

// User level badge
content = content.replace(
  "<span className=\"text-[9px] lg:text-[10px] text-amber-500 font-bold truncate uppercase tracking-widest\">CEO Mode ON</span>",
  "<span className=\"text-[9px] lg:text-[10px] text-amber-500 font-bold truncate uppercase tracking-widest\">Nível {stats.level} • {stats.xp} XP</span>"
);

fs.writeFileSync('src/App.tsx', content);
