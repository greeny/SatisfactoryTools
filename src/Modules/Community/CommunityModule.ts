import {NgModule} from '@angular/core';
import {navigation} from '@modules/Community/navigation';
import {NavigationModule} from '@modules/Navigation';
import {SharedModule} from '@modules/Shared';

@NgModule({
	imports: [
		SharedModule,
		NavigationModule.forChild(navigation)
	]
})
export class CommunityModule
{
}
