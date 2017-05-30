import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {BaseHttp2Service} from "../core/baseHttp2.service";

@Injectable()
export class LayoutService extends BaseHttp2Service {
	constructor(http : Http) { super(http); }

	getServiceName(uuid : string) : Observable<string> {
		let params = new URLSearchParams();
		params.set('serviceId', uuid);
		return this.httpGet('api/recordViewer/getServiceName', {search: params});
	}
}