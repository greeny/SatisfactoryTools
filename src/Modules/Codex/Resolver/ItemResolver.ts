import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AbstractResolver} from '@modules/Codex/Resolver/AbstractResolver';
import {ItemsDataProvider} from '@modules/Codex/Service/DataProvider';
import {IItemSchema} from '@src/Schema/IItemSchema';
import {Observable} from 'rxjs';
import {concatMap, filter} from 'rxjs/operators';

@Injectable()
export class ItemResolver extends AbstractResolver<IItemSchema>
{
	constructor(protected provider: ItemsDataProvider)
	{
		super(provider);
	}
}
