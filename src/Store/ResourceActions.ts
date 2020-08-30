import {createAction, props} from '@ngrx/store';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IResourceSchema} from '@src/Schema/IResourceSchema';

export const loadedResources = createAction('[Resource] Loaded JSON', props<{ data: IResourceSchema[] }>());
