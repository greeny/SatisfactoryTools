import * as fs from 'fs';
import * as path from 'path';
const sharp = require('sharp');

const dir = path.join('www', 'assets', 'images', 'items');

for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
	if (entry.isFile()) {
		sharp(path.join(dir, entry.name)).resize(256, 256).toFile(path.join(dir, entry.name.replace('.png', '_256.png')));
		sharp(path.join(dir, entry.name)).resize(64, 64).toFile(path.join(dir, entry.name.replace('.png', '_64.png')));
	}
}
