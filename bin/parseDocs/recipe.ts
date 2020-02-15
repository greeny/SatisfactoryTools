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
}[])
{
	const result: IRecipeSchema[] = [];
	for (const recipe of recipes) {
		const producedIn = Arrays.ensureArray(Strings.unserializeDocs(recipe.mProducedIn)).map(parseBlueprintClass).map((className: string) => {
			return className.replace('Build_', 'Desc_');
		});

		// ignore converter recipes
		if (producedIn.indexOf('Desc_Converter_C') !== -1) {
			continue;
		}
		result.push({
			slug: Strings.webalize(recipe.mDisplayName),
			name: recipe.mDisplayName,
			className: recipe.ClassName,
			alternate: recipe.mDisplayName.indexOf('Alternate: ') !== -1,
			time: parseFloat(recipe.mManufactoringDuration),
			manualTimeMultiplier: parseFloat(recipe.mManualManufacturingMultiplier),
			ingredients: Arrays.ensureArray(Strings.unserializeDocs(recipe.mIngredients)).map(parseItemAmount),
			products: Arrays.ensureArray(Strings.unserializeDocs(recipe.mProduct)).map(parseItemAmount),
			producedIn: producedIn,
		});
	}
	return result;
}
