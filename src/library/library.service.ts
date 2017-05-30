import {Injectable} from "@angular/core";
import {Http, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs";
import {LibraryItem} from "./models/LibraryItem";
import {ItemSummaryList} from "./models/ItemSummaryList";
import {BaseHttp2Service} from "../core/baseHttp2.service";

@Injectable()
export class LibraryService extends BaseHttp2Service {
	constructor(http: Http) {
		super(http);
	}

	getFolderContents(folderUuid : string):Observable<ItemSummaryList> {
		let params = new URLSearchParams();
		params.append('folderUuid', folderUuid);
		return this.httpGet('api/library/getFolderContents', { search : params });
	}

	getLibraryItem<T extends LibraryItem>(uuid: string): Observable<T> {
		let params = new URLSearchParams();
		params.set('uuid', uuid);
		return this.httpGet('api/library/getLibraryItem', {search: params});
	}

	saveLibraryItem(libraryItem: LibraryItem): Observable<LibraryItem> {
		return this.httpPost('api/library/saveLibraryItem', libraryItem);
	}

	deleteLibraryItem(uuid: string): Observable<any> {
		var libraryItem = {uuid: uuid};
		return this.httpPost('api/library/deleteLibraryItem', libraryItem);
	}

	getLibraryItemNames(itemUuids : string[]): Observable<string[]> {
		let params = new URLSearchParams();

		for (let itemUuid of itemUuids)
			params.append('itemUuids', itemUuid);

		return this.httpGet('api/library/getLibraryItemNames', {search: params});
	}
}
