import {Auth} from "./security.auth";
import {User} from "./models/User";
import {Injectable} from "@angular/core";
import {OrganisationGroup} from "./models/OrganisationGroup";
import {Access} from "./models/Access";
import {MenuService} from "../layout/menu.service";
import {StateService, Transition, TransitionService} from "ui-router-ng2";

@Injectable()
export class SecurityService {
	currentUser:User;

	constructor(private transitionService: TransitionService,
							private menuService: MenuService,
							private stateService: StateService
	) {
	}

	getAuthz() : any {
		return Auth.factory().getAuthz();
	}

	getCurrentUser() : User {
		if(!this.currentUser) {
			this.currentUser = this.parseUser();
		}
		return this.currentUser;
	}

	isAuthenticated():boolean {
		return this.getCurrentUser() != null;
	}

	// switchUserInRole(userInRoleUuid:string) : IPromise<app.models.UserInRole> {
	// 	var request = '"' + userInRoleUuid + '"';
	// 	return this.httpPost('/api/security/switchUserInRole', request);
	// }

	login() {
		this.getAuthz().login({ redirectUri : Auth.factory().getRedirectUrl() });
	}

	logout() {
		this.currentUser = null;
		window.location.href = Auth.factory().getLogoutUrl();
	}

	openUserAccountTab() {
		window.open(Auth.factory().getAccountUrl(), '_blank');
	}

	onAuthReady(callback:any) {

		this.getAuthz().onReady = callback;
	}

	onAuthSuccess(callback:any) {
		this.getAuthz().onAuthSuccess = callback;
	}

	onAuthError(callback:any) {
		this.getAuthz().onAuthError = callback;
	}

	onAuthLogout(callback:any) {
		this.getAuthz().onAuthLogout = callback;
	}

	hasPermission(client, role : string) : boolean {
		let clientAccess : Access = this.getCurrentUser().clientAccess[client];

		if (!clientAccess)
			return false;

		if (role == null || role == '')
			return true;

		if (clientAccess && clientAccess.roles)
			return clientAccess.roles.indexOf(role) > -1;

		return false;
	}

	private parseUser() : User {
		if(this.getAuthz().idTokenParsed && this.getAuthz().realmAccess) {
			var user = new User;
			user.forename = this.getAuthz().idTokenParsed.given_name;
			user.surname = this.getAuthz().idTokenParsed.family_name;
			user.organisation = this.getAuthz().idTokenParsed.organisationId;
			//user.title = this.getAuthz().idTokenParsed.title;              // TODO: custom attribute??
			user.uuid = this.getAuthz().idTokenParsed.sub;
			user.permissions = this.getAuthz().realmAccess.roles;
			user.clientAccess = this.getAuthz().resourceAccess;

			user.organisationGroups = [];

			if (this.getAuthz().idTokenParsed.orgGroups != null) {
				for (var orgGroup of this.getAuthz().idTokenParsed.orgGroups) {

					// Set default organisation
					if (!user.organisation && orgGroup.organisationId != '00000000-0000-0000-0000-000000000000')
						user.organisation = orgGroup.organisationId;

					let organisationGroup: OrganisationGroup = new OrganisationGroup();
					organisationGroup.id = orgGroup.groupId;
					organisationGroup.name = orgGroup.group;
					// TODO : OrganisationId <--> ServiceId
					organisationGroup.organisationId = orgGroup.organisationId;
					organisationGroup.roles = [];
					for (var role of orgGroup.roles) {
						organisationGroup.roles.push(role);
					}
					user.organisationGroups.push(organisationGroup);
				}
			}

			user.isSuperUser = false;                                   // TODO: design session needed on RBAC roles / ABAC attributes!
			for(var permission of user.permissions) {
				if(permission == 'eds_superuser') {
					user.isSuperUser = true;
					break;
				}
			}

			return user;
		}

		if (!this.getAuthz().idTokenParsed)
			console.error("ID Token not parsed!");

		if (!this.getAuthz().realmAccess)
			console.error("No realm access!");

		return null;
	}

	init(): void {
		let vm = this;

		vm.transitionService.onBefore(
			{},
			(transition: Transition) => {
				let client = vm.menuService.getClientId();
				let state = transition.to().name;
				if (state == 'app.stop')
					return true;

				let menuOptions = vm.menuService.getMenuOptions();

				let requiredRole = null;
				for (let menuOption of menuOptions) {
					if (menuOption.state === state)
						requiredRole = menuOption.role;
				}

				let canActivate = vm.hasPermission(client, requiredRole);

				if (!canActivate)
					vm.stateService.go('app.stop');

				return canActivate;
			}
		);
		console.log('Security initialized');
	}


}
