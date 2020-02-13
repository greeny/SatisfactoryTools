import {IItemSchema} from '@src/Schema/IItemSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IResourceSchema} from '@src/Schema/IResourceSchema';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';

export interface IJsonSchema
{

	items: IItemSchema[];
	recipes: IRecipeSchema[];
	generators: IGeneratorSchema[];
	resources: IResourceSchema[];
	miners: IMinerSchema[];
	buildings: IBuildingSchema[];

}
