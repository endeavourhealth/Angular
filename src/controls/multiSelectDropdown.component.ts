/*
import {Component, forwardRef, Input} from "@angular/core";
import {List} from "linqts/dist/linq";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
	selector : 'multiSelectDropdown',
	template : `<div ngbDropdown #myDrop="ngbDropdown">
        <div class="btn btn-secondary bordered-box" id="dropdownMenu3" ngbDropdownToggle style="width: 100%"><span class="pull-left">{{getCaption()}}</span><i class="fa fa-caret-down pull-right"></i></div>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu3" (mouseleave)="myDrop.close()">
            <div class="dropdown-item" (click)="selectAll()"><i class="fa fa-check"></i> Select all</div>
            <div class="dropdown-item" (click)="selectNone()"><i class="fa fa-times"></i> Unselect all</div>
            <hr>
            <div *ngFor="let item of data" class="dropdown-item" (click)="toggle(item)"><i [ngClass]="getIcon(item)"></i> {{item.name}}</div>
        </div>
    </div>`,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => MultiSelectDropdownComponent),
		multi: true
	}]
})

export class MultiSelectDropdownComponent implements ControlValueAccessor {
    @Input() data : any[];

    private selectedItems : List<any> = new List();
    private changed = new Array<(value: any) => void>();
    private touched = new Array<() => void>();

    touch() {
        this.touched.forEach(f => f());
    }

    writeValue(value: any): void {
        this.selectedItems = new List();
        this.selectedItems.AddRange(value);
    }

    registerOnChange(fn: any): void {
        this.changed.push(fn);
    }

    registerOnTouched(fn: any): void {
        this.touched.push(fn);
    }

    getCaption() {
        if (!this.selectedItems || this.selectedItems.Count() == 0)
            return "Select";
        else if (this.selectedItems.Count() == this.data.length)
            return "All";
        else if (this.selectedItems.Count() == 1)
            return "1 Item";
        else
            return this.selectedItems.Count() + " Items";
    }

    getIcon(item : any) {
        if (this.selectedItems.Contains(item.id))
            return "fa fa-check";
        return "fa fa-blank";
    }

    selectAll() {
        this.selectedItems = new List(this.data).Select(i => i.id);
        this.changed.forEach(f => f(this.selectedItems.ToArray()));
    }

    selectNone() {
        this.selectedItems = new List();
        this.changed.forEach(f => f(this.selectedItems.ToArray()));
    }

    toggle(item : any) {
        if (this.selectedItems.Contains(item.id))
            this.selectedItems.Remove(item.id);
        else
            this.selectedItems.Add(item.id);
        this.changed.forEach(f => f(this.selectedItems.ToArray()));
    }
}*/
