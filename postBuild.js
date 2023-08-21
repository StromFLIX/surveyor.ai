import { readFileSync, writeFileSync } from 'fs';
import { sync } from 'glob';

// Get all JavaScript files in the dist directory
const files = sync('dist/**/*.js');

files.forEach(file => {
    let content = readFileSync(file, 'utf-8');

    // Replace relative paths without extension to have .js
    content = content.replace(/from ['"](\.[^'"]*?)['"]/g, (match, p1) => {
        if (!p1.endsWith('.js') && !p1.endsWith('.json')) {
            return `from '${p1}.js'`;
        }
        return match;
    });
    

    writeFileSync(file, content);
});

console.log('Post-build script completed: .js extensions added.');
