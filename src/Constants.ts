export class Constants
{
	public static STACK_SIZE: { [key: string]: number } = {
		ONE: 1,
		SMALL: 50,
		MEDIUM: 100,
		BIG: 200,
		LARGE: 500,
	};

	public static PHYSICAL_STATE: { [key: string]: string } = {
		SOLID: 'solid',
		LIQUID: 'liquid',
	};

	public static PRODUCTION_TYPE: { PER_MINUTE: string, MAXIMIZE: string } = {
		PER_MINUTE: 'perMinute',
		MAXIMIZE: 'max',
	};

	public static WORKBENCH_CLASSNAME = 'Desc_WorkBench_C';
	public static WORKSHOP_CLASSNAME = 'Desc_Workshop_C';
	public static WATER_EXTRACTOR_CLASSNAME = 'Desc_WaterPump_C';
	public static WATER_CLASSNAME = 'Desc_Water_C';
	public static NUCLEAR_WASTE_CLASSNAME = 'Desc_NuclearWaste_C';
	public static NUCLEAR_FUEL_ROD_CLASSNAME = 'Desc_NuclearFuelRod_C';
	public static GEOTHERMAL_GENERATOR_CLASSNAME = 'Build_GeneratorGeoThermal_C';

	public static RESOURCE_MULTIPLIER_IMPURE = 0.5;
	public static RESOURCE_MULTIPLIER_NORMAL = 1;
	public static RESOURCE_MULTIPLIER_PURE = 2;
}

export type STACK_SIZE_ONE = 1;
export type STACK_SIZE_SMALL = 50;
export type STACK_SIZE_MEDIUM = 100;
export type STACK_SIZE_BIG = 200;
export type STACK_SIZE_LARGE = 500;

export type RESOURCE_PURITY_IMPURE = 'impure';
export type RESOURCE_PURITY_NORMAL = 'normal';
export type RESOURCE_PURITY_PURE = 'pure';

export type PHYSICAL_STATE_SOLID = 'solid';
export type PHYSICAL_STATE_LIQUID = 'liquid';

export type STACK_SIZES = STACK_SIZE_ONE|STACK_SIZE_SMALL|STACK_SIZE_MEDIUM|STACK_SIZE_BIG|STACK_SIZE_LARGE;
export type PHYSICAL_STATES = PHYSICAL_STATE_SOLID|PHYSICAL_STATE_LIQUID;
export type RESOURCE_PURITY = RESOURCE_PURITY_IMPURE|RESOURCE_PURITY_NORMAL|RESOURCE_PURITY_PURE;
