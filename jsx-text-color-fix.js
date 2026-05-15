const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { regex: /color:\s*['"]var\(--primary-color\)['"]/g, replace: "color: '#000000'" },
  { regex: /color:\s*['"]var\(--secondary-color\)['"]/g, replace: "color: '#000000'" },
  { regex: /color:\s*`var\(--primary-color\)`/g, replace: "color: '#000000'" },
  { regex: /color:\s*`var\(--secondary-color\)`/g, replace: "color: '#000000'" }
];

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    replacements.forEach(r => {
      content = content.replace(r.regex, r.replace);
    });
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated inline style text color in ${filePath}`);
    }
  }
});
