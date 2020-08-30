import {createAction, props} from '@ngrx/store';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';

export const loadedGenerators = createAction('[Generator] Loaded JSON', props<{ data: IGeneratorSchema[] }>());
