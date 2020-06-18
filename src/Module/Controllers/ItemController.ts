import data from '@src/Data/Data';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {ITransitionObject} from '@src/Types/ITransitionObject';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IBuildingSchema, IManufacturerSchema} from '@src/Schema/IBuildingSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {RecentlyVisitedItemsService} from '@src/Module/Services/RecentlyVisitedItemsService';
import {IScope} from 'angular';
import {ItemFiltersService} from '@src/Module/Services/ItemFiltersService';

export class ItemController
{

	public item: IItemSchema;
	public recipes: IRecipeSchema[];
	public usagesAsIngredient: IRecipeSchema[];
	public usagesForBuilding: IRecipeSchema[];
	public usagesForSchematics: ISchematicSchema[];

	public static $inject = ['$state', '$transition$', 'RecentlyVisitedItemsService', 'ItemFiltersService', '$scope'];

	public constructor(
		$state: any, $transition$: ITransitionObject<{item: string}>, recentlyVisitedItemsService: RecentlyVisitedItemsService, private itemFilterService: ItemFiltersService, private $scope: IScope,
	)
	{
		const item = data.getItemBySlug($transition$.params().item);
		if (item === null) {
			$state.go($state.current.parent);
			return;
		}
		this.itemFilterService.filter.query = item.name;
		recentlyVisitedItemsService.addVisited(item.className);
		this.item = item;
		this.recipes = Object.values(data.getRecipesForItem(item));
		this.usagesAsIngredient = Object.values(data.getUsagesAsIngredientForItem(item));
		this.usagesForBuilding = Object.values(data.getUsagesForBuildingForItem(item));
		this.usagesForSchematics = Object.values(data.getUsagesForSchematicsForItem(item));
		this.$scope.$watch(() => {
			return this.itemFilterService.filter.query;
		}, (newValue) => {
			if (newValue !== item.name) {
				$state.go($state.current.parent);
			}
		});
	}

	public getItem(className: string): IItemSchema|null
	{
		return data.getRawData().items[className];
	}

	public getRecipe(className: string): IRecipeSchema|null
	{
		return data.getRawData().recipes[className];
	}

	public getBuilding(className: string): IBuildingSchema|null
	{
		return data.getRawData().buildings[className];
	}

	public getMachine(recipe: IRecipeSchema): IManufacturerSchema|null
	{
		return data.getManufacturerByClassName(recipe.producedIn[0]);
	}

	public resetFilter(): void
	{
		this.itemFilterService.resetFilters();
	}

}
