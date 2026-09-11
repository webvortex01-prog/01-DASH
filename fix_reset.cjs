const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add resetXP function
const resetXpFunc = `
  const resetXP = async () => {
    if (!user || !db) return;
    if (confirm('Tem certeza que quer zerar seu XP e voltar pro Nível 1?')) {
      const statsRef = doc(db, 'stats', user.uid);
      try {
        await updateDoc(statsRef, { xp: 0, level: 1 });
      } catch (e) {
        await setDoc(statsRef, { xp: 0, level: 1 });
      }
    }
  };
`;

content = content.replace("  const addXP =", resetXpFunc + "\n  const addXP =");

// Add button to sidebar
const oldSidebarButtons = `<button 
              onClick={handleLogout}`;
const newSidebarButtons = `<button 
              onClick={resetXP}
              className="p-2 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors shrink-0"
              title="Zerar XP"
            >
              <Target size={16} />
            </button>
            <button 
              onClick={handleLogout}`;

content = content.replace(oldSidebarButtons, newSidebarButtons);

fs.writeFileSync('src/App.tsx', content);
