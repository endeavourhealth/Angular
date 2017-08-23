import {Component, Input} from "@angular/core";

@Component({
	selector : 'loadingIndicator',
	template : `<div class="loading" [hidden]="done">
		<div class="loadingCaption"><i class="fa fa-spinner fa-spin"></i> {{text}}</div>
	</div>
	<div [hidden]="!done"><ng-content></ng-content></div>`
})
export class LoadingIndicatorComponent {
	@Input() text : string = 'Loading...';
	@Input() done : any;
}