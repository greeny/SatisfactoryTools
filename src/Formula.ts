import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IBuildingSchema, IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import {Constants, RESOURCE_PURITY} from '@src/Constants';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';

export class Formula
{

	private static defaultClock = 100;
	private static defaultPowerProductionExponent = 1.6;

	public static calculateBuildingRecipeProductionTime(recipe: IRecipeSchema, building: IBuildingSchema, overclock: number): number
	{
		return (Formula.defaultClock / overclock) * recipe.time * (1 / (building.metadata.manufacturingSpeed || 1));
	}

	public static calculateBuildingPowerConsumption(building: IBuildingSchema, overclock: number)
	{
		return Math.pow(overclock / 100, building.metadata.powerConsumptionExponent || Formula.defaultPowerProductionExponent) * (building.metadata.powerConsumption || 0);
	}

	public static calculateExtractorExtractionValue(extractor: IMinerSchema, purity: RESOURCE_PURITY): number
	{
		const itemsInMinute = (extractor.itemsPerCycle / extractor.extractCycleTime) * 60;
		switch (purity) {
			case 'impure':
				return itemsInMinute * Constants.RESOURCE_MULTIPLIER_IMPURE;
			case 'normal':
				return itemsInMinute * Constants.RESOURCE_MULTIPLIER_NORMAL;
			case 'pure':
				return itemsInMinute * Constants.RESOURCE_MULTIPLIER_PURE;
		}
	}

	public static calculateFuelConsumption(generator: IGeneratorSchema, fuel: IItemSchema, overclock: number)
	{
		return (((generator.powerProduction / fuel.energyValue) * 60) / (fuel.liquid ? 1000 : 1)) * Math.pow(overclock / 100, 1 / generator.powerProductionExponent);
	}

	public static calculateProductAmountsPerMinute(building: IManufacturerSchema, recipe: IRecipeSchema, recipeProductAmount: number, overclock: number): number
	{
		const recipeTime = Formula.calculateBuildingRecipeProductionTime(recipe, building, overclock);
		return (60 / (recipe.time * (recipeTime / recipe.time))) * recipeProductAmount;
	}

	public static calculateGeneratorWaterConsumption(building: IGeneratorSchema, overclock: number): number
	{
		return (60 * (Formula.calculatePowerGeneratorPowerCapacity(building, overclock) * building.waterToPowerRatio)) / 1000;
	}

	public static calculatePowerGeneratorPowerCapacity(generator: IGeneratorSchema, overclock: number)
	{
		return (generator.powerProduction * Math.pow(overclock / 100, 1 / generator.powerProductionExponent));
	}

}
