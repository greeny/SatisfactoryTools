import rawData from '@data/data.json';
import rawAprilData from '@data/aprilData.json';
import {IJsonSchema} from '@src/Schema/IJsonSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IBuildingSchema, IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {IResourceSchema} from '@src/Schema/IResourceSchema';
import {BuildingTypes} from '@src/Types/BuildingTypes';
import {Constants} from '@src/Constants';
import {April} from '@src/Utils/April';
import * as angular from 'angular';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';

export class Data
{

	public static resourceAmounts = {
		Desc_OreIron_C: 70380,
		Desc_OreCopper_C: 28860,
		Desc_Stone_C: 52860,
		Desc_Coal_C: 30120,
		Desc_OreGold_C: 11040,
		Desc_LiquidOil_C: 11700,
		Desc_RawQuartz_C: 10500,
		Desc_Sulfur_C: 6840,
		Desc_OreBauxite_C: 9780,
		Desc_OreUranium_C: 2100,
		Desc_NitrogenGas_C: 12000,
		Desc_Water_C: Number.MAX_SAFE_INTEGER,
	};

	public static resourceWeights = {
		Desc_OreIron_C: 1,
		Desc_OreCopper_C: 2.4386694386694385,
		Desc_Stone_C: 1.3314415437003406,
		Desc_Coal_C: 2.2776699029126215,
		Desc_OreGold_C: 6.375,
		Desc_LiquidOil_C: 6.015384615384615,
		Desc_RawQuartz_C: 6.702857142857143,
		Desc_Sulfur_C: 10.289473684210526,
		Desc_OreBauxite_C: 7.196319018404908,
		Desc_OreUranium_C: 33.51428571428571,
		Desc_NitrogenGas_C: 5.865,
		Desc_Water_C: 0,
	};

	private readonly itemsWithoutSpecial: {[key: string]: IItemSchema};

	public constructor()
	{
		this.itemsWithoutSpecial = angular.copy(this.getRawData().items);
		delete this.itemsWithoutSpecial[Constants.SINK_POINTS_CLASSNAME];
		delete this.itemsWithoutSpecial[Constants.POWER_CLASSNAME];
	}

	public getRawData(): IJsonSchema
	{
		return April.isApril() ? rawAprilData as any : rawData as any;
	}

	public getAllItems(includeSpecial: boolean = false): {[key: string]: IItemSchema}
	{
		return includeSpecial ? this.getRawData().items : this.itemsWithoutSpecial;
	}

	public getAllBuildings(): {[key: string]: IBuildingSchema}
	{
		return this.getRawData().buildings;
	}

	public getAllSchematics(): {[key: string]: ISchematicSchema}
	{
		return this.getRawData().schematics;
	}

	public getRelevantSchematics(schematic: ISchematicSchema): ISchematicSchema[]
	{
		const allSchematics = this.getAllSchematics();
		const result: ISchematicSchema[] = [schematic];

		function addParentSchematics(s: ISchematicSchema) {
			for (const dependencyClass of s.requiredSchematics) {
				const dependency = allSchematics[dependencyClass];
				if (result.indexOf(dependency) === -1) {
					result.push(dependency);
					addParentSchematics(dependency);
				}
			}
		}

		function addChildSchematics(s: ISchematicSchema) {
			for (const key in allSchematics) {
				const child = allSchematics[key];
				if (child.requiredSchematics.indexOf(s.className) !== -1 && result.indexOf(child) === -1) {
					result.push(child);
					addChildSchematics(child);
				}
			}
		}

		addParentSchematics(schematic);
		addChildSchematics(schematic);

		return result;
	}

	public getSchematicBySlug(slug: string): ISchematicSchema|null
	{
		const schematics = this.getRawData().schematics;
		for (const key in schematics) {
			if (schematics[key].slug === slug) {
				return schematics[key];
			}
		}
		return null;
	}

	public getItemBySlug(slug: string): IItemSchema|null
	{
		const items = this.getRawData().items;
		for (const key in items) {
			if (items[key].slug === slug) {
				return items[key];
			}
		}
		return null;
	}

	public getBuildingBySlug(slug: string): IBuildingSchema|null
	{
		const buildings = this.getRawData().buildings;
		for (const key in buildings) {
			if (buildings[key].slug === slug) {
				return buildings[key];
			}
		}
		return null;
	}

	public getGenerators(): IGeneratorSchema[]
	{
		return Object.values(this.getRawData().generators).filter((generator: IGeneratorSchema) => {
			return generator.fuel.length;
		});
	}

	public getBaseItemRecipes(): IRecipeSchema[]
	{
		const recipes: IRecipeSchema[] = [];
		const data = this.getRawData();
		for (const key in data.recipes) {
			const recipe = data.recipes[key];
			if (!recipe.alternate && recipe.inMachine) {
				recipes.push(recipe);
			}
		}
		return recipes;
	}

	public getSinkableItems(): IItemSchema[]
	{
		const data = this.getRawData();
		const items: IItemSchema[] = [];
		for (const key in this.getAllItems()) {
			const item = data.items[key];
			if (item.sinkPoints > 0 && !item.liquid && item.className !== Constants.COUPON_CLASSNAME) {
				items.push(item);
			}
		}

		return items;
	}

	public getAlternateRecipes(): IRecipeSchema[]
	{
		const recipes: IRecipeSchema[] = [];
		const data = this.getRawData();
		for (const key in data.recipes) {
			const recipe = data.recipes[key];
			if (recipe.alternate) {
				recipes.push(recipe);
			}
		}
		return recipes;
	}

	public getRecipes(): IRecipeSchema[]
	{
		const recipes: IRecipeSchema[] = [];
		const data = this.getRawData();
		for (const key in data.recipes) {
			const recipe = data.recipes[key];
			if (recipe.inMachine) {
				recipes.push(recipe);
			}
		}
		return recipes;
	}

	public getRecipesForItem(item: IItemSchema): {[key: string]: IRecipeSchema}
	{
		const recipeData = this.getRawData().recipes;
		const recipes: {[key: string]: IRecipeSchema} = {};
		function addRecipes(alt: boolean) {
			for (const key in recipeData) {
				const recipe = recipeData[key];
				for (const product of recipe.products) {
					if (product.item === item.className && recipe.alternate === alt) {
						recipes[key] = recipe;
					}
				}
			}
		}
		addRecipes(false);
		addRecipes(true);
		return recipes;
	}

	public getUsagesAsIngredientForItem(item: IItemSchema): {[key: string]: IRecipeSchema}
	{
		const recipeData = this.getRawData().recipes;
		const recipes: {[key: string]: IRecipeSchema} = {};
		function addRecipes(alt: boolean) {
			for (const key in recipeData) {
				const recipe = recipeData[key];
				for (const ingredient of recipe.ingredients) {
					if (item.className === ingredient.item && !recipe.forBuilding && recipe.alternate === alt) {
						recipes[key] = recipe;
					}
				}
			}
		}
		addRecipes(false);
		addRecipes(true);
		return recipes;
	}

	public getUsagesForBuildingForItem(item: IItemSchema): {[key: string]: IRecipeSchema}
	{
		const recipeData = this.getRawData().recipes;
		const recipes: {[key: string]: IRecipeSchema} = {};
		for (const key in recipeData) {
			const recipe = recipeData[key];
			for (const ingredient of recipe.ingredients) {
				if (ingredient.item === item.className && recipe.forBuilding) {
					recipes[key] = recipe;
				}
			}
		}
		return recipes;
	}

	public getUsagesForSchematicsForItem(item: IItemSchema): {[key: string]: ISchematicSchema}
	{
		const schematicData = this.getRawData().schematics;
		const schematics: {[key: string]: ISchematicSchema} = {};
		for (const key in schematicData) {
			const schematic = schematicData[key];
			for (const ingredient of schematic.cost) {
				if (ingredient.item === item.className) {
					schematics[key] = schematic;
				}
			}
		}
		return schematics;
	}

	public getSchematicByClassName(className: string): ISchematicSchema|null
	{
		const schematics = this.getRawData().schematics;
		return (className in schematics) ? schematics[className] : null;
	}

	public getItemByClassName(className: string): IItemSchema|null
	{
		const items = this.getRawData().items;
		return (className in items) ? items[className] : null;
	}

	public getRecipeByClassName(className: string): IRecipeSchema|null
	{
		const recipes = this.getRawData().recipes;
		return (className in recipes) ? recipes[className] : null;
	}

	public getBuildingByClassName(className: string): IBuildingSchema|null
	{
		const buildings = this.getRawData().buildings;
		return (className in buildings) ? buildings[className] : null;
	}

	public getManufacturerByClassName(className: string): IManufacturerSchema|null
	{
		const buildings = this.getRawData().buildings;
		return (className in buildings) ? buildings[className] as IManufacturerSchema : null;
	}

	public isItem(entity: BuildingTypes): entity is IItemSchema
	{
		return entity.hasOwnProperty('fluid');
	}

	public isResource(entity: BuildingTypes): boolean
	{
		return this.getRawData().resources.hasOwnProperty(entity.className);
	}

	public isBuilding(entity: BuildingTypes): entity is IBuildingSchema
	{
		if (this.isItem(entity)) {
			return false;
		}

		return entity.hasOwnProperty('categories');
	}

	public isPowerConsumingBuilding(entity: BuildingTypes): entity is IBuildingSchema
	{
		if (!this.isBuilding(entity)) {
			return false;
		}

		if (this.isGeneratorBuilding(entity)) {
			return false;
		}

		return entity.hasOwnProperty('categories');
	}

	public isGeneratorBuilding(entity: BuildingTypes): boolean
	{
		if (!this.isBuilding(entity)) {
			return false;
		}
		return this.getRawData().generators.hasOwnProperty(entity.className.replace('Desc', 'Build'));
	}

	public isManualManufacturer(entity: BuildingTypes): boolean
	{
		return Constants.WORKBENCH_CLASSNAME === entity.className || Constants.WORKSHOP_CLASSNAME === entity.className;
	}

	public isManufacturerBuilding(entity: BuildingTypes): boolean
	{
		if (!this.isBuilding(entity)) {
			return false;
		}
		if (this.isGeneratorBuilding(entity) || this.isExtractorBuilding(entity)) {
			return false;
		}
		if (this.isManualManufacturer(entity)) {
			return true;
		}
		const acceptableCategories = [
			'SC_Manufacturers_C',
			'SC_OilProduction_C',
			'SC_Smelters_C',
		];
		return acceptableCategories.filter((acceptableCategory: string) => {
			return (entity as IBuildingSchema).categories.indexOf(acceptableCategory) >= 0;
		}).length > 0;
	}

	public isExtractorBuilding(entity: BuildingTypes): boolean
	{
		if (!this.isBuilding(entity)) {
			return false;
		}
		return this.getRawData().miners.hasOwnProperty(entity.className.replace('Desc', 'Build'));
	}

	public getResources(): IResourceSchema[]
	{
		return Object.values(this.getRawData().resources).sort((a, b) => {
			const itemA = this.getItemByClassName(a.item) as IItemSchema;
			const itemB = this.getItemByClassName(b.item) as IItemSchema;
			return itemA.name.localeCompare(itemB.name);
		});
	}

}

export default new Data;
