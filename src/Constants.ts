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

	public static RESOURCE_AMOUNTS = {
		Desc_OreIron_C: 70380,
		Desc_OreCopper_C: 28860,
		Desc_Stone_C: 52860,
		Desc_Coal_C: 30900,
		Desc_OreGold_C: 11040,
		Desc_LiquidOil_C: 7500,
		Desc_RawQuartz_C: 10500,
		Desc_Sulfur_C: 6840,
		Desc_OreBauxite_C: 7800,
		Desc_OreUranium_C: 1800,
		Desc_Water_C: Number.MAX_SAFE_INTEGER,
	};

	public static RESOURCE_WEIGHTS = {
		Desc_OreIron_C: 3.257,
		Desc_OreCopper_C: 7.944,
		Desc_Stone_C: 4.337,
		Desc_Coal_C: 7.419,
		Desc_OreGold_C: 20.766,
		Desc_LiquidOil_C: 30.568,
		Desc_RawQuartz_C: 20.324,
		Desc_Sulfur_C: 33.518,
		Desc_OreBauxite_C: 29.392,
		Desc_OreUranium_C: 127.367,
		Desc_Water_C: 0,
	};

	public static WORKBENCH_CLASSNAME = 'Desc_WorkBench_C';
	public static WORKSHOP_CLASSNAME = 'Desc_Workshop_C';
	public static WATER_EXTRACTOR_CLASSNAME = 'Desc_WaterPump_C';
	public static WATER_CLASSNAME = 'Desc_Water_C';
	public static NUCLEAR_WASTE_CLASSNAME = 'Desc_NuclearWaste_C';
	public static NUCLEAR_FUEL_ROD_CLASSNAME = 'Desc_NuclearFuelRod_C';

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
