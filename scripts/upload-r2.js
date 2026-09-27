import { readdir } from 'fs/promises';
import { join } from 'path';
import { execSync } from 'child_process';

const folder = process.argv[2] || './public/assets';
const prefix = process.argv[3] || '';

async function upload() {
  try {
    const files = await readdir(folder);
    for (const file of files) {
      const filePath = join(folder, file);
      const key = prefix ? `${prefix}/${file}` : file;
      console.log(`Uploading ${filePath} -> ${key}`);
      execSync(
        `wrangler r2 object put moda-femenina-assets/${key} --file="${filePath}"`,
        { stdio: 'inherit' }
      );
    }
    console.log('Upload finished');
  } catch (e) {
    console.error('Upload failed:', e);
    process.exit(1);
  }
}

upload();
