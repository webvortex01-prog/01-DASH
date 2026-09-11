const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("orderBy } from 'firebase/firestore';", "orderBy, runTransaction } from 'firebase/firestore';");

const oldAddXP = `  const addXP = async (amount: number) => {
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

const newAddXP = `  const addXP = async (amount: number) => {
    if (!user || !db) return;
    const statsRef = doc(db, 'stats', user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(statsRef);
        if (!sfDoc.exists()) {
          const newXp = Math.max(0, amount);
          const newLevel = Math.floor(newXp / 100) + 1;
          transaction.set(statsRef, { xp: newXp, level: newLevel });
        } else {
          const currentXp = sfDoc.data().xp || 0;
          const newXp = Math.max(0, currentXp + amount);
          const newLevel = Math.floor(newXp / 100) + 1;
          transaction.update(statsRef, { xp: newXp, level: newLevel });
        }
      });
    } catch (e) {
      console.error("Erro na transação de XP: ", e);
    }
  };`;

content = content.replace(oldAddXP, newAddXP);

fs.writeFileSync('src/App.tsx', content);
