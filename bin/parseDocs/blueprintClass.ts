export default function parseBlueprintClass(blueprint: string): string
{
	if (blueprint === null) {
		return '';
	}
	let match = blueprint.match(/"(.*?)"/);
	if (!match) {
		match = ['', blueprint];
	}
	if (match) {
		const parts = match[1].split('.');
		const name = parts[parts.length - 1];
		if (name[name.length - 1] === "'") {
			return name.slice(0, -1);
		}
		return name;
	}
	return 'Undefined';
}
