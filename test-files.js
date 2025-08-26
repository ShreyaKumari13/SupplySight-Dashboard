const fs = require('fs');
const path = require('path');

console.log('Current working directory:', process.cwd());
console.log('Directory contents of src:');

const srcPath = path.join(process.cwd(), 'src');
const files = fs.readdirSync(srcPath);
files.forEach(file => {
  const fullPath = path.join(srcPath, file);
  const stats = fs.statSync(fullPath);
  console.log(`${file} - ${stats.isDirectory() ? 'DIR' : 'FILE'}`);
});

console.log('\nChecking specific files:');
console.log('App.tsx exists:', fs.existsSync(path.join(srcPath, 'App.tsx')));
console.log('reportWebVitals.ts exists:', fs.existsSync(path.join(srcPath, 'reportWebVitals.ts')));