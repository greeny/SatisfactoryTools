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

const docs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'Docs.json')).toString());

const json: IJsonSchema = {
	recipes: [],
	items: [],
	generators: [],
	resources: [],
	miners: [],
	buildings: [],
};

let biomass: IItemSchema[] = [];
let extraInfo: any[] = [];

for (const item of docs) {
	switch (item.NativeClass) {
		case 'Class\'/Script/FactoryGame.FGItemDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGEquipmentDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGConsumableDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGItemDescriptorNuclearFuel\'':
			json.items.push(...parseItemDescriptors(item.Classes));
			break;
		case 'Class\'/Script/FactoryGame.FGRecipe\'':
			json.recipes.push(...parseRecipes(item.Classes));
			break;
		case 'Class\'/Script/FactoryGame.FGResourceDescriptor\'':
			json.items.push(...parseItemDescriptors(item.Classes));
			json.resources.push(...parseResourceDescriptors(item.Classes));
			break;
		case 'Class\'/Script/FactoryGame.FGItemDescriptorBiomass\'':
			biomass = parseItemDescriptors(item.Classes);
			json.items.push(...biomass);
			break;
		case 'Class\'/Script/FactoryGame.FGVehicleDescriptor\'':
			json.buildings.push(...parseBuildings(item.Classes));
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
			json.buildings.push(...parseBuildings(item.Classes, true));
			break;
		case 'Class\'/Script/FactoryGame.FGBuildableResourceExtractor\'':
			json.miners.push(...parseResourceExtractors(item.Classes));
			json.buildings.push(...parseBuildings(item.Classes, true));
			break;
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorFuel\'':
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorNuclear\'':
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorGeoThermal\'':
			json.buildings.push(...parseBuildings(item.Classes, true));
			json.generators.push(...parseGenerators(item.Classes));
			break;
		case 'Class\'/Script/FactoryGame.FGBuildingDescriptor\'':
			extraInfo = parseBuildingDescriptors(item.Classes);
			break;
	}
}

for (const info of extraInfo) {
	for (const building of json.buildings) {
		if (info.className === building.className) {
			building.buildMenuPriority = info.priority;
			building.categories = info.categories;
			break;
		}
	}
}

for (const generator of json.generators) {
	const index = generator.fuel.indexOf('FGItemDescriptorBiomass');
	if (index !== -1) {
		generator.fuel.splice(index, 1);
		generator.fuel.push(...biomass.map((bio) => {
			return bio.className;
		}));
	}
}

function findItem(className: string) {
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
}

fs.writeFileSync(path.join(__dirname, '..', 'data', 'data.json'), JSON.stringify(json, null, '\t'));

for (const recipe of json.recipes) {
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
}
