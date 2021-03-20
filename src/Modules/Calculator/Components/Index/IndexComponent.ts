import {Component, OnDestroy, OnInit} from "@angular/core";
import {BehaviorSubject, combineLatest, Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {ProductionTabFactory} from "@modules/Calculator/Service/ProductionTabFactory";
import {IProductionTab} from "@modules/Calculator/Model/IProductionTab";
import {Objects} from "@utils/Objects";
import {ProductionPersistentStorage} from "@modules/Calculator/Service/ProductionPersistentStorage";

@Component({
	templateUrl: './IndexComponent.html',
	styleUrls: []
})
export class IndexComponent implements OnInit, OnDestroy {
	public tabs: BehaviorSubject<any[]> = new BehaviorSubject([]);
	public activeTabIndex: BehaviorSubject<number> = new BehaviorSubject(0);
	public activeTab: Observable<IProductionTab | null>;
	private subscription: Subscription[] = [];

	constructor(private persistentStorage: ProductionPersistentStorage) {
		this.activeTab = combineLatest([this.tabs, this.activeTabIndex]).pipe(
			map(([tabs, index]) => tabs[index])
		);
	}

	public changeActiveTab(index: number): void {
		this.activeTabIndex.next(index);
	}

	public addTab(): void {
		this.emitTabUpdate(ProductionTabFactory.create());
	}

	cloneTab() {
		const tab = this.tabs.getValue()[this.activeTabIndex.getValue()];
		this.emitTabUpdate  (Objects.deepCopy(tab));
	}

	public onTabChanged(): void{
		let tabs = this.tabs.getValue();
		this.tabs.next(tabs);
	}

	public removeTab(): void {
		let tabs = this.tabs.getValue();
		tabs.splice(this.activeTabIndex.getValue(), 1);

		this.tabs.next(
			tabs
		);
		this.activeTabIndex.next(
			tabs.length - 1
		);
	}

	private emitTabUpdate(tab: IProductionTab): void {
		let tabs = this.tabs.getValue();
		tabs.push(tab);
		this.tabs.next(tabs);
		this.changeActiveTab(tabs.length - 1);
	}

	ngOnDestroy(): void {
		this.subscription.forEach(s => s.unsubscribe());
	}

	ngOnInit(): void {
		this.tabs.next(this.persistentStorage.load());
		this.subscription.push(this.tabs.subscribe(r => this.persistentStorage.update(r)));
	}
}
