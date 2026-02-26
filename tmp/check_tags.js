import fs from 'fs';

const content = fs.readFileSync('c:/Users/anshr/Desktop/MedicloudHost/components/footer.jsx', 'utf8');

let divStack = 0;
let braceStack = 0;

const lines = content.split('\n');
lines.forEach((line, i) => {
    const divs = (line.match(/<div/g) || []).length;
    const closeDivs = (line.match(/<\/div/g) || []).length;
    divStack += divs - closeDivs;

    const braces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    braceStack += braces - closeBraces;

    if (divStack < 0 || braceStack < 0) {
        console.log(`Mismatch at line ${i + 1}: divStack=${divStack}, braceStack=${braceStack}`);
    }
});

console.log(`Final stacks: divStack=${divStack}, braceStack=${braceStack}`);
