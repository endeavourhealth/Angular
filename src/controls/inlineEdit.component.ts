import {Component, forwardRef, Input} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
	selector : 'inline-edit',
	template : `
        <div *ngIf="!editing"><label class="control-label" [ngClass]="labelClass" (click)="edit()">{{ currentValue }}</label></div>
        <div *ngIf="editing" class="input-group">
            <textarea *ngIf="type=='text-area'" class="form-control" rows="4" [(ngModel)]="editValue"></textarea>
            <input *ngIf="type!='text-area'" type="type" class="form-control" [ngClass]="inputClass" [(ngModel)]="editValue">
            <div class="input-group-btn">
                <button class="btn btn-default" type="button" (click)="ok()"><i class="fa fa-check text-success"></i></button>
                <button class="btn btn-default" type="button" (click)="cancel()"><i class="fa fa-times text-danger"></i></button>
            </div>
        </div>
    `,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InlineEditorComponent),
			multi: true
		}
	]
})
export class InlineEditorComponent implements ControlValueAccessor {
	@Input() labelClass : string = "";
	@Input() inputClass : string = "";
	@Input() type : string = 'text';
	@Input() disabled: boolean = false;
	currentValue : string = "";
	editValue : string = "";
	editing : boolean = false;

	propagateChange = (_: any) => {};

	edit() {
		if (this.disabled) {
			return;
		}
		this.editValue = this.currentValue;
		this.editing = true;
	}

	ok() {
		this.currentValue = this.editValue;
		this.editing = false;
		this.propagateChange(this.currentValue);
	}

	cancel() {
		this.editing = false;
	}

	writeValue(value: any): void {
		this.currentValue = value;
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
	}
}
