const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(__dirname, 'posts');

console.log('Posts directory:', postsDirectory);
console.log('Directory exists:', fs.existsSync(postsDirectory));

if (fs.existsSync(postsDirectory)) {
  const files = fs.readdirSync(postsDirectory);
  console.log('Files found:', files.length);
  
  const mdFiles = files.filter(name => name.endsWith('.md'));
  console.log('Markdown files:', mdFiles.length);
  
  if (mdFiles.length > 0) {
    const firstFile = mdFiles[0];
    console.log('Testing first file:', firstFile);
    
    const filePath = path.join(postsDirectory, firstFile);
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log('Content length:', content.length);
    console.log('First 200 chars:', content.substring(0, 200));
    
    // Extract title
    const lines = content.split('\n');
    let title = firstFile.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.substring(2).trim();
        break;
      }
    }
    
    console.log('Extracted title:', title);
    
    // Test the slug creation
    const slug = firstFile.replace('.md', '');
    console.log('Slug:', slug);
  }
}