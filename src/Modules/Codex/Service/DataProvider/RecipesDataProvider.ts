import {Injectable} from '@angular/core';
import {DataService} from '@modules/Codex/Service';
import {IRecipeSchema} from '@src/Schema/IRecipeSchema';
import {IDataProvider} from '@src/Types/IDataProvider';
import {Observable, of} from 'rxjs';

@Injectable()
export class RecipesDataProvider implements IDataProvider<IRecipeSchema>
{
	constructor(private dataService: DataService)
	{
	}

	public getAll(): Observable<IRecipeSchema[]>
	{
		return of(
			Object.values(this.dataService.getData().getAllRecipes())
		);
	}
}
