import * as fs from 'fs';
import * as path from 'path';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import parseItemDescriptors from '@bin/parseDocs/itemDescriptor';
import parseRecipes from '@bin/parseDocs/recipe';
import parseResourceDescriptors from '@bin/parseDocs/resourceDescriptor';
import parseBuildings from '@bin/parseDocs/building';
import parseResourceExtractors from '@bin/parseDocs/resourceExtractor';
import parseGenerators from '@bin/parseDocs/generator';
import parseBuildingDescriptors from '@bin/parseDocs/buildingDescriptor';
import parseSchematics from '@bin/parseDocs/schematic';

const docs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'Docs.json')).toString());

const json: IJsonSchema = {
	recipes: {},
	items: {},
	schematics: {},
	generators: {},
	resources: {},
	miners: {},
	buildings: {},
};

let biomass: IItemSchema[] = [];
let extraInfo: any[] = [];
const mapping: {[key: string]: string} = {};

function mapNameType(className: string, type: string): string {
	return className;
	/*const match = className.match(/\w+_(.*)_C/);
	if (!match) {
		throw new Error('Invliad className: ' + className);
	}
	const key = Strings.webalize(type + ' ' + match[1]);
	if (className in mapping && mapping[className] !== key) {
		throw new Error('Duplicated className: ' + className);
	}
	return mapping[className] = key;*/
}

for (const definitions of docs) {
	switch (definitions.NativeClass) {
		case 'Class\'/Script/FactoryGame.FGItemDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGEquipmentDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGConsumableDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGItemDescriptorNuclearFuel\'':
			for (const item of parseItemDescriptors(definitions.Classes)) {
				json.items[mapNameType(item.className, 'item')] = item;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGRecipe\'':
			for (const recipe of parseRecipes(definitions.Classes)) {
				json.recipes[mapNameType(recipe.className, 'recipe')] = recipe;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGResourceDescriptor\'':
			for (const item of parseItemDescriptors(definitions.Classes)) {
				json.items[mapNameType(item.className, 'item')] = item;
			}
			for (const resource of parseResourceDescriptors(definitions.Classes)) {
				json.resources[mapNameType(resource.item, 'item')] = resource;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGItemDescriptorBiomass\'':
			biomass = parseItemDescriptors(definitions.Classes);
			for (const item of biomass) {
				json.items[mapNameType(item.className, 'item')] = item;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGVehicleDescriptor\'':
			for (const building of parseBuildings(definitions.Classes)) {
				json.buildings[mapNameType(building.className, 'building')] = building;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildablePole\'':
		case 'Class\'/Script/FactoryGame.FGBuildableConveyorBelt\'':
		case 'Class\'/Script/FactoryGame.FGBuildableWire\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePowerPole\'':
		case 'Class\'/Script/FactoryGame.FGBuildableTradingPost\'':
		case 'Class\'/Script/FactoryGame.FGBuildableSpaceElevator\'':
		case 'Class\'/Script/FactoryGame.FGBuildableManufacturer\'':
		case 'Class\'/Script/FactoryGame.FGBuildableStorage\'':
		case 'Class\'/Script/FactoryGame.FGBuildable\'':
		case 'Class\'/Script/FactoryGame.FGBuildableWall\'':
		case 'Class\'/Script/FactoryGame.FGBuildableStair\'':
		case 'Class\'/Script/FactoryGame.FGBuildableConveyorLift\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePipelineSupport\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePipeline\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePipelineJunction\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePipelinePump\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePipeReservoir\'':
		case 'Class\'/Script/FactoryGame.FGBuildableTrainPlatformCargo\'':
		case 'Class\'/Script/FactoryGame.FGBuildableRailroadStation\'':
		case 'Class\'/Script/FactoryGame.FGBuildableRailroadTrack\'':
		case 'Class\'/Script/FactoryGame.FGBuildableFoundation\'':
		case 'Class\'/Script/FactoryGame.FGBuildableFactory\'':
		case 'Class\'/Script/FactoryGame.FGBuildableAttachmentMerger\'':
		case 'Class\'/Script/FactoryGame.FGBuildableAttachmentSplitter\'':
		case 'Class\'/Script/FactoryGame.FGBuildableResourceSink\'':
		case 'Class\'/Script/FactoryGame.FGBuildableResourceSinkShop\'':
		case 'Class\'/Script/FactoryGame.FGConveyorPoleStackable\'':
		case 'Class\'/Script/FactoryGame.FGBuildableDockingStation\'':
		case 'Class\'/Script/FactoryGame.FGPipeHyperStart\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePipeHyper\'':
		case 'Class\'/Script/FactoryGame.FGBuildableTrainPlatformEmpty\'':
		case 'Class\'/Script/FactoryGame.FGBuildableSplitterSmart\'':
		case 'Class\'/Script/FactoryGame.FGBuildableWalkway\'':
			for (const building of parseBuildings(definitions.Classes, true)) {
				json.buildings[mapNameType(building.className, 'building')] = building;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildableResourceExtractor\'':
			for (const miner of parseResourceExtractors(definitions.Classes)) {
				json.miners[mapNameType(miner.className, 'building')] = miner;
			}
			for (const building of parseBuildings(definitions.Classes, true)) {
				json.buildings[mapNameType(building.className, 'building')] = building;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorFuel\'':
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorNuclear\'':
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorGeoThermal\'':
			for (const building of parseBuildings(definitions.Classes, true)) {
				json.buildings[mapNameType(building.className, 'building')] = building;
			}
			for (const generator of parseGenerators(definitions.Classes)) {
				json.generators[mapNameType(generator.className, 'building')] = generator;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildingDescriptor\'':
			extraInfo = parseBuildingDescriptors(definitions.Classes);
			break;
		case 'Class\'/Script/FactoryGame.FGSchematic\'':
			for (const schematic of parseSchematics(definitions.Classes)) {
				json.schematics[mapNameType(schematic.className, 'schematic')] = schematic;
			}
			break;
	}
}

// add missing radar tower
json.buildings['Desc_RadarTower_C'] = {
	className: 'Desc_RadarTower_C',
	categories: [],
	buildMenuPriority: 0,
	description: 'Reveals an area around itself on the map. The area grows over time to a max. Placing the tower higher up increases the max area revealed.',
	slug: 'radarTower',
	metadata: {},
	name: 'Radar Tower',
};

// add extra info to buildings
for (const info of extraInfo) {
	for (const key in json.buildings) {
		if (info.className === json.buildings[key].className) {
			json.buildings[key].buildMenuPriority = info.priority;
			json.buildings[key].categories = info.categories;
			break;
		}
	}
}

// add biomass stuff to biomass burner
for (const key in json.generators) {
	const index = json.generators[key].fuel.indexOf('FGItemDescriptorBiomass');
	if (index !== -1) {
		json.generators[key].fuel.splice(index, 1);
		json.generators[key].fuel.push(...biomass.map((bio) => {
			return bio.className;
		}));
	}
}

// convert liquid requirements to m3
for (const key in json.recipes) {
	const recipe = json.recipes[key];

	for (const ingredient of recipe.ingredients) {
		if (!json.items[ingredient.item]) {
			throw new Error('Invalid item ' + ingredient.item);
		}
		if (json.items[ingredient.item].liquid) {
			ingredient.amount /= 1000;
		}
	}
	for (const product of recipe.products) {
		if (!json.items[product.item]) {
			continue;
		}
		if (json.items[product.item].liquid) {
			product.amount /= 1000;
		}
	}
}


/*function findItem(className: string) {
	if (className.match(/PowerPoleWall/) || className === 'Desc_RadarTower_C') {
		return true;
	}

	for (const item of json.items) {
		if (item.className === className) {
			return true;
		}
	}
	for (const item of json.buildings) {
		if (item.className === className) {
			return true;
		}
	}
	return false;
}*/

fs.writeFileSync(path.join(__dirname, '..', 'data', 'data.json'), JSON.stringify(json, null, '\t'));

/*for (const recipe of json.recipes) {
	for (const ingredient of recipe.ingredients) {
		if (!findItem(ingredient.item)) {
			throw new Error('Unknown item ' + ingredient.item);
		}
	}
	for (const product of recipe.products) {
		if (!findItem(product.item)) {
			throw new Error('Unknown item ' + product.item);
		}
	}
}*/
