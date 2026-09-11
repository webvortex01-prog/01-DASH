const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "fetchedTasks.sort((a, b) => a.createdAt - b.createdAt);",
  "fetchedTasks.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));"
);
content = content.replace(
  "fetchedNotes.sort((a, b) => b.createdAt - a.createdAt);",
  "fetchedNotes.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));"
);
content = content.replace(
  "fetchedHabits.sort((a, b) => a.createdAt - b.createdAt);",
  "fetchedHabits.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));"
);

fs.writeFileSync('src/App.tsx', content);
