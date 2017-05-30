import {Component, EventEmitter, forwardRef, Input, Output} from "@angular/core";
import {StateService} from "ui-router-ng2";
import {EntityDetailsDialog} from "./entityDetails.dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector : 'entity-viewer',
    template : `
        <div *ngIf="items?.length == 0">
            <div class="col-md-12">
                <p>There are no associated {{typeDescription|lowercase}}s</p>
            </div>
        </div>
        <div class="row" *ngIf="items?.length > 0">
            <div class="col-md-6">
                <div class="input-group">
                    <span class="input-group-addon" id="searchOrg">Search</span>
                    <input type="text" class="form-control" placeholder="" [(ngModel)]="filterText" [value]="filterText" name="filterText">
                </div>
            </div>
            <div class="col-md-3">
                <div class="input-group">
                    <span class="input-group-addon" id="orderOrg">Order</span>
                    <select #selectedOrder class="form-control" (change)="orderChange(selectedOrder.value)">
                        <option *ngFor="let o of orderList" [value]="o.id" [selected]="o.id == 0">{{o.name}}</option>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="input-group">
                    <span class="input-group-addon" id="pageSize">Items Per Page</span>
                    <select #selectedPageSize class="form-control" (change)="pageSizeChange(selectedPageSize.value)">
                        <option *ngFor="let ps of pageSizeList" [value]="ps" [selected]="ps.id == 0">{{ps}}</option>
                    </select>
                </div>
            </div>
        </div>
        <br>
        <div class="row">
            <div *ngFor="let item of items | entityFilterPipe:filterText: primary : secondary | orderBy : orderField: reverseOrder | paginate: {id: typeDescription, itemsPerPage: pageSize, currentPage: p } ">                
                <div class="col-md-3">
                    <div [ngClass]="displayClass">
                        <a (click)="viewItemDetails(item)">
                        <span><b>{{item[primary]}}</b><br><p *ngIf="secondary">{{item[secondary]}}<p></span>
                        </a>
                        <div *ngIf="allowDelete" class="input-group-btn">
                            <button class="btn btn-danger btn-xs child-to-show pull-right" type="button" (click)="delete(item)"><i class="fa fa-remove text-danger"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <pagination-controls [id]="typeDescription" (pageChange)="p = $event" autoHide="true"></pagination-controls>
            </div>
        </div>
    `
})
export class EntityViewer {
    @Input() items : any[] = [];
    @Input() typeDescription : string = '';
    @Input() model : string = '';
    @Input() primary : string = 'name';
    @Input() primaryOrderText : string = this.primary;
    @Input() detailsToShow : any[] = [];
    @Input() displayClass : string = 'region';
    @Input() secondary : string;
    @Input() secondaryOrderText : string = this.secondary;
    @Input() pageSize : number = 12;
    @Input() allowDelete : boolean = false;

    @Output() deleted: EventEmitter<string> = new EventEmitter<string>();

    delete(item : any) {
        this.deleted.next(item);

    }

    public filterText : string = "";
    p : number = 1;
    orderField : string = 'name';
    reverseOrder : boolean = false;
    orderList = [];
    pageSizeList = [];
    order = this.orderList[0];

    constructor (protected $state : StateService,
                 private $modal: NgbModal){

    };

    ngOnChanges(changes) {
        var vm = this;
        if (vm.items) {
            vm.populatePageSize();
            vm.populateOrderList();
        }
    }

    populatePageSize(){
        var vm = this;
        var i : number;
        vm.pageSizeList = [];
        if (vm.items.length <= vm.pageSize) {
            vm.pageSizeList.push('All');
        }
        else {
            for (i = vm.pageSize; i <= vm.items.length; i = i + vm.pageSize) {
                if (vm.items.length > i)
                    this.pageSizeList.push(i);
                if ((vm.items.length - i) < vm.pageSize ) {
                    this.pageSizeList.push('All');
                }

            }
        }
    }

    populateOrderList() {
        this.orderList = [
            {id: 0, name: this.primaryOrderText + " asc"},
            {id: 1, name: this.primaryOrderText + " desc"},
        ];

        if (this.secondary) {
            this.orderList.push({id: 2, name: this.secondaryOrderText + " asc"});
            this.orderList.push({id: 3, name: this.secondaryOrderText + " desc"});
        }
    }

    editItem(item : any) {
        var vm = this;
        console.log(vm.model);
        switch (vm.model.toLowerCase()) {
            case "organisation": {
                this.$state.go('app.organisationManagerEditor', {itemUuid: item.uuid, itemAction: 'edit'});
                break;
            }
            case "region" : {
                this.$state.go('app.regionEditor', {itemUuid: item.uuid, itemAction: 'edit'});
                break;
            }
            case "dataflow" : {
                this.$state.go('app.dataFlowEditor', {itemUuid: item.uuid, itemAction: 'edit'});
                break;
            }
            case "dsa" : {
                this.$state.go('app.dsaEditor', {itemUuid: item.uuid, itemAction: 'edit'});
                break;
            }
            case "dpa" : {
                this.$state.go('app.dpaEditor', {itemUuid: item.uuid, itemAction: 'edit'});
                break;
            }
            case "datasharingsummary" : {
                this.$state.go('app.dataSharingSummaryEditor', {itemUuid: item.uuid, itemAction: 'edit'});
                break;
            }
        }
    }

    orderChange(value): void {
        if (value == '0') {
            this.orderField = this.primary;
            this.reverseOrder = false;
        }
        if (value == '1') {
            this.orderField = this.primary;
            this.reverseOrder = true;
        }
        if (value == '2') {
            this.orderField = this.secondary;
            this.reverseOrder = false;
        }
        if (value == '3') {
            this.orderField = this.secondary;
            this.reverseOrder = true;
        }
    }

    pageSizeChange(value){
        if (value == 'All')
            this.pageSize = this.items.length;
        else {
            this.pageSize = value;
        }
    }

    private viewItemDetails(item : any) {
        var vm = this;
        EntityDetailsDialog.open(vm.$modal, item, vm.detailsToShow, vm.primary, vm.typeDescription)
            .result.then(function
                (result: boolean) {
                if (result == true){
                    vm.editItem(item);
                }
            }
        );
    }
}
