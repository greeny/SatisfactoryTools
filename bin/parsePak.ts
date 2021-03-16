import * as fs from 'fs';
import * as path from 'path';

const extracted = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'extracted.json')).toString());

for (const item of extracted) {
	const name = item.export_record.file_name;
	console.log('');
	console.log(name.match(/Build_.*?\./)[0].replace('.', ''));
	for (const ex of item.exports) {
		for (const prop of ex.data.properties) {
			if (prop.property_type === 'FloatProperty\x00' || prop.name === 'BoxExtent\x00') {
				console.log(prop.name, prop.tag);
			}
		}
	}
}
