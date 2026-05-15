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
  { regex: /rgba\(15,\s*16,\s*21,/g, replace: 'rgba(255, 255, 255,' },
  { regex: /rgba\(26,\s*27,\s*35,/g, replace: 'rgba(250, 250, 250,' },
  { regex: /#0f1015/gi, replace: '#fdfdfd' },
  { regex: /#1a1b23/gi, replace: '#ffffff' },
  { regex: /#2a2a35/gi, replace: '#f1f5f9' },
  { regex: /#2d2e3b/gi, replace: '#e2e8f0' },
  { regex: /rgba\(0,\s*0,\s*0,\s*0\.8\)/g, replace: 'rgba(255, 255, 255, 0.8)' },
  { regex: /rgba\(0,\s*0,\s*0,\s*0\.7\)/g, replace: 'rgba(255, 255, 255, 0.7)' },
  { regex: /rgba\(255,\s*255,\s*255,\s*0\.02\)/g, replace: 'rgba(0, 0, 0, 0.02)' },
  { regex: /rgba\(255,\s*255,\s*255,\s*0\.01\)/g, replace: 'rgba(0, 0, 0, 0.01)' }
];

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.css') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    replacements.forEach(r => {
      content = content.replace(r.regex, r.replace);
    });
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
