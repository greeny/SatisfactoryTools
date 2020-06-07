import angular, {IWindowService} from 'angular';

export class DataStorageService
{

	public static $inject = ['$window'];

	public constructor(private readonly $window: IWindowService) {}

	public saveData(key: string, data: any)
	{
		this.$window.localStorage.setItem(key, angular.toJson(data));
	}

	public loadData(key: string, def: any)
	{
		const item = this.$window.localStorage.getItem(key);
		return item === null ? def : angular.fromJson(item);
	}

}
