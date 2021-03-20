import {IDiffSchema} from '@src/Utils/DiffGenerator/IDiffSchema';

export class DiffFormatter
{

	public static diffToMarkdown(diffs: IDiffSchema[], limit: number = 2000): string
	{
		//console.log(diffs);
		const parts: string[] = [];
		let part = '';
		let text = '';
		for (const diff of diffs) {
			if (diff.changes.length === 1) {
				text = '- ' + (diff.name === null ? '' : diff.name + ': ') + diff.changes[0];
			} else {
				text = '**' + diff.name + '**:\n\t' + diff.changes.join('\n\t');
				//console.log(text);
			}

			if ((part + text + '\n').length >= limit - 10) {
				parts.push(part);
				part = '';
			}
			part += text + '\n';
		}
		parts.push(part);
		return parts.join('\n=====\n');
	}

}
