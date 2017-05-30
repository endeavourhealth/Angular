import {Component} from "@angular/core";
import {OrgRole} from "./models/OrgRole";
import {MenuService} from "./menu.service";
import {User} from "../security/models/User";
import {SecurityService} from "../security/security.service";

@Component({
	selector: 'topnav-component',
	template: `<header class="clearfix">
		<div class="navbar navbar-default navbar-fixed-top">
			<div class="container-fluid">
				<div class="navbar-header" style="width: 50%">
					<img class="logo-image">
					<span class="title-text">{{getApplicationTitle()}}</span>
				</div>
				<div class="pull-right" style="padding: 10px;color:gray">
				<span class="dropdown" ngbDropdown>
					Logged in :
					<button class="dropdown-toggle" ngbDropdownToggle id="optionsMenu">
						{{currentUser.title}} {{currentUser.forename}} {{currentUser.surname}}
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu dropdown-menu-right" aria-labelledby="optionsMenu">
						<li style="cursor:pointer; padding-left: 5px; padding-right: 5px; padding-bottom: 5px" class="nav-text">
							<div (click)="navigateUserAccount()" class="menuItem" >
							<i class="fa fa-user-circle-o fa-2x"></i>
								User account
							</div>
						</li>
						<li style="cursor:pointer; padding-left: 5px; padding-right: 5px;" class="nav-text">
							<div (click)="logout()" class="menuItem">
							<i class="fa fa-power-off fa-2x"></i>
								Logout
							</div>
						</li>
					</ul>
				</span>
				</div>
			</div>
		</div>
	</header>
	`
})
export class TopnavComponent {
	currentUser:User;
	currentOrgRole : OrgRole;
	userOrganisations : OrgRole[];

	constructor(private securityService:SecurityService, private menuService : MenuService) {
		let vm = this;

		vm.currentUser = this.securityService.getCurrentUser();
	}

	getApplicationTitle() : string {
		return this.menuService.getApplicationTitle();
	}

	navigateUserAccount() {
		var url = window.location.protocol + "//" + window.location.host;
		url = url + "/eds-user-manager/#/app/users/userManagerUserView";
		window.location.href = url;
	}

	logout() {
		this.securityService.logout();
	};
}
