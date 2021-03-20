import {Injectable} from '@angular/core';
import {AbstractResolver} from '@modules/Codex/Resolver/AbstractResolver';
import {BuildingsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IBuildingSchema} from '@src/Schema/IBuildingSchema';

@Injectable()
export class BuildingResolver extends AbstractResolver<IBuildingSchema>
{
	constructor(protected provider: BuildingsDataProvider)
	{
		super(provider);
	}
}
