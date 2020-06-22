import data from '@src/Data/Data';
import {ITransitionObject} from '@src/Types/ITransitionObject';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {IScope} from 'angular';
import {BuildingFiltersService} from '@src/Module/Services/BuildingFiltersService';
import {IItemSchema} from '@src/Schema/IItemSchema';

export class BuildingController
{

	public building: IBuildingSchema;
	public buildingRecipe: IRecipeSchema|null;
	public recipes: IRecipeSchema[];
	public usagesForBuilding: IRecipeSchema[];
	public usagesForSchematics: ISchematicSchema[];
	public static $inject = ['$state', '$transition$', 'BuildingFiltersService', '$scope'];

	public constructor(
		$state: any, $transition$: ITransitionObject<{item: string}>, private itemFilterService: BuildingFiltersService, private $scope: IScope,
	)
	{
		const building = data.getBuildingBySlug($transition$.params().item);
		if (building === null) {
			$state.go($state.current.parent);
			return;
		}
		this.building = building;
		this.buildingRecipe = this.getRecipeForCurrentBuilding();
		this.itemFilterService.filter.query = this.building.name;
		this.$scope.$watch(() => {
			return this.itemFilterService.filter.query;
		}, (newValue) => {
			if (newValue !== building.name) {
				$state.go($state.current.parent);
			}
		});
	}

	public getItem(className: string): IItemSchema|null
	{
		return data.getItemByClassName(className);
	}

	public getRecipeForCurrentBuilding(): IRecipeSchema|null
	{
		return Object.values(data.getRawData().recipes)
			.find((recipe: IRecipeSchema) => {
				return recipe.products.map((product) => {
					return product.item;
				}).indexOf(this.building.className) >= 0;
			}) || null;
	}

	public resetFilter(): void
	{
		this.itemFilterService.resetFilters();
	}

}
