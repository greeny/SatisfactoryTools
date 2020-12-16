import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '@modules/Codex/Service';
import {RecipesDataProvider, SchematicsDataProvider} from '@modules/Codex/Service/DataProvider';
import {Formula} from '@src/Formula';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {IGeneratorSchema} from '@src/Schema/IGeneratorSchema';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {BehaviorSubject, Observable} from 'rxjs';
import {concatMap, filter, map, switchMap} from 'rxjs/operators';

@Component({
	selector:    'sf-codex-building-show',
	templateUrl: './BuildingsShowComponent.html'
})
export class BuildingsShowComponent
{
	public readonly building$: Observable<IBuildingSchema>;
	public readonly recipe$: Observable<IRecipeSchema>;
	public overclock = 100;
	public readonly overclock$ = new BehaviorSubject<number>(this.overclock);

	constructor(
		private activatedRoute: ActivatedRoute,
		private recipesProvider: RecipesDataProvider,
		private schematicProvider: SchematicsDataProvider,
		private dataService: DataService
	)
	{
		this.building$ = this.activatedRoute.data.pipe(
			map(data => {
				return data.entity;
			})
		);

		this.recipe$ = this.building$.pipe(
			switchMap(building => {
				return this.recipesProvider.getAll().pipe(
					concatMap(x => x),
					filter((recipe: IRecipeSchema) => {
						return recipe.products.filter(p => p.item === building.className).length > 0;
					})
				);
			})
		);
	}

	public isBuilding(entity: any): boolean
	{
		return this.dataService.getData().isBuilding(entity);
	}

	public isPowerConsumingBuilding(entity: any): boolean
	{
		return 'powerConsumption' in entity.metadata;
	}

	public isGeneratorBuilding(entity: any): boolean
	{
		return this.dataService.getData().isGeneratorBuilding(entity);
	}

	public isManualManufacturer(entity: any): boolean
	{
		return this.dataService.getData().isManualManufacturer(entity);
	}

	public isManufacturerBuilding(entity: any): boolean
	{
		return this.dataService.getData().isManufacturerBuilding(entity);
	}

	public isExtractorBuilding(entity: any): boolean
	{
		return this.dataService.getData().isExtractorBuilding(entity);
	}

	public isConveyorBuilding(entity: any): boolean
	{
		return 'beltSpeed' in entity.metadata;
	}

	public getGenerator(entity: IBuildingSchema): IGeneratorSchema
	{
		return this.dataService.getData().getRawData().generators[entity.className.replace('Desc', 'Build')];
	}

	public powerProduction(entity: IGeneratorSchema): Observable<number>
	{
		return this.overclock$.pipe(
			map(overclockValue => Formula.calculatePowerGeneratorPowerCapacity(entity, overclockValue))
		);
	}
}
