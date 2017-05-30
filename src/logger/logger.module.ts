import {NgModule} from "@angular/core";
import {LoggerService} from "./logger.service";
import {Logger} from 'angular2-logger';

@NgModule({
	providers : [
		Logger,
		LoggerService,
	]
})
export class LoggerModule {}