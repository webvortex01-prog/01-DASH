const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const hookToMove = `  useEffect(() => {
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
  }, [user]);`;

content = content.replace(hookToMove, "");

// Add it after the other useEffect
content = content.replace(
  "  const addXP = async (amount: number) => {",
  hookToMove + "\n\n  const addXP = async (amount: number) => {"
);

fs.writeFileSync('src/App.tsx', content);
