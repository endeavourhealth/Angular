import {NgModule} from "@angular/core";
import {ModuleStateService} from "./moduleState.service";
import {EdsErrorHandler} from "./errorHandler.service";

@NgModule({
	providers : [
		ModuleStateService,
		EdsErrorHandler,
	]
})
export class CommonModule {}