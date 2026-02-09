
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    console.log('pdfjsLib imported. Keys:', Object.keys(pdfjsLib));
    if (pdfjsLib.getDocument) {
        console.log('getDocument exists');
    }
} catch (e) {
    console.error('Import failed:', e);
}
