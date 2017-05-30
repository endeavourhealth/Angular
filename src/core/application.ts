import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule, RequestOptions, XHRBackend, Http} from "@angular/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ToastModule, ToastOptions} from "ng2-toastr";
import {UIRouterModule, RootModule, UIView} from "ui-router-ng2";
import {TreeModule} from "angular2-tree-component";
import {MenuService} from "../layout/menu.service";
import {LayoutModule} from "../layout/layout.module";
import {AuthConfig} from "../security/models/AuthConfig";
import {WellKnownConfig} from "../security/models/WellKnownConfig";
import {Auth} from "../security/security.auth";
import {ShellComponent} from "../layout/shell.component";
import {AuthHttpService} from "../security/authHttp.service";
import {ModuleWithProviders} from "@angular/core";
// Top level component

// *** USE JQUERY TO BOOTSTRAP APPLICATION ONCE KEYCLOAK IS AUTHORIZED ***
declare var jQuery, $:any;
export class Application {

	public static Define({modules, states, defaultState, menuManager})  {
		return {
			imports: [
				BrowserModule,
				FormsModule,
				HttpModule,
				TreeModule,
				NgbModule.forRoot(),
				ToastModule.forRoot(<ToastOptions>{animate: 'flyRight', positionClass: 'toast-bottom-right'}),
				UIRouterModule.forRoot(<RootModule>{ states: states.concat({name: 'app', url: '/app', component: ShellComponent}), useHash: true, otherwise: defaultState }),

				LayoutModule,
			].concat(modules),
			providers: [
				{ provide: MenuService, useClass : menuManager },
				{
					provide: Http,
					useFactory: (backend: XHRBackend, defaultOptions: RequestOptions) => new AuthHttpService(backend, defaultOptions),
					deps: [XHRBackend, RequestOptions]
				}
			],
			bootstrap: [ UIView ]
		};
	}

	public static Run(ApplicationModule: any) {
		$('document').ready(function () {

			var wellKnownConfig: WellKnownConfig = WellKnownConfig.factory();

			var defer = jQuery.Deferred();

			jQuery.getJSON("/public/wellknown/authconfig", (data: any, textStatus: string, jqXHR: any) => {
				var authConfig = data as AuthConfig;
				defer.resolve(authConfig);
			});

			jQuery.when(defer.promise()).then(
				function (authConfig: AuthConfig) {
					// set the config
					wellKnownConfig.setAuthConfig(authConfig);

					Auth.factory().setOnAuthSuccess(() => {
						// manually bootstrap angular
						platformBrowserDynamic().bootstrapModule(ApplicationModule)
							.then((success: any) => console.log('App bootstrapped'))
							.catch((err: any) => console.error(err));
					});

					Auth.factory().setOnAuthError(() => {
						console.log('Failed to start app as not authenticated, check the well known auth configuration.')
					});

					Auth.factory().init();
				});
		});
	}
}