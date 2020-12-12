import {Component, Input}      from '@angular/core';
import {BuildingsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IBuildingSchema}   from '@src/Schema/IBuildingSchema';
import {Observable, of}    from 'rxjs';
import {concatMap, filter} from 'rxjs/operators';

@Component({
    selector: 'sf-renderer-building',
    templateUrl: './BuildingRendererComponent.html'
})
export class BuildingRendererComponent{
    @Input() item: string;
    @Input() showName: boolean = true;
    @Input() showTooltip: boolean = true;
    public readonly item$: Observable<IBuildingSchema>;

    constructor(private buildingProvider: BuildingsDataProvider)
    {
        this.item$ = this.buildingProvider.getAll().pipe(
            concatMap(x => x),
            filter((building) => {
                return this.item === building.className;
            })
        );
    }

}
