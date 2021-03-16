import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import {IJsonSchema} from '@src/Schema/IJsonSchema';

const baseOriginalPath = path.join(__dirname, '..', 'data', 'icons', 'out256');
const baseTargetPath = path.join(__dirname, '..', 'www', 'assets', 'images', 'items');
const mappingPath = path.join(__dirname, '..', 'data', 'imageMapping.json');
const dataPath = path.join(__dirname, '..', 'data', 'data.json');

function processImage(file: string, slug: string) {
	file = path.join(path.join(__dirname, '..'), file);
	if (!fs.existsSync(file)) {
		file = file.replace('_512', '_256');
	}
	if (!fs.existsSync(file)) {
		console.error('Invalid mapping for ' + slug + ', file not found: ' + file);
	} else {
		fs.copyFileSync(file, path.join(baseTargetPath, slug + '_256.png'));
		sharp(file).resize(64, 64).toFile(path.join(baseTargetPath, slug + '_64.png')).then();
	}
}

if (!fs.existsSync(mappingPath)) {
	console.error('Mapping file does not exist, please run "yarn parseDocs" first.');
} else if (!fs.existsSync(dataPath)) {
	console.error('Data file does not exist, please run "yarn parseDocs" first.');
} else {
	const mapping: {[key: string]: string} = JSON.parse(fs.readFileSync(mappingPath).toString());
	const data: IJsonSchema = JSON.parse(fs.readFileSync(dataPath).toString());

	for (const itemClass in data.items) {
		if (itemClass in mapping) {
			processImage(mapping[itemClass], data.items[itemClass].slug);
		}
	}
	for (const buildingClass in data.buildings) {
		if (buildingClass in mapping) {
			processImage(mapping[buildingClass], data.buildings[buildingClass].slug);
		}
	}
}
