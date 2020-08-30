import {createAction, props} from '@ngrx/store';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IMinerSchema} from '@src/Schema/IMinerSchema';

export const loadedMiners = createAction('[Miner] Loaded JSON', props<{ data: IMinerSchema[] }>());
