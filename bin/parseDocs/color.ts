import {IColorSchema} from '@src/Schema/IColorSchema';

export default function parseColor(color: {
	R: string;
	B: string;
	G: string;
	A: string;
}, convert: boolean = false): IColorSchema
{
	const multiplier = convert ? 255 : 1;
	return {
		r: parseInt('' + parseFloat(color.R) * multiplier),
		g: parseInt('' + parseFloat(color.G) * multiplier),
		b: parseInt('' + parseFloat(color.B) * multiplier),
		a: parseFloat(color.A),
	}
}
