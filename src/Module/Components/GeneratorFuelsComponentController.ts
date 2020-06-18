import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import data from '@src/Data/Data';
import {IOnInit} from 'angular';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Constants} from '@src/Constants';
import {ComponentOptionsService} from '@src/Module/Services/ComponentOptionsService';

export class GeneratorFuelsComponentController implements IOnInit
{

	public building: IBuildingSchema;
	public generator: IGeneratorSchema;
	public fuels: IItemSchema[];

	public static $inject = ['ComponentOptionsService'];

	public constructor(public options: ComponentOptionsService)
	{

	}

	public getGenerator(className: string): IGeneratorSchema
	{
		return data.getRawData().generators[className.replace('Desc', 'Build')];
	}

	public $onInit(): void
	{
		this.generator = this.getGenerator(this.building.className);
		this.fuels = this.getGenerator(this.building.className).fuel.map((fuel: string) => {
			return data.getRawData().items[fuel];
		});
	}

	public calculateFuelConsumption(fuel: IItemSchema): number
	{
		return (((this.generator.powerProduction / fuel.energyValue) * 60) / (fuel.liquid ? 1000 : 1)) * (this.options.overclock / 100);
	}

	public calculateWaterConsumption(): number
	{
		return ((60 * (this.generator.powerProduction * this.generator.waterToPowerRatio)) / 1000) * (this.options.overclock / 100);
	}

	public calculateWasteProduction(): number
	{
		return 5 * (this.options.overclock / 100);
	}

	public getWater(): IItemSchema
	{
		return data.getRawData().items[Constants.WATER_CLASSNAME];
	}

	public getWaste(): IItemSchema
	{
		return data.getRawData().items[Constants.NUCLEAR_WASTE_CLASSNAME];
	}

	public getNuclearFuelRod(): IItemSchema
	{
		return data.getRawData().items[Constants.NUCLEAR_FUEL_ROD_CLASSNAME];
	}

}
