import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {InlineEditorComponent} from "./inlineEdit.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {LoadingIndicatorComponent} from "./loadingIndicator.component";
import {Autofocus} from "./focus.directive";
// import {MultiSelectDropdownComponent} from './multiSelectDropdown.component';

@NgModule({
	imports:[
		BrowserModule,
		FormsModule,
		NgbModule
	],
	declarations:[
		InlineEditorComponent,
		LoadingIndicatorComponent,
		Autofocus,
        // MultiSelectDropdownComponent
	],
	exports:[
		InlineEditorComponent,
		LoadingIndicatorComponent,
		Autofocus,
        // MultiSelectDropdownComponent
	]
})
export class ControlsModule {}