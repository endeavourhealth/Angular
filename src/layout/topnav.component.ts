import {Component} from "@angular/core";
import {OrgRole} from "./models/OrgRole";
import {MenuService} from "./menu.service";
import {User} from "../security/models/User";
import {SecurityService} from "../security/security.service";

@Component({
	selector: 'topnav-component',
	template: `
		<div class="title-bar">
      <span class="navbar-header" style="width: 50%">
        <img class="logo-image">
        <span class="title-text">{{getApplicationTitle()}}</span>
      </span>
			<div class="pull-right" style="padding: 10px;color:gray">

				<div class="d-inline-block">
					<div class="dropdown">
						Signed in :
						<button class="btn dropdown-toggle btn-info btn-sm" id="roleDropdown" data-toggle="dropdown">{{currentUser.title}}
							{{currentUser.forename}} {{currentUser.surname}}
						</button>
						<div class="dropdown-menu dropdown-menu-right" aria-labelledby="roleDropdown">
							<div class="dropdown-item">
								<div class="pull-right">
									<button type="button" class="btn btn-success" (click)="navigateUserAccount()">User
										account
									</button>
									<button type="button" class="btn btn-danger" (click)="logout()">Sign out</button>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
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
		url = url + "/user-manager/#/app/users/userManagerUserView";
		window.location.href = url;
	}

	logout() {
		this.securityService.logout();
	};
}
