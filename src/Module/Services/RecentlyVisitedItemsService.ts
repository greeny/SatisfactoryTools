export class RecentlyVisitedItemsService
{

	public recent: string[] = [];

	public constructor()
	{
		this.recent = [];
	}

	public addVisited(className: string): void
	{
		const index = this.recent.indexOf(className);
		if (index !== -1) {
			this.recent.splice(index, 1);
		}

		this.recent.unshift(className);
		while (this.recent.length > 8) {
			this.recent.pop();
		}
	}

	public getRecent(): string[]
	{
		return this.recent;
	}

}
