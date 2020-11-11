import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import data from '@src/Data/Data';
import {ComponentOptionsService} from '@src/Module/Services/ComponentOptionsService';
import {Constants} from '@src/Constants';

export class GeneratorDetailsComponentController
{

	public building: IBuildingSchema;

	public static $inject = ['ComponentOptionsService'];

	public constructor(public options: ComponentOptionsService)
	{

	}

	public get generator(): IGeneratorSchema
	{
		return this.getGenerator(this.building.className);
	}

	public get powerProduction(): number|undefined
	{
		return this.generator.powerProduction * Math.pow(this.options.overclock / 100, 1 / this.generator.powerProductionExponent);
	}

	public getGenerator(className: string): IGeneratorSchema
	{
		return data.getRawData().generators[className.replace('Desc', 'Build')];
	}

	public get canBeOverclocked(): boolean
	{
		return this.generator.className !== Constants.GEOTHERMAL_GENERATOR_CLASSNAME;
	}

}
