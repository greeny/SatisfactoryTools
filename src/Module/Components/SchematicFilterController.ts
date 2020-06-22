import {IOnInit, ITimeoutService} from 'angular';
import {SchematicFiltersService} from '@src/Module/Services/SchematicFiltersService';

export class SchematicFilterController implements IOnInit
{

	public static $inject = ['SchematicFiltersService', '$timeout'];

	public constructor(public filtersService: SchematicFiltersService, private $timeout: ITimeoutService)
	{
	}

	public $onInit(): void
	{
		this.$timeout(() => {
			document.getElementById('queryInput')?.focus();
		});
	}

}
