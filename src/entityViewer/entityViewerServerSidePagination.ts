import {Component, EventEmitter, forwardRef, Input, Output} from "@angular/core";
import {StateService} from "ui-router-ng2";
import {EntityDetailsDialog} from "./entityDetails.dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector : 'entity-viewer-ssp',
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
                    <input type="text" class="form-control" placeholder="" [(ngModel)]="filterText" [value]="filterText" name="filterText" (keyup.enter)="findEntities()">
                </div>
            </div>
            <div class="col-md-3">
                <div class="input-group">
                    <span class="input-group-addon" id="orderOrg">Order</span>
                    <select #selectedOrder class="form-control" [(ngModel)]="order" name="order" (change)="orderChange()">
                        <option *ngFor="let o of orderList" [ngValue]="o">{{o.name}}</option>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="input-group">
                    <span class="input-group-addon" id="pageSize">Items Per Page</span>
                    <select #selectedPageSize class="form-control" [(ngModel)]="pageSize" name="pageSize" (change)="pageSizeChange(selectedPageSize.value)">
                        <option *ngFor="let ps of pageSizeList" [ngValue]="ps">{{ps}}</option>
                    </select>
                </div>
            </div>
        </div>
        <br>
        <div class="row">
            <div *ngFor="let item of items">
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
                <ngb-pagination [collectionSize]="totalItems" [(page)]="pageNumber" [maxSize]="20" [pageSize]="pageSize" [boundaryLinks]="true" (pageChange)="pageChanged($event)"></ngb-pagination>
            </div>
        </div>
    `
})
export class EntityViewerServerSidePagination {
    @Input() items : any[] = [];
    @Input() totalItems : number;
    @Input() typeDescription : string = '';
    @Input() model : string = '';
    @Input() primary : string = 'name';
    @Input() primaryOrderText : string = this.primary;
    @Input() detailsToShow : any[] = [];
    @Input() displayClass : string = 'region';
    @Input() secondary : string;
    @Input() secondaryOrderText : string = this.secondary;
    @Input() pageSize : number = 12;
    @Input() pageNumber : number = 1;
    @Input() maxPageSize : number = 48;
    @Input() allowDelete : boolean = false;

    @Output() deleted: EventEmitter<string> = new EventEmitter<string>();
    @Output() onPageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() onPageSizeChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() search: EventEmitter<string> = new EventEmitter<string>();
    @Output() onOrderChange: EventEmitter<any> = new EventEmitter<any>();

    delete(item : any) {
        this.deleted.next(item);

    }

    pageChanged($event) {
        this.onPageChange.next($event);
        this.pageNumber = $event;
    }

    findEntities() {
        this.search.next(this.filterText);
    }

    public filterText : string = "";
    p : number = 1;
    orderList = [];
    pageSizeList = [];
    order : any;

    constructor (protected $state : StateService,
                 private $modal: NgbModal){
    };

    ngOnChanges(changes) {
        var vm = this;
        if (vm.items) {
            vm.populatePageSize();
            if (vm.orderList.length == 0)
                vm.populateOrderList();
        }
    }

    populatePageSize(){
        var vm = this;
        var i : number;
        vm.pageSizeList = [];
        if (vm.totalItems <= vm.pageSize) {
            vm.pageSizeList.push('All');
        }
        else {
            for (i = 4; i <= vm.maxPageSize; i = i + 4) {
                if (vm.totalItems > i)
                    vm.pageSizeList.push(i);
                if ((vm.totalItems - i) < 4 ) {
                    vm.pageSizeList.push('All');
                }
            }
        }
    }

    populateOrderList() {
        var vm = this;
        vm.orderList = [
            {id: 0, name: vm.primaryOrderText + " asc", column: vm.primary, descending: false},
            {id: 1, name: vm.primaryOrderText + " desc", column: vm.primary, descending: true},
        ];

        if (vm.secondary) {
            vm.orderList.push({id: 2, name: vm.secondaryOrderText + " asc", column: vm.secondary, descending: false});
            vm.orderList.push({id: 3, name: vm.secondaryOrderText + " desc", column: vm.secondary, descending: true});
        }

        if (vm.order === undefined) {
            vm.order = vm.orderList[0];
        }
    }

    editItem(item : any) {
        var vm = this;
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

    orderChange(): void {
        this.onOrderChange.next(this.order);
    }

    pageSizeChange(value){
        if (value == 'All')
            this.pageSize = this.totalItems;
        else {
            this.pageSize = value;
        }

        this.onPageSizeChange.next(value);

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
