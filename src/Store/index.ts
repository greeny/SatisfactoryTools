import * as fromBuilding from './BuildingReducer';
import * as fromGenerator from './GeneratorReducer';
import * as fromItem from './ItemReducer';
import * as fromMiner from './MinerReducer';
import * as fromRecipe from './RecipeReducer';
import * as fromResource from './ResourceReducer';
import * as fromSchematic from './SchematicReducer';
import * as fromCalculator from './CalculatorReducer';
import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import {ICalculatorState} from '@src/Types/ICalculatorState';

export interface ApplicationState
{
	buildings: fromBuilding.IState;
	generators: fromGenerator.IState;
	items: fromItem.IState;
	miners: fromMiner.IState;
	recipes: fromRecipe.IState;
	resources: fromResource.IState;
	schematic: fromSchematic.IState;
	calculator: fromCalculator.IState;
}

export const reducers: ActionReducerMap<ApplicationState> = {
	buildings: fromBuilding.reducer,
	generators: fromGenerator.reducer,
	items: fromItem.reducer,
	miners: fromMiner.reducer,
	recipes: fromRecipe.reducer,
	resources: fromResource.reducer,
	schematic: fromSchematic.reducer,
	calculator: fromCalculator.reducer
};

export const selectBuildingsFeature = createFeatureSelector<fromBuilding.IState>('buildings');
export const selectGeneratorsFeature = createFeatureSelector<fromGenerator.IState>('generators');
export const selectItemsFeature = createFeatureSelector<fromItem.IState>('items');
export const selectMinersFeature = createFeatureSelector<fromMiner.IState>('miners');
export const selectRecipesFeature = createFeatureSelector<fromRecipe.IState>('recipes');
export const selectResourcesFeature = createFeatureSelector<fromResource.IState>('resources');
export const selectSchematicsFeature = createFeatureSelector<fromSchematic.IState>('schematic');
export const selectCalculatorFeature = createFeatureSelector<fromCalculator.IState>('calculator');

export const selectAllBuildings = createSelector(
	selectBuildingsFeature,
	fromBuilding.selectAll
);
export const selectAllGenerators = createSelector(
	selectGeneratorsFeature,
	fromGenerator.selectAll
);
export const selectAllItems = createSelector(
	selectItemsFeature,
	fromItem.selectAll
);
export const selectItemEntities = createSelector(
	selectItemsFeature,
	fromItem.selectEntities
);
export const selectAllMiners = createSelector(
	selectMinersFeature,
	fromMiner.selectAll
);
export const selectAllRecipes = createSelector(
	selectRecipesFeature,
	fromRecipe.selectAll
);
export const selectAllResources = createSelector(
	selectResourcesFeature,
	fromResource.selectAll
);
export const selectAllSchematics = createSelector(
	selectSchematicsFeature,
	fromSchematic.selectAll
);

export const selectCalculatorTabsLength = createSelector(
	selectCalculatorFeature,
	(state) => {
		return state.productionRequests.length;
	}
);

export const selectProductionTabs = createSelector(
	selectCalculatorFeature,
	(state) => {
		return state.productionRequests;
	}
);

export const selectCalculatorCurrentTab = createSelector(
	selectCalculatorFeature,
	selectProductionTabs,
	(state, tabs) => {
		return null !== state.currentRequestIndex ? tabs[state.currentRequestIndex] : null;
	}
);

export const selectCalculatorState = createSelector(
	selectCalculatorFeature,
	selectCalculatorCurrentTab,
	selectProductionTabs,
	selectItemEntities,
	(state, currentTab, tabs, items) => {
		return {
			productionTabs: tabs,
			currentTab: currentTab,
			currentTabIndex: state.currentRequestIndex,
			items: items
		} as ICalculatorState;
	}
);
