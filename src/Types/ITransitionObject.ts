import {Ng1StateDeclaration} from 'angular-ui-router';

export interface ITransitionObject<T>
{

	abort: () => void;
	to: () => Ng1StateDeclaration;
	params(): T;

}
