import {Component, Input} from '@angular/core';

import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'ngbd-modal-content',
	template: `<div class="modal-header">
		<button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
			<span aria-hidden="true">&times;</span>
		</button>
		<h4 class="modal-title">{{title}}</h4>
	</div>
	<div class="modal-body">
		{{message}}
	</div>
	<div class="modal-footer">
		<button *ngIf="cancelText" type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">{{cancelText}}</button>
		<button *ngIf="okText" type="button" class="btn btn-primary" (click)="activeModal.close()">{{okText}}</button>
	</div>
	`
})
export class MessageBoxDialog {
	@Input() title;
	@Input() message;
	@Input() okText;
	@Input() cancelText;

	constructor(public activeModal: NgbActiveModal) {}

	public static open(modalService: NgbModal,
											title : string,
											message : string,
											okText : string,
											cancelText : string) : NgbModalRef {
		return MessageBoxDialog.openWithSize(modalService, title, message, okText, cancelText, 'sm');
	}

	public static openLarge(modalService: NgbModal,
											title : string,
											message : string,
											okText : string,
											cancelText : string) : NgbModalRef {
		return MessageBoxDialog.openWithSize(modalService, title, message, okText, cancelText, 'lg');
	}

	private static openWithSize(modalService: NgbModal,
										title : string,
										message : string,
										okText : string,
										cancelText : string,
										size : 'sm' | 'lg') {
		const modalRef = modalService.open(MessageBoxDialog, { backdrop : "static", size: size});
		modalRef.componentInstance.title = title;
		modalRef.componentInstance.message = message;
		modalRef.componentInstance.okText = okText;
		modalRef.componentInstance.cancelText = cancelText;

		return modalRef;
	}


}