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
import {Objects} from '@src/Utils/Objects';
import {DiffGenerator} from '@src/Utils/DiffGenerator/DiffGenerator';
import {DiffFormatter} from '@src/Utils/DiffGenerator/DiffFormatter';
import parseImageMapping from '@bin/parseDocs/imageMapping';
import {Strings} from '@src/Utils/Strings';

const safeParseJson = <T>(file: string, encoding: BufferEncoding = 'utf8'): T => {
	// The encoding of the retrieved string is handled by readFile[Sync], but JSON.parse
	// does not like the BOM, so strip it from the JSON string if present.
	let json = fs.readFileSync(file, { encoding });
	const BOM = "\u{FEFF}";
	if (json.startsWith(BOM)) {
		json = json.substr(BOM.length);
	}
	return JSON.parse(json);
};

const docs = safeParseJson<any>(path.join(__dirname, '..', 'data', 'Docs.json'), 'utf16le');
const oldData = safeParseJson<IJsonSchema>(path.join(__dirname, '..', 'data', 'data.json'));

//const sizes: {Name: string, Dimensions: number[]}[] = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'debug.json')).toString()) as {Name: string, Dimensions: number[]}[];

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
let imageMapping: { [key: string]: string } = {};

for (const definitions of docs) {
	switch (definitions.NativeClass) {
		case 'Class\'/Script/FactoryGame.FGItemDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGEquipmentDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGConsumableDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGItemDescriptorNuclearFuel\'':
		case 'Class\'/Script/FactoryGame.FGItemDescAmmoTypeProjectile\'':
		case 'Class\'/Script/FactoryGame.FGItemDescAmmoTypeColorCartridge\'':
		case 'Class\'/Script/FactoryGame.FGItemDescAmmoTypeInstantHit\'':
			for (const item of parseItemDescriptors(definitions.Classes)) {
				json.items[item.className] = item;
			}
			for (const item of parseImageMapping(definitions.Classes)) {
				imageMapping[item.className] = item.image;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGRecipe\'':
			for (const recipe of parseRecipes(definitions.Classes)) {
				json.recipes[recipe.className] = recipe;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGResourceDescriptor\'':
			for (const item of parseItemDescriptors(definitions.Classes)) {
				json.items[item.className] = item;
			}
			for (const item of parseImageMapping(definitions.Classes)) {
				imageMapping[item.className] = item.image;
			}
			for (const resource of parseResourceDescriptors(definitions.Classes)) {
				json.resources[resource.item] = resource;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGItemDescriptorBiomass\'':
			biomass = parseItemDescriptors(definitions.Classes);
			for (const item of biomass) {
				json.items[item.className] = item;
			}
			for (const item of parseImageMapping(definitions.Classes)) {
				imageMapping[item.className] = item.image;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildablePole\'':
		case 'Class\'/Script/FactoryGame.FGBuildableConveyorBelt\'':
		case 'Class\'/Script/FactoryGame.FGBuildableWire\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePowerPole\'':
		case 'Class\'/Script/FactoryGame.FGBuildableDroneStation\'':
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
		case 'Class\'/Script/FactoryGame.FGBuildableWaterPump\'':
		case 'Class\'/Script/FactoryGame.FGBuildableFrackingExtractor\'':
		case 'Class\'/Script/FactoryGame.FGBuildableFrackingActivator\'':
		case 'Class\'/Script/FactoryGame.FGBuildableManufacturerVariablePower\'':
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
		case 'Class\'/Script/FactoryGame.FGBuildablePowerStorage\'':
		case 'Class\'/Script/FactoryGame.FGBuildableTrainPlatformEmpty\'':
		case 'Class\'/Script/FactoryGame.FGBuildableCircuitSwitch\'':
		case 'Class\'/Script/FactoryGame.FGBuildableSplitterSmart\'':
		case 'Class\'/Script/FactoryGame.FGBuildableWalkway\'':
		case 'Class\'/Script/FactoryGame.FGVehicleDescriptor\'':
		case 'Class\'/Script/FactoryGame.FGBuildableLightSource\'':
		case 'Class\'/Script/FactoryGame.FGBuildableFloodlight\'':
		case 'Class\'/Script/FactoryGame.FGBuildableLightsControlPanel\'':
		case 'Class\'/Script/FactoryGame.FGBuildableDoor\'':
		case 'Class\'/Script/FactoryGame.FGBuildableCornerWall\'':
		case 'Class\'/Script/FactoryGame.FGBuildableMAM\'':
		case 'Class\'/Script/FactoryGame.FGBuildablePillar\'':
		case 'Class\'/Script/FactoryGame.FGBuildableRamp\'':
		case 'Class\'/Script/FactoryGame.FGBuildableJumppad\'':
		case 'Class\'/Script/FactoryGame.FGBuildableRailroadSignal\'':
		case 'Class\'/Script/FactoryGame.FGBuildableBeam\'':
		case 'Class\'/Script/FactoryGame.FGBuildableFactoryBuilding\'':
		case 'Class\'/Script/FactoryGame.FGBuildableWidgetSign\'':
		case 'Class\'/Script/FactoryGame.FGBuildableLadder\'':
			for (const building of parseBuildings(definitions.Classes, true)) {
				json.buildings[building.className] = building;
			}
			for (const item of parseImageMapping(definitions.Classes)) {
				imageMapping[item.className] = item.image;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildableRadarTower\'':
			for (const building of parseBuildings(definitions.Classes, true)) {
				json.buildings[building.className] = building;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildableResourceExtractor\'':
			for (const building of parseBuildings(definitions.Classes, true)) {
				json.buildings[building.className] = building;
			}
			for (const item of parseImageMapping(definitions.Classes)) {
				imageMapping[item.className] = item.image;
			}
			for (const miner of parseResourceExtractors(definitions.Classes)) {
				json.miners[miner.className] = miner;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorFuel\'':
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorNuclear\'':
		case 'Class\'/Script/FactoryGame.FGBuildableGeneratorGeoThermal\'':
			for (const building of parseBuildings(definitions.Classes, true)) {
				json.buildings[building.className] = building;
			}
			for (const item of parseImageMapping(definitions.Classes)) {
				imageMapping[item.className] = item.image;
			}
			for (const generator of parseGenerators(definitions.Classes)) {
				json.generators[generator.className] = generator;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGBuildingDescriptor\'':
			extraInfo = parseBuildingDescriptors(definitions.Classes);
			for (const item of parseImageMapping(definitions.Classes)) {
				imageMapping[item.className] = item.image;
			}
			break;
		case 'Class\'/Script/FactoryGame.FGSchematic\'':
			for (const schematic of parseSchematics(definitions.Classes)) {
				json.schematics[schematic.className] = schematic;
			}
			for (const schematic of parseImageMapping(definitions.Classes)) {
				imageMapping[schematic.className] = schematic.image;
			}
			break;
		default:
			// console.log(definitions.NativeClass);
			break;
	}
}

const vehicleMapping: {
	key: string,
	name: string,
	description: string,
}[] = [
	{
		key: 'Desc_Truck_C',
		name: 'Truck',
		description: '48 slot inventory. Has a built in Craft Bench. Can be automated to pick up and deliver resources at Truck Stations. Nicknamed the Unit by FICSIT pioneers because of its massive frame.',
	},
	{
		key: 'Desc_Tractor_C',
		name: 'Tractor',
		description: '25 slot inventory. Has a built in Craft Bench. Can be automated to pick up and deliver resources at Truck Stations. Nicknamed the Sugarcube by FICSIT pioneers.',
	},
	{
		key: 'Desc_FreightWagon_C',
		name: 'Freight Car',
		description: 'The Freight Car is used to transport large quantity of resources from one place to another. Resources are loaded or unloaded at Freight Platforms.\nMust be build on Railway.',
	},
	{
		key: 'Desc_Locomotive_C',
		name: 'Electric Locomotive',
		description: 'This locomotive is used to move Freight Cars from station to station.\nRequires 25-110MW of Power to drive.\nMust be built on railway.\nNamed \'Leif\' by FISCIT pioneers because of its reliability.',
	},
	{
		key: 'Desc_Explorer_C',
		name: 'Explorer',
		description: '24 slot inventory. Has a built in craft bench. Fast and nimble exploration vehicle. Tuned for really rough terrain and can climb almost vertical surfaces.',
	},
	{
		key: 'Desc_CyberWagon_C',
		name: 'Cyber Wagon',
		description: 'Absolutely indestructible.\nNeeds no further introduction.',
	},
	{
		key: 'Desc_DroneTransport_C',
		name: 'Drone',
		description: '',
	},
];

for (const item of vehicleMapping) {
	json.buildings[item.key].name = item.name;
	json.buildings[item.key].description = item.description;
	json.buildings[item.key].slug = Strings.webalize(item.name);
}

// add building sizes
/*for (const item of sizes) {
	for (const key in json.buildings) {
		if (item.Name.replace('Build_', 'Desc_') === json.buildings[key].className) {
			json.buildings[key].size = {
				width: item.Dimensions[0] * 0.02,
				length: item.Dimensions[1] * 0.02,
				height: item.Dimensions[2] * 0.02,
			};
		}
	}
}*/

// add extra info to buildings
for (const info of extraInfo) {
	if (info.className in json.buildings) {
		json.buildings[info.className].buildMenuPriority = info.priority;
		json.buildings[info.className].categories = info.categories;
	} else {
		// console.log(info.className);
	}
}

// add coupon item
json.items['Desc_ResourceSinkCoupon_C'] = {
	className: 'Desc_ResourceSinkCoupon_C',
	description: 'A special FICSIT bonus program Coupon, obtained through the AWESOME Sink. Can be redeemed in the AWESOME Shop for bonus milestones and rewards',
	energyValue: 0,
	fluidColor: {
		r: 0,
		g: 0,
		b: 0,
		a: 0,
	},
	liquid: false,
	name: 'FICSIT Coupon',
	radioactiveDecay: 0,
	sinkPoints: 1,
	slug: 'ficsit-coupon',
	stackSize: 500,
};
imageMapping['Desc_ResourceSinkCoupon_C'] = '/Game/FactoryGame/Resource/Parts/ResourceSinkCoupon/UI/IconDesc_Ficsit_Coupon_256.png';

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

// attach extractable resources instead of keeping empty array with "everything allowed"
for (const minerKey in json.miners) {
	if (json.miners[minerKey].allowedResources.length > 0) {
		continue;
	}

	const allowedResources = [] as string[];
	for (const resourceKey in json.resources) {
		if (!json.items[resourceKey]) {
			throw new Error(`Item of resource type "${resourceKey}" was not found.`);
		}

		const item = json.items[resourceKey];

		if (item.liquid === json.miners[minerKey].allowLiquids) {
			allowedResources.push(resourceKey);
		}
	}

	allowedResources.sort();
	json.miners[minerKey].allowedResources = allowedResources;
}

for (const key in json) {
	if (json.hasOwnProperty(key)) {
		json[key as keyof IJsonSchema] = Objects.sortByKeys(json[key as keyof IJsonSchema]);
	}
}

const slugs: string[] = [];
for (const key in json.items) {
	let slug = json.items[key].slug;
	let i = 1;
	while (slugs.indexOf(slug) !== -1) {
		slug = json.items[key].slug + '-' + i++;
	}
	json.items[key].slug = slug;
	slugs.push(slug);
}
for (const key in json.buildings) {
	let slug = json.buildings[key].slug;
	let i = 1;
	while (slugs.indexOf(slug) !== -1) {
		slug = json.buildings[key].slug + '-' + i++;
	}
	json.buildings[key].slug = slug;
	slugs.push(slug);
}
for (const key in json.schematics) {
	let slug = json.schematics[key].slug;
	let i = 1;
	while (slugs.indexOf(slug) !== -1) {
		slug = json.schematics[key].slug + '-' + i++;
	}
	json.schematics[key].slug = slug;
	slugs.push(slug);
}

fs.writeFileSync(path.join(__dirname, '..', 'data', 'data.json'), JSON.stringify(json, null, '\t') + '\n');

const diffGenerator = new DiffGenerator();
fs.writeFileSync(path.join(__dirname, '..', 'data', 'diff.txt'), DiffFormatter.diffToMarkdown(diffGenerator.generateDiff(oldData, json)));

fs.writeFileSync(path.join(__dirname, '..', 'data', 'imageMapping.json'), JSON.stringify(imageMapping, null, '\t') + '\n');
