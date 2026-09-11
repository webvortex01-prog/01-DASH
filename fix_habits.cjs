const fs = require('fs');
let content = fs.readFileSync('src/components/Habits.tsx', 'utf8');

content = content.replace(
  "habit.completedDates.includes(todayStr)",
  "(habit.completedDates || []).includes(todayStr)"
);
content = content.replace(
  "habit.completedDates.includes(checkStr)",
  "(habit.completedDates || []).includes(checkStr)"
);
content = content.replace(
  "habit.completedDates.filter(d => d !== dateStr)",
  "(habit.completedDates || []).filter(d => d !== dateStr)"
);
content = content.replace(
  "[...habit.completedDates, dateStr]",
  "[...(habit.completedDates || []), dateStr]"
);

fs.writeFileSync('src/components/Habits.tsx', content);

// And App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  "const isCompleted = habit.completedDates.includes(dateStr);",
  "const isCompleted = (habit.completedDates || []).includes(dateStr);"
);
appContent = appContent.replace(
  "habit.completedDates.filter(d => d !== dateStr)",
  "(habit.completedDates || []).filter(d => d !== dateStr)"
);
appContent = appContent.replace(
  "[...habit.completedDates, dateStr]",
  "[...(habit.completedDates || []), dateStr]"
);
fs.writeFileSync('src/App.tsx', appContent);
