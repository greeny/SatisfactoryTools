import {Injectable} from '@angular/core';
import {Data} from '@src/Data/Data';

@Injectable()
export class DataService
{
	private data: Data;

	public getData(): Data
	{
		if (!this.data) {
			this.data = new Data();
		}
		return this.data;
	}
}
