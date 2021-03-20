import {Component, Input} from '@angular/core';
import {AbstractRenderer} from '@modules/Codex/Components/Renderer/AbstractRenderer';
import {BuildingsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';
import {Observable} from 'rxjs';
import {concatMap, filter} from 'rxjs/operators';

@Component({
	selector:    'sf-renderer-building',
	templateUrl: './BuildingRendererComponent.html'
})
export class BuildingRendererComponent extends AbstractRenderer<IBuildingSchema>
{	@Input() item: string;
	@Input() showName: boolean = true;
	@Input() showTooltip: boolean = true;
	constructor(protected provider: BuildingsDataProvider)
	{
		super(provider)
    }

}
