import {Component, Input} from '@angular/core';
import {AbstractRenderer} from '@modules/Codex/Components/Renderer/AbstractRenderer';
import {ItemsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IItemSchema} from '@src/Schema/IItemSchema';

@Component({
	selector:    'sf-renderer-item',
	templateUrl: './ItemRendererComponent.html'
})
export class ItemRendererComponent extends AbstractRenderer<IItemSchema>
{
	@Input() item: string;
	@Input() showName: boolean = true;
	@Input() showTooltip: boolean = true;

	constructor(protected provider: ItemsDataProvider)
	{
		super(provider);
	}

}
