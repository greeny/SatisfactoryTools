interface IClassName {
	className: string;
}

export class TrackBy {
	public static byClassName(index: number, item: IClassName): string {
		return item.className;
	}
}
