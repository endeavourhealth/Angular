import {Component, ViewContainerRef} from "@angular/core";
import {ToastsManager} from "ng2-toastr";
import {SecurityService} from "../security/security.service";

@Component({
	selector: 'app',
	template: `<div>
		<topnav-component></topnav-component>

		<sidebar-component></sidebar-component>

		<template ngbModalContainer></template>
	</div>
	`})
export class ShellComponent {

	constructor(public toastr: ToastsManager,
							private securityService : SecurityService,
							vRef: ViewContainerRef) {
		this.toastr.setRootViewContainerRef(vRef);
		this.securityService.init();
	}

}