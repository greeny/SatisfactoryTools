import {Injectable}     from '@angular/core';
import {DataService}    from '@modules/Codex/Service';
import {IRecipeSchema}  from '@src/Schema/IRecipeSchema';
import {Observable, of} from 'rxjs';

@Injectable()
export class RecipesDataProvider {
    constructor(private dataService: DataService) {
    }

    public getAll(): Observable<IRecipeSchema[]> {
        return of(
            Object.values(this.dataService.getData().getAllRecipes())
        );
    }
}
