import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import data from '@src/Data/Data';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {Constants} from '@src/Constants';
import {IOnInit} from 'angular';
import {ComponentOptionsService} from '@src/Module/Services/ComponentOptionsService';

export class ManufacturerRecipesComponentController implements IOnInit
{

	public building: IBuildingSchema;
	public recipes: IRecipeSchema[];
	public static $inject = ['ComponentOptionsService'];

	public constructor(public options: ComponentOptionsService)
	{

	}


	public isAutonomousManufacturer(entity: any): boolean
	{
		return data.isManufacturerBuilding(entity) && !data.isManualManufacturer(entity);
	}

	public isManualManufacturer(entity: any): boolean
	{
		return data.isManualManufacturer(entity);
	}

	public $onInit(): void
	{
		this.recipes = this.getRecipes();
	}

	private getRecipes(): IRecipeSchema[]
	{
		const recipeSchemas = Object.values(data.getRawData().recipes);
		if (this.isManualManufacturer(this.building) && Constants.WORKSHOP_CLASSNAME === this.building.className) {
			return recipeSchemas.filter((recipe: IRecipeSchema) => {
				return recipe.inWorkshop;
			});
		}
		if (this.isManualManufacturer(this.building) && Constants.WORKBENCH_CLASSNAME === this.building.className) {
			return recipeSchemas.filter((recipe: IRecipeSchema) => {
				return !recipe.inWorkshop && recipe.inHand;
			});
		}
		return recipeSchemas.filter((recipe: IRecipeSchema) => {
			return recipe.producedIn.indexOf(this.building.className) > -1;
		});
	}

}
