import {IProductionData} from '@src/Tools/Production/IProductionData';
import * as pako from 'pako';
import {Strings} from '@src/Utils/Strings';
import {ProductionTab} from '@src/Tools/Production/ProductionTab';

export class FileExporter
{

	private static version = '0';

	public static exportTabs(tabs: ProductionTab[]): string
	{
		const data: {type: string, tabs: IProductionData[]} = {
			type: 'tabs',
			tabs: []
		};

		let info = '';

		for (const tab of tabs) {
			data.tabs.push(tab.data);
			info += '# - ' + tab.name + '\n';
		}

		let result = '# Satisfactory Tools export (version 1)\n\n# Contains these production lines:\n' + info + '\n';

		result += FileExporter.version + Strings.base64encode(Strings.bufferToString(pako.deflate(JSON.stringify(data))));

		result += '\n\n# Exported on ' + new Date().toISOString() + '\n';

		return result;
	}

	public static importTabs(data: string): IProductionData[]
	{
		data = data.split('\n').map((line) => line.trim()).filter((line) => line !== '' && line.charAt(0) !== '#').join();

		const version = data.charAt(0);
		if (version !== FileExporter.version) {
			throw new Error('Invalid version specified: ' + version);
		}
		const parsed = JSON.parse(pako.inflate(Strings.stringToBuffer(Strings.base64decode(data.substring(1))), {to: 'string'}))

		if (parsed.type !== 'tabs') {
			throw new Error('Invalid file type');
		}

		return parsed.tabs;
	}


}
