import {IOnInit, ITimeoutService} from 'angular';
import {BuildingFiltersService} from '@src/Module/Services/BuildingFiltersService';

export class BuildingFilterController implements IOnInit
{

	public static $inject = ['BuildingFiltersService', '$timeout'];

	public constructor(public filtersService: BuildingFiltersService, private $timeout: ITimeoutService)
	{
	}

	public $onInit(): void
	{
		this.$timeout(() => {
			document.getElementById('queryInput')?.focus();
		});
	}

}
