import {Component, Input} from '@angular/core';

import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-content',
	template: `<div class="modal-header">
		<button type="button" class="close" (click)="cancel()" aria-hidden="true">&times;</button>
		<h4 class="modal-title">{{ title }}</h4>
	</div>
	<div class="modal-body">
		<form endUserRole="form" class="container-fluid">
			<!-- Search -->
			<div class="row">
				<div class="form-group col-md-12">
					<label class="control-label">{{ message }}</label>
					<input
						type="text" class="form-control" autofocus
						placeholder="{{ resultData}}"
						[(ngModel)]="resultData"
						(keyup.enter)="ok()"
						(keyup.escape)="cancel()"
						name="resultData">
				</div>
			</div>
		</form>
	</div>
	<div class="modal-footer">
		<button *ngIf="okText" type="button" class="btn btn-primary" (click)="ok()">{{okText}}</button>
		<button *ngIf="cancelText" type="button" class="btn" (click)="cancel()">{{cancelText}}</button>
	</div>

	`
})

export class InputBoxDialog {
	@Input() title : string;
	@Input() message : string;
	@Input() resultData : any;
	@Input() okText: string;
	@Input() cancelText: string;

	constructor(public activeModal: NgbActiveModal) {}

	public static open(modalService: NgbModal,
										 title : string,
										 message : string,
										 value : string,
										 okText: string,
										 cancelText: string) : NgbModalRef {
		const modalRef = modalService.open(InputBoxDialog, { backdrop : "static" });
		modalRef.componentInstance.title = title;
		modalRef.componentInstance.message = message;
		modalRef.componentInstance.resultData = value;
		modalRef.componentInstance.okText = okText;
		modalRef.componentInstance.cancelText = cancelText;

		return modalRef;
	}

	ok() {
		this.activeModal.close(this.resultData);
		console.log('OK Pressed');
	}

	cancel() {
		this.activeModal.dismiss('cancel');
		console.log('Cancel Pressed');
	}
}
