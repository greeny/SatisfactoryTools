import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {Strings} from '@src/Utils/Strings';
import {Arrays} from '@src/Utils/Arrays';
import parseItemAmount from '@bin/parseDocs/itemAmount';
import parseBlueprintClass from '@bin/parseDocs/blueprintClass';

export default function parseRecipes(recipes: {
	ClassName: string;
	mDisplayName: string;
	mIngredients: string;
	mProduct: string;
	mManufactoringDuration: string;
	mManualManufacturingMultiplier: string;
	mProducedIn: string;
}[]): IRecipeSchema[]
{
	const ignored = [
		'Desc_Truck_C',
		'Desc_FreightWagon_C',
		'Desc_Locomotive_C',
		'Desc_Tractor_C',
		'Desc_Explorer_C',
		'Desc_CyberWagon_C',
	];

	const result: IRecipeSchema[] = [];

	recipeLoop:
	for (const recipe of recipes) {
		const producedIn = Arrays.ensureArray(Strings.unserializeDocs(recipe.mProducedIn)).map(parseBlueprintClass).map((className: string) => {
			return className.replace('Build_', 'Desc_');
		});

		const products = Arrays.ensureArray(Strings.unserializeDocs(recipe.mProduct)).map(parseItemAmount);

		for (const product of products) {
			if (ignored.indexOf(product.item) !== -1) {
				continue recipeLoop;
			}
		}

		// ignore converter recipes
		if (producedIn.indexOf('Desc_Converter_C') !== -1) {
			continue;
		}

		let forBuilding = false;
		let inMachine = false;
		let inWorkshop = false;
		let inHand = false;
		const machines = [];
		for (const producer of producedIn) {
			if (producer === 'BP_BuildGun_C' || producer === 'FGBuildGun') {
				forBuilding = true;
			} else if (producer === 'BP_WorkshopComponent_C') {
				inWorkshop = true;
			} else if (producer === 'BP_WorkBenchComponent_C' || producer === 'FGBuildableAutomatedWorkBench' || producer === 'Desc_AutomatedWorkBench_C') {
				inHand = true;
			} else {
				inMachine = true;
				machines.push(producer);
			}
		}

		let alternate = recipe.mDisplayName.indexOf('Alternate: ') !== -1;

		if (recipe.ClassName === 'Recipe_Alternate_Turbofuel_C') {
			alternate = true;
		}

		result.push({
			slug: Strings.webalize(recipe.mDisplayName),
			name: recipe.mDisplayName,
			className: recipe.ClassName,
			alternate: alternate,
			time: parseFloat(recipe.mManufactoringDuration),
			manualTimeMultiplier: parseFloat(recipe.mManualManufacturingMultiplier),
			ingredients: Arrays.ensureArray(Strings.unserializeDocs(recipe.mIngredients)).map(parseItemAmount),
			forBuilding: forBuilding,
			inMachine: inMachine,
			inHand: inHand,
			inWorkshop: inWorkshop,
			products: products,
			producedIn: machines,
		});
	}
	return result;
}
