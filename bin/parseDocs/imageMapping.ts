export default function parseImageMapping(value: {
	ClassName: string
	mPersistentBigIcon: string;
}[]): {
	className: string,
	image: string,
}[]
{
	const result = [];
	for (const item of value) {
		if (item.mPersistentBigIcon && item.mPersistentBigIcon !== 'None') {
			result.push({
				className: item.ClassName,
				image: item.mPersistentBigIcon.replace('Texture2D\'', '').replace('\'', '').replace(/\..*/, '.png'),
			});
		}
	}
	return result;
}
