
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

async function parse(path) {
    const { getDocument } = pdfjsLib;
    // Support node environment
    // pdfjsLib.GlobalWorkerOptions.workerSrc = '...'; // Not needed in node usually if using legacy or main?

    // In node, we might need to load it differently or use standard import
    // Let's try basic import first

    // Actually, in recent pdfjs-dist, we need to set worker?
    try {
        console.log('PDFJS imported');
        const loadingTask = getDocument(path);
        const doc = await loadingTask.promise;
        console.log('Doc loaded, pages:', doc.numPages);

        let fullText = '';
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const text = content.items.map(item => item.str).join(' ');
            fullText += text + '\n';
        }
        console.log('Text length:', fullText.length);
    } catch (e) {
        console.error('PDFJS Error:', e);
    }
}

const path = process.argv[2];
if (path) parse(path);
else console.log('Provide path');
