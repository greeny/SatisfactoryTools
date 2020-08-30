import {createAction, props} from '@ngrx/store';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';

export const loadedBuildings = createAction('[Building] Loaded JSON', props<{ data: IBuildingSchema[] }>());
