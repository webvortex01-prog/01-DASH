const fs = require('fs');
let content = fs.readFileSync('src/components/Overview.tsx', 'utf8');

// Replace new Date(t.createdAt) with new Date(t.createdAt || 0)
content = content.replace(
  "startOfDay(new Date(t.createdAt)).getTime() === d.getTime()",
  "startOfDay(new Date(t.createdAt || 0)).getTime() === d.getTime()"
);

fs.writeFileSync('src/components/Overview.tsx', content);
