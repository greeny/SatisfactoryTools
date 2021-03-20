import {Injectable} from '@angular/core';
import {DataService} from '@modules/Codex/Service';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {IDataProvider} from '@src/Types/IDataProvider';
import {Observable, of} from 'rxjs';

@Injectable()
export class ItemsDataProvider implements IDataProvider<IItemSchema> {
	private cache: IItemSchema[];
	private cacheKV: { [key: string]: IItemSchema };

	constructor(private dataService: DataService) {
	}

	public getAll(): Observable<IItemSchema[]> {
		return of(
			this.getAllArray()
		);
	}

	public getAllArray(): IItemSchema[] {
		if (!this.cacheKV) {
			this.cacheKV = this.dataService.getData().getAllItems();
		}
		if (!this.cache) {
			this.cache = Object.values(this.cacheKV)
		}

		return this.cache;
	}

	public getByClassName(className: string): IItemSchema | null {
		return this.cacheKV.hasOwnProperty(className) ? this.cacheKV[className] : null;
	}
}
