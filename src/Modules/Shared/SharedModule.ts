import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ItemIconComponent} from '@modules/Shared/Components';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TooltipModule} from 'ngx-bootstrap/tooltip';

@NgModule({
	declarations: [
		ItemIconComponent
	],
	imports:      [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CommonModule,
		BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),
		CollapseModule.forRoot(),
		FlexLayoutModule,
		// PerfectScrollbarModule,
		FormsModule,
		ReactiveFormsModule
		// LaddaModule
	],
	exports:      [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CommonModule,
		BsDropdownModule,
		TooltipModule,
		CollapseModule,
		FlexLayoutModule,
		// PerfectScrollbarModule,
		FormsModule,
		ReactiveFormsModule,
		// LaddaModule
		ItemIconComponent
	]
})
export class SharedModule
{

}
