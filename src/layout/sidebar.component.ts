import {MenuOption} from "./models/MenuOption";
import {Component} from "@angular/core";
import {MenuService} from "./menu.service";
import {SecurityService} from "../security/security.service";

@Component({
	selector: 'sidebar-component',
	template: `<section id="content" class="content">
		<nav class="sidebar">
			<ul>
				<li *ngFor="let menuItem of menuOptions">
					<div *ngIf="hasPermission(menuItem.role)" uiSref="{{menuItem.state}}" class="menuItem" style="cursor:pointer">
						<span class="fa fa-2x {{menuItem.icon}}"></span>
						<span class="nav-text">
						{{menuItem.caption}}
					</span>
					</div>
				</li>
			</ul>
			<ul class="logout">
				<li>
					<div (click)="logout()" class="menuItem">
						<i class="fa fa-2x fa-power-off"></i>
						<span style="cursor:pointer" class="nav-text">
						Sign out
				</span>
					</div>
				</li>
			</ul>
		</nav>

		<ui-view></ui-view>
	</section>
	`
})

export class SidebarComponent {
	menuOptions:MenuOption[];

	constructor(private menuService:MenuService, private securityService:SecurityService) {
		this.menuOptions = menuService.getMenuOptions();
	}

	hasPermission(role : string) : boolean {
		return this.securityService.hasPermission(this.menuService.getClientId(), role);
	}

	logout() {
		this.securityService.logout();
	}
}
