import {PHYSICAL_STATES, STACK_SIZES} from '@src/Constants';

export interface IItemFilterSet
{

	showAdvanced: boolean;
	query: string;
	onlyRadioactive: boolean;
	onlyWithEnergyValue: boolean;
	stackSize: STACK_SIZES | null;
	physicalState: PHYSICAL_STATES | null;

}
