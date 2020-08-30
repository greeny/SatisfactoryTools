import {createAction, props} from '@ngrx/store';
import {IJsonSchema} from '@src/Schema/IJsonSchema';

export const loadJsonSchema = createAction('[ROOT] Load JSON schema', props());
export const loadedJsonSchema = createAction('[ROOT] Loaded JSON schema', props<{schema: IJsonSchema}>());
