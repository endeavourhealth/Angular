import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import { EntityFilterPipe } from './EntityFilterPipe';
import { EntityViewer } from './entityViewer';
import { EntityViewerServerSidePagination } from './entityViewerServerSidePagination';
import {NgxPaginationModule} from 'ngx-pagination';
import { OrderPipe } from './orderPipe';
import { EntityDetailsDialog } from './entityDetails.dialog';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@NgModule({
    imports:[
        BrowserModule,
        FormsModule,
        NgbModule,
        NgxPaginationModule
    ],
    declarations:[
        EntityFilterPipe,
        EntityViewer,
        EntityViewerServerSidePagination,
        OrderPipe,
        EntityDetailsDialog,
        PdfViewerComponent
    ],
    entryComponents : [
        EntityDetailsDialog
    ],
    exports:[
        EntityFilterPipe,
        EntityViewer,
        EntityViewerServerSidePagination,
        OrderPipe
    ]
})
export class EntityViewComponentsModule {}