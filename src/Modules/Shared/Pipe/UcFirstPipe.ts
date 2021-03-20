import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'ucfirst'
})
export class UcFirstPipe implements PipeTransform
{
	public transform(value: string): string
	{
		return value.charAt(0).toUpperCase() + value.slice(1)
	}
}
