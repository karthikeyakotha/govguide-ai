
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
    const pdf = require('pdf-parse');
    console.log('pdf type:', typeof pdf);
    console.log('Is function?', typeof pdf === 'function');
    console.log('Keys:', Object.keys(pdf));
    if (pdf.default) {
        console.log('pdf.default type:', typeof pdf.default);
    }
} catch (e) {
    console.error('Import failed:', e);
}
