const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("Target } from 'lucide-react';", "Target, RotateCcw } from 'lucide-react';");
content = content.replace("<Target size={16} />", "<RotateCcw size={16} />");

fs.writeFileSync('src/App.tsx', content);
