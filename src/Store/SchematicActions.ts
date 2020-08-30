import {createAction, props} from '@ngrx/store';
import {ISchematicSchema} from '@src/Schema/ISchematicSchema';

export const loadedSchematics = createAction('[Schematic] Loaded JSON', props<{ data: ISchematicSchema[] }>());
