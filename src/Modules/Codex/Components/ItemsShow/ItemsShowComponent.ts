import {Component}                                   from '@angular/core';
import {ActivatedRoute}                              from '@angular/router';
import {RecipesDataProvider, SchematicsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IItemAmountSchema}                           from '@src/Schema/IItemAmountSchema';
import {IItemSchema}                                 from '@src/Schema/IItemSchema';
import {IRecipeSchema}                               from '@src/Schema/IRecipeSchema';
import {ISchematicSchema}                            from '@src/Schema/ISchematicSchema';
import {TrackBy}                                     from '@utils/TrackBy';
import {Observable}                                  from 'rxjs';
import {map, withLatestFrom}                         from 'rxjs/operators';

@Component({
    selector:    'sf-codex-item-show',
    templateUrl: './ItemsShowComponent.html'
})
export class ItemsShowComponent
{
    public readonly item$: Observable<IItemSchema>;
    public readonly asIngredientRecipes$: Observable<IRecipeSchema[]>;
    public readonly schematics$: Observable<ISchematicSchema[]>;
    public readonly asProductRecipes$: Observable<IRecipeSchema[]>;
    public readonly buildingRecipes$: Observable<IRecipeSchema[]>;
    private readonly allNonBuildingRecipes$: Observable<IRecipeSchema[]>;
    private readonly allBuildingRecipes$: Observable<IRecipeSchema[]>;
    private readonly allSchematics$: Observable<ISchematicSchema[]>;

    constructor(
        private activatedRoute: ActivatedRoute,
        private recipesProvider: RecipesDataProvider,
        private schematicProvider: SchematicsDataProvider
    )
    {
        this.allSchematics$ = this.schematicProvider.getAll();
        this.item$ = this.activatedRoute.data.pipe(
            map(data => {
                return data.item;
            })
        );
        this.allBuildingRecipes$ = this.recipesProvider.getAll().pipe(
            map((recipes) => {
                return recipes.filter((recipe) => {
                    return true === recipe.forBuilding;
                });
            })
        );
        this.allNonBuildingRecipes$ = this.recipesProvider.getAll().pipe(
            map((recipes) => {
                return recipes.filter((recipe) => {
                    return false === recipe.forBuilding;
                });
            })
        );
        this.asIngredientRecipes$ = this.item$.pipe(
            withLatestFrom(this.allNonBuildingRecipes$),
            map(([item, recipes]) => {
                return this.recipesFilterByItem(recipes, item, 'ingredients');
            })
        );
        this.asProductRecipes$ = this.item$.pipe(
            withLatestFrom(this.allNonBuildingRecipes$),
            map(([item, recipes]) => {
                return this.recipesFilterByItem(recipes, item, 'products');
            })
        );
        this.schematics$ = this.item$.pipe(
            withLatestFrom(this.allSchematics$),
            map(([item, schematics]) => {
                return schematics.filter((schematic) => {
                    return this.filterAmountSchemasByItem(schematic.cost, item).length > 0;
                });
            })
        );
        this.buildingRecipes$ = this.item$.pipe(
            withLatestFrom(this.allBuildingRecipes$),
            map(([item, recipes]) => {
                return this.recipesFilterByItem(recipes, item, 'ingredients');
            })
        );
    }

    public trackByCost = TrackBy.byItemAmountSchema;

    private recipesFilterByItem(recipes: IRecipeSchema[], item: IItemSchema, collectionType: 'ingredients' | 'products'): IRecipeSchema[]
    {
        return recipes.filter((recipe) => {
            return this.filterAmountSchemasByItem(recipe[collectionType], item).length > 0
        });
    }

    private filterAmountSchemasByItem(schemas: IItemAmountSchema[], item: IItemSchema): IItemAmountSchema[]
    {
        return schemas.filter((resource: IItemAmountSchema) => {
            return resource.item === item.className;
        });
    }
}
