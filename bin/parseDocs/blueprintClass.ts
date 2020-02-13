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
		return parts[parts.length - 1];
	}
	return 'Undefined';
}
