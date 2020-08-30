import {createAction, props} from '@ngrx/store';
import {IProductionToolRequest, IProductionToolRequestItem, IProductionToolRequestTabs} from '@src/Tools/Production/IProductionToolRequest';
import {IItemSchema} from '@src/Schema/IItemSchema';

export const addEmptyTab = createAction('[Calculator] Add empty tab');
export const addTab = createAction('[Calculator] Add tab', props<{ tab: IProductionToolRequest }>());
export const selectTab = createAction('[Calculator] Select tab', props<{ index: number }>());
export const cloneTab = createAction('[Calculator] Clone tab');
export const removeTab = createAction('[Calculator] Remove tab');
export const changeTabMode = createAction('[Calculator] Change tab mode', props<{ mode: IProductionToolRequestTabs }>());
export const toggleTabResource = createAction('[Calculator] Toggle tab resource', props<{ item: string }>());
export const zeroRawResources = createAction('[Calculator] Zero raw resources');
export const defaultRawResources = createAction('[Calculator] Default raw resources');
export const changeRawResources = createAction('[Calculator] Change raw resources', props<{ raw: {[key: string]: number} }>() );
export const changeRawResourceAmount = createAction('[Calculator] Change raw resource amount', props<{ key: string, amount: number }>() );

export const addEmptyProduct = createAction('[Calculator] Add empty product');
export const addProductToCurrentTab = createAction('[Calculator] Add product to current tab', props<{ item: IProductionToolRequestItem }>());
export const toggleExpandedStateForCurrentTab = createAction('[Calculator] Toggle expanded state');
export const changeIconForCurrentTab = createAction('[Calculator] Change icon', props<{item: IItemSchema}>());
