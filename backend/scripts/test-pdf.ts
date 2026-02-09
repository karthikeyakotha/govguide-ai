
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

try {
    const pdfModule = require('pdf-parse');
    console.log('Module keys:', Object.keys(pdfModule));

    const func = pdfModule.default;
    console.log('Default export type:', typeof func);

    if (typeof func === 'function') {
        const dummyBuffer = Buffer.from('hello world');
        func(dummyBuffer).then((res: any) => {
            console.log('Call success, text:', res.text);
        }).catch((e: any) => {
            console.error('Call error:', e);
        });
    } else {
        console.log('Default is not function. Is module function?', typeof pdfModule);
    }

} catch (e) {
    console.error('Require error:', e);
}
