import {Component, Input} from "@angular/core";
import {NgbModal, NgbActiveModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'ngbd-modal-content',
    template: `
        <div class="modal-header">
            <button type="button" class="close" (click)="cancel()" aria-hidden="true">&times;</button>
            <h4 class="modal-title">{{type}} Details</h4>
        </div>
        <div class="modal-body">
            <form endUserRole="form" class="container-fluid">
                <div class="row">
                    <div class="form-group col-md-12">
                        <h2>{{item[primaryProperty]}}</h2>
                    </div>
                </div>
                <div class="row">
                    <div *ngFor="let detail of detailsToShow">
                        <div *ngIf="!detail.document" class="col-md-12">
                            <b>{{detail.label}} : </b>{{item[detail.property]}}
                        </div>
                        <div class="col-md-12">
                            <pdf-viewer *ngIf="detail.document" 
                                        [src]="item[detail.property]"
                                        [page]="page"
                                        [original-size]="false"
                                        [render-text]="true"
                                        [show-all]="true"
                                        style="display: block;"
                            ></pdf-viewer>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn"
                    (click)="cancel()">Close</button>
            <button type="button" class="btn btn-primary"
                    (click)="ok();">View Full Details</button>
        </div>
    `

})
export class EntityDetailsDialog {
    @Input() item : any;
    @Input() detailsToShow : any[];
    @Input() primaryProperty : string;
    @Input() type : string;

    page : number = 1;

    public static open(modalService: NgbModal,
                       item : any,
                       detailsToShow : any[],
                       primaryProperty : string,
                       type : string) : NgbModalRef {
        const modalRef = modalService.open(EntityDetailsDialog, { backdrop : "static"});
        modalRef.componentInstance.item = item;
        modalRef.componentInstance.detailsToShow = detailsToShow;
        modalRef.componentInstance.primaryProperty = primaryProperty;
        modalRef.componentInstance.type = type;

        return modalRef;
    }

    constructor(public activeModal: NgbActiveModal) {}

    ok() {
        this.activeModal.close(true);
    }

    cancel() {
        this.activeModal.dismiss(false);
    }
}
