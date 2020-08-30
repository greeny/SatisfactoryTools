import {createAction, props} from '@ngrx/store';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IItemSchema} from '@src/Schema/IItemSchema';

export const loadedItems = createAction('[Item] Loaded JSON', props<{ data: IItemSchema[] }>());
