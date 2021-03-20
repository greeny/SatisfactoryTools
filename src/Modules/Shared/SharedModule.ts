import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
	ItemIconComponent,
	ItemResourceMaxComponent,
	ItemSelectComponent,
	RepeatTypeComponent
} from '@modules/Shared/Components';
import {IsOverclockablePipe} from '@modules/Shared/Pipe/IsOverclockablePipe';
import {UcFirstPipe} from '@modules/Shared/Pipe/UcFirstPipe';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {FormlyModule} from "@ngx-formly/core";
import {FormlyBootstrapModule} from "@ngx-formly/bootstrap";
import {DropdownModule} from 'primeng/dropdown';
import {NgxLocalStorageModule} from "ngx-localstorage";

@NgModule({
	declarations: [
		ItemIconComponent,
		IsOverclockablePipe,
		ItemSelectComponent,
		UcFirstPipe,
		RepeatTypeComponent,
		ItemResourceMaxComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		ReactiveFormsModule,
		FormlyModule.forRoot({
			types: [
				{name: 'repeat', component: RepeatTypeComponent},
				{name: 'item-select', component: ItemSelectComponent},
				{name: 'resource-max', component: ItemResourceMaxComponent},
			]
		}),
		FormlyBootstrapModule,
		CommonModule,
		DropdownModule,
		BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),
		CollapseModule.forRoot(),
		NgxLocalStorageModule.forRoot(),
		FlexLayoutModule,
		// PerfectScrollbarModule,
		FormsModule,
		ReactiveFormsModule
		// LaddaModule
	],
	exports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CommonModule,
		BsDropdownModule,
		TooltipModule,
		CollapseModule,
		NgxLocalStorageModule,
		FlexLayoutModule,
		// PerfectScrollbarModule,
		FormsModule,
		ReactiveFormsModule,
		// LaddaModule
		ItemIconComponent,
		IsOverclockablePipe,
		UcFirstPipe,
		FormlyModule,
		FormlyBootstrapModule
	]
})
export class SharedModule {

}
