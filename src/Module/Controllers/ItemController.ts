import data from '@src/Data/Data';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {ITransitionObject} from '@src/Types/ITransitionObject';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IBuildingSchema, IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {RecentlyVisitedItemsService} from '@src/Module/Services/RecentlyVisitedItemsService';

export class ItemController
{

	public static $inject = ['$state', '$transition$', 'RecentlyVisitedItemsService'];
	public item: IItemSchema;
	public recipes: IRecipeSchema[];
	public usagesAsIngredient: IRecipeSchema[];
	public usagesForBuilding: IRecipeSchema[];
	public usagesForSchematics: ISchematicSchema[];

	public constructor($state: any, $transition$: ITransitionObject<{item: string}>, recentlyVisitedItemsService: RecentlyVisitedItemsService)
	{
		const item = data.getItemBySlug($transition$.params().item);
		if (item === null) {
			$state.go('home');
			return;
		}
		recentlyVisitedItemsService.addVisited(item.className);
		this.item = item;
		this.recipes = Object.values(data.getRecipesForItem(item));
		this.usagesAsIngredient = Object.values(data.getUsagesAsIngredientForItem(item));
		this.usagesForBuilding = Object.values(data.getUsagesForBuildingForItem(item));
		this.usagesForSchematics = Object.values(data.getUsagesForSchematicsForItem(item));
	}

	public getItem(className: string): IItemSchema|null
	{
		return data.getRawData().items[className];
	}

	public getBuilding(className: string): IBuildingSchema|null
	{
		return data.getRawData().buildings[className];
	}

	public getMachine(recipe: IRecipeSchema): IManufacturerSchema|null
	{
		return data.getManufacturerByClassName(recipe.producedIn[0]);
	}

}
