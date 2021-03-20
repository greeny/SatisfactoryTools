import {IItemSchema} from '@src/Schema/IItemSchema';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import {IResourceSchema} from '@src/Schema/IResourceSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';

// export type BuildingTypes = IItemSchema|IRecipeSchema|ISchematicSchema|IGeneratorSchema|IResourceSchema|IMinerSchema|IBuildingSchema;
export type BuildingTypes = IItemSchema|IRecipeSchema|IBuildingSchema;
