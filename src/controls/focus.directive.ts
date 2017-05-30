import {AfterViewInit, Directive, ElementRef, Renderer} from '@angular/core';

@Directive({
	selector: '[focus]'
})
export class Autofocus implements AfterViewInit
{
	constructor(private el: ElementRef, private renderer: Renderer)
	{
	}

	ngAfterViewInit()
	{
		this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
	}
}