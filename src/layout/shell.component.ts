import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {ToastsManager} from "ng2-toastr";
import {StateRegistry, StateService, Transition, TransitionService} from "ui-router-ng2";
import {SecurityService} from "../security/security.service";
import {MenuService} from "./menu.service";
import {StopComponent} from "./stop.component";

@Component({
	selector: 'app',
	template: `<div>
		<topnav-component></topnav-component>

		<sidebar-component></sidebar-component>

		<template ngbModalContainer></template>
	</div>
	`})
export class ShellComponent implements OnInit {

	constructor(private transitionService: TransitionService,
							private menuService: MenuService,
							private securityService: SecurityService,
							private stateService: StateService,
							public toastr: ToastsManager,
							vRef: ViewContainerRef) {
		this.toastr.setRootViewContainerRef(vRef);
	}

	ngOnInit(): void {
		let vm = this;

		vm.transitionService.onStart(
			{},
			(transition: Transition) => {
				let client = vm.menuService.getClientId();

				let state = transition.to().name;

				let menuOptions = vm.menuService.getMenuOptions();

				let requiredRole = null;
				for (let menuOption of menuOptions) {
					if (menuOption.state === state)
						requiredRole = menuOption.role;
				}

				let canActivate = vm.securityService.hasPermission(client, requiredRole);

				if (!canActivate)
					vm.stateService.go('app.stop');

				return canActivate;
			}
		);
	}
}