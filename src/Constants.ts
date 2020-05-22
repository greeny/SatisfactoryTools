export class Constants
{
	public static STACK_SIZE: {[key: string]: number} = {
		ONE: 1,
		SMALL: 50,
		MEDIUM: 100,
		BIG: 200,
		LARGE: 500,
	};

	public static PHYSICAL_STATE: {[key: string]: string} = {
		SOLID: 'solid',
		LIQUID: 'liquid',
	};
}

export type STACK_SIZE_ONE = 1;
export type STACK_SIZE_SMALL = 50;
export type STACK_SIZE_MEDIUM = 100;
export type STACK_SIZE_BIG = 200;
export type STACK_SIZE_LARGE = 500;

export type PHYSICAL_STATE_SOLID = 'solid';
export type PHYSICAL_STATE_LIQUID = 'liquid';

export type STACK_SIZES = STACK_SIZE_ONE|STACK_SIZE_SMALL|STACK_SIZE_MEDIUM|STACK_SIZE_BIG|STACK_SIZE_LARGE;
export type PHYSICAL_STATES = PHYSICAL_STATE_SOLID|PHYSICAL_STATE_LIQUID;
