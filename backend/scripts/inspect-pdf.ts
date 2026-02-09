
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const pdf = require('pdf-parse');
    console.log('Keys:', Object.keys(pdf));
    for (const key of Object.keys(pdf)) {
        console.log(`Key: ${key}, Type: ${typeof pdf[key]}`);
    }
} catch (e) {
    console.error(e);
}
