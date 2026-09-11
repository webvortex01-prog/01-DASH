const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Fix addXP
const oldAddXp = `  const addXP = async (amount: number) => {
    if (!user || !db) return;
    const statsRef = doc(db, 'stats', user.uid);
    let newXp = stats.xp + amount;
    let newLevel = Math.floor(newXp / 100) + 1;
    
    try {
      await updateDoc(statsRef, { xp: newXp, level: newLevel });
    } catch (e) {
      await setDoc(statsRef, { xp: newXp, level: newLevel });
    }
  };`;

const newAddXp = `  const addXP = async (amount: number) => {
    if (!user || !db) return;
    const statsRef = doc(db, 'stats', user.uid);
    let newXp = Math.max(0, stats.xp + amount); // Prevent negative XP
    let newLevel = Math.floor(newXp / 100) + 1;
    
    try {
      await updateDoc(statsRef, { xp: newXp, level: newLevel });
    } catch (e) {
      await setDoc(statsRef, { xp: newXp, level: newLevel });
    }
  };`;

content = content.replace(oldAddXp, newAddXp);

// Fix handleTaskComplete
const oldHandleTask = `  const handleTaskComplete = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    if (newStatus === 'done') {
      addXP(10);
    }
  };`;

const newHandleTask = `  const handleTaskComplete = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const oldStatus = task.status;
    updateTaskStatus(taskId, newStatus);
    
    // Add XP if marked as done, remove XP if unmarked from done
    if (oldStatus !== 'done' && newStatus === 'done') {
      addXP(10);
    } else if (oldStatus === 'done' && newStatus !== 'done') {
      addXP(-10);
    }
  };`;

content = content.replace(oldHandleTask, newHandleTask);

// Fix toggleHabit
const oldToggleHabit = `    if (!isCompleted) addXP(5);
  };`;

const newToggleHabit = `    if (!isCompleted) {
      addXP(5);
    } else {
      addXP(-5);
    }
  };`;

content = content.replace(oldToggleHabit, newToggleHabit);

fs.writeFileSync('src/App.tsx', content);
