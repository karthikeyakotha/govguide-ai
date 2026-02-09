
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
console.log('textsplitters ok');
console.log('pdf-parse ok');
import * as dotenv from 'dotenv';
console.log('dotenv ok');
import { OpenAI } from 'openai';
console.log('openai ok');
import { createClient } from '@supabase/supabase-js';
console.log('supabase ok');
import fs from 'fs';
console.log('fs ok');
console.log('Imports passed');

dotenv.config();

import * as pdfLib from 'pdf-parse';
console.log('pdfLib type:', typeof pdfLib);
console.log('pdfLib keys:', Object.keys(pdfLib));

const pathStr = process.argv[2];
console.log('Path:', pathStr);

/*
if (pathStr) {
    try {
        const buffer = fs.readFileSync(pathStr);
        console.log('File read, size:', buffer.length);

        pdf(buffer).then(data => {
            console.log('PDF parsed, text length:', data.text.length);
        }).catch(e => {
            console.error('PDF parse error:', e);
        });
    } catch (e) {
        console.error('ERROR:', e);
    }
} else {
    console.log('No path provided, skipping logic check');
}
*/
