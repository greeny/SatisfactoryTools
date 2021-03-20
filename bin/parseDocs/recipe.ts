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
	const ignoredProducts = [
		'Desc_Truck_C',
		'Desc_FreightWagon_C',
		'Desc_Locomotive_C',
		'Desc_Tractor_C',
		'Desc_Explorer_C',
		'Desc_CyberWagon_C',
	];

	const ignored = [
		'Desc_CandyCane_C',
		'Desc_Gift_C',
		'Desc_Snow_C',
		'Desc_SnowballProjectile_C',
		'Desc_XmasBall1_C',
		'Desc_XmasBall2_C',
		'Desc_XmasBall3_C',
		'Desc_XmasBall4_C',
		'Desc_XmasBallCluster_C',
		'Desc_XmasBow_C',
		'Desc_XmasBranch_C',
		'Desc_XmasStar_C',
		'Desc_XmasWreath_C',
		'Desc_CandyCaneDecor_C',
		'Desc_Snowman_C',
		'Desc_WreathDecor_C',
		'Desc_XmassTree_C',
	];

	const ignoredRecipes = [
		'Recipe_JumpPadTilted_C',
		'Recipe_JumpPad_C',
	];

	const result: IRecipeSchema[] = [];

	recipeLoop:
	for (const recipe of recipes) {
		if (ignoredRecipes.indexOf(recipe.ClassName) !== -1) {
			continue;
		}

		const producedIn = Arrays.ensureArray(Strings.unserializeDocs(recipe.mProducedIn)).map(parseBlueprintClass).map((className: string) => {
			return className.replace('Build_', 'Desc_');
		});

		const products = Arrays.ensureArray(Strings.unserializeDocs(recipe.mProduct)).map(parseItemAmount);
		const ingredients = Arrays.ensureArray(Strings.unserializeDocs(recipe.mIngredients)).map(parseItemAmount);

		for (const ingredient of ingredients) {
			if (ignored.indexOf(ingredient.item) !== -1) {
				continue recipeLoop;
			}
		}

		for (const product of products) {
			if (ignoredProducts.indexOf(product.item) !== -1 || ignored.indexOf(product.item) !== -1) {
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
			ingredients: ingredients,
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
