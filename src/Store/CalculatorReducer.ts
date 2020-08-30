import {createReducer, on} from '@ngrx/store';
import {
	addProductToCurrentTab,
	addTab,
	changeIconForCurrentTab,
	changeRawResourceAmount,
	changeRawResources,
	changeTabMode,
	cloneTab,
	removeTab,
	selectTab,
	toggleExpandedStateForCurrentTab,
	toggleTabResource
} from '@src/Store/CalculatorActions';
import {IProductionToolRequest} from '@src/Tools/Production/IProductionToolRequest';

export interface IState
{
	productionRequests: IProductionToolRequest[];
	currentRequestIndex?: number;
}

const initialState: IState = {
	productionRequests: [],
	currentRequestIndex: null,
};

const replaceTab = (state: IState, replacementTab: IProductionToolRequest, replacementIndex: number): IState => {
	return {
		...state, productionRequests: state.productionRequests.map((request, index) => {
			if (index !== replacementIndex) {
				return request;
			} else {
				return replacementTab;
			}
		})
	};
};

const reducerFnReference = createReducer(initialState,
	on(addTab, (state, action) => {
		return {...state, productionRequests: [...state.productionRequests, action.tab]};
	}),
	on(selectTab, (state, action) => {
		return {...state, currentRequestIndex: action.index};
	}),
	on(cloneTab, (state, action) => {
		const clone = {...state.productionRequests[state.currentRequestIndex]};
		return {...state, productionRequests: [...state.productionRequests, clone]};
	}),
	on(removeTab, (state, action) => {
		const requests = [...state.productionRequests];
		requests.splice(state.currentRequestIndex, 1);
		return {...state, productionRequests: requests, currentRequestIndex: state.currentRequestIndex > 0 ? state.currentRequestIndex - 1 : 0};
	}),
	on(changeTabMode, (state, action) => {
		const currentTab = {...state.productionRequests[state.currentRequestIndex], tab: action.mode};
		return replaceTab(state, currentTab, state.currentRequestIndex);
	}),
	on(changeRawResources, (state, action) => {
		const currentTab = {...state.productionRequests[state.currentRequestIndex], resourceMax: action.raw};
		return replaceTab(state, currentTab, state.currentRequestIndex);
	}),
	on(changeRawResourceAmount, (state, action) => {
		const resources = {...state.productionRequests[state.currentRequestIndex].resourceMax};
		resources[action.key] = action.amount;
		const currentTab = {...state.productionRequests[state.currentRequestIndex], resourceMax: resources};
		return replaceTab(state, currentTab, state.currentRequestIndex);
	}),
	on(toggleTabResource, (state, action) => {
		const resources = [...state.productionRequests[state.currentRequestIndex].blockedResources];
		if (-1 === resources.indexOf(action.item)) {
			resources.push(action.item);
		} else {
			resources.splice(resources.indexOf(action.item), 1);
		}
		const currentTab = {...state.productionRequests[state.currentRequestIndex], blockedResources: resources};
		return replaceTab(state, currentTab, state.currentRequestIndex);
	}),
	on(addProductToCurrentTab, (state, action) => {
		const requests = [];
		state.productionRequests.forEach((element, index) => {
		});

		return {...state, productionRequests: requests};
	}),
	on(changeIconForCurrentTab, (state, action) => {
		const currentTab = {...state.productionRequests[state.currentRequestIndex], icon: action.item.className};
		return replaceTab(state, currentTab, state.currentRequestIndex);
	}),
	on(toggleExpandedStateForCurrentTab, (state, action) => {
		const tabState = {...(state.productionRequests[state.currentRequestIndex].state), expanded: !state.productionRequests[state.currentRequestIndex].state.expanded};
		const currentTab = {...state.productionRequests[state.currentRequestIndex], state: tabState};
		return replaceTab(state, currentTab, state.currentRequestIndex);
	})
);

export function reducer(state, action)
{
	return reducerFnReference(state, action);
}
