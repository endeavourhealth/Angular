![Endeavour Logo](http://www.endeavourhealth.org/github/logo-text-left-cropped.png)

# Endeavour Angular Library

### Components

#### Administration
For managing pending changes

#### Coding
Service & Dialogs for code searching

#### Common
Error handling, State management

#### Config
Configuration management

#### Controls

**Inline Editor**

The inline editor control is used to display a label which is then replace (on mouseclick)
 with an input box containing confirm/cancel buttons.  The control also has properties
 for styling the label and input box.

 `<inline-edit labelClass="text-success" inputClass="btn-danger" [(ngModel)]="myvalue"></inline-edit>`  
 **options**  
 `[labelClass] : string` : **optional** css class to use on the label  
 `[inputClass] : string` : **optional**css class to use on the input box  
 `[type] : string ` : **optional** use text-area to show a text-area rather than a input box.  default is 'text'  
 `[disabled] : boolean` : **optional** set this to enable or disable the edit functionality to prevent users without correct privileges being able to edit. 
 

**Loading Indicator**

The loading indicator is used to wrap and replace a section of html (displaying
and animated circle and message) until its `done` property is not undefined/null/false.

```
<loadingIndicator [done]="loadedItems">
    <ul>
        <li *ngFor="let item of loadedItems">{{item.name}}</li>
    </ul>
</loadingIndicator>
```

#### Core
Application wrapper, Http wrapper, LinqTs, Svg Helper

#### Dialogs
Basic text input dialog and simple message dialog.

#### Entity Viewer
Display a list of (pretty much) any generic item with built in pagination, filtering, ordering and user selected page sizes.  
Clicking on an item will open a modal dialog window with custom definable properties for each type of item.  The dialog will have a button that takes you to the relevant page to see full details and be able to edit the details.
 
 ##### Usage
 Import using 
 ```angular2html
import {EntityViewComponentsModule} from "eds-common-js";
```
 
 and add EntityViewComponentsModule to your imports section in the module you want to use it.
 
 Then call by:
 
 ```angular2html
<entity-viewer
        [items]="organisations"
        [primary]="'name'"
        [primaryOrderText]="'Name'"
        [displayClass]="'region'"
        [secondary]="'odsCode'"
        [secondaryOrderText]="'ODS Code'"
        [typeDescription]="'Organisation'"
        [model]="'organisation'"
        [pageSize]="12"
        [detailsToShow]="orgDetailsToShow">
</entity-viewer>
```

**Options**:  
`[items] :any[]` : array of the items you want to be displayed  
`[typeDescription] : string` : Used to advise users what they are seeing (or not seeing) eg There are no associated 'Organisations' if the array is empty.  Also the details modal dialog displays this text.  Use the singular and capitalised as you would want it on a heading.  eg. Organisation rather than organisations.   
`[model] : string` : What data model is being used (used to redirect to the correct page if they want more details) Valid options currently are :  
organisation  
region  
dataflow  
dsa  
dpa  
dataSharingSummary  
`[primary] : string` : The main property of the item you want displaying (eg name) case sensitive  
`[primaryOrderText] : string` : The text to use in the orderBy dropdown box. (eg Name)  
`[detailsToShow] :any[]` : the list of properties you want to be displayed in the details modal dialog box.  Each model has a function to return the default list . `new Organisation().getDisplayItems();` but this can be defined at the point of calling if you want a specific subset of properties.   
`[displayClass] : string` : **optional** if you want to add a custom styling class, default is region  
`[secondary] : string` : **optional** The secondary property of the item you want displaying (eg odsCode) case sensitive  
`[secondaryOrderText] : string` : **optional** The text to use in the orderBy dropdown box. (eg ODS Code)  
`[pageSize] : number` : **optional** The number of items to display on a page - default is 12  
`[allowDelete] : boolean` : **optional** allow the deletion of the entities being displayed

 Deletions work by emitting an event when the delete button is pressed in the component.  
 Subscribe to the event by adding a listener like below
 
 `<entity-viewer (deleted)="delete($event)`
 
 then implement the logic in whatever function you have specified.
 
 This also implements a pdf viewer so documents can be viewed using this component.  To enable viewing of PDF documents, pass the document entities as you would normally ensuring it contains the document data.  
 The model giving 'details to show' should be extended to indicate which property is a document.  
 `{label: 'fileData', property: 'fileData', document : true},`
 
 #### Entity Viewer With Server Side Pagination
 Display a list of (pretty much) any generic item with built in server side pagination, server side filtering, server side ordering and user selected page sizes.  
 Clicking on an item will open a modal dialog window with custom definable properties for each type of item.  The dialog will have a button that takes you to the relevant page to see full details and be able to edit the details.
  
  ##### Usage
  Import using 
  ```angular2html
 import {EntityViewComponentsModule} from "eds-common-js";
 ```
  
  and add EntityViewComponentsModule to your imports section in the module you want to use it.
  
  Then call by:
  
  ```angular2html
 <entity-viewer-ssp
         (onPageChange)="pageChange($event)"
         (onPageSizeChange)="pageSizeChange($event)"
         (search)="onSearch($event)"
         (onOrderChange)="onOrderChange($event)"
         [items]="organisations"
         [totalItems]="totalItems"
         [primary]="'name'"
         [primaryOrderText]="'Name'"
         [displayClass]="'region'"
         [secondary]="'odsCode'"
         [secondaryOrderText]="'ODS Code'"
         [typeDescription]="'Organisation'"
         [model]="'organisation'"
         [pageSize]="12"
         [pageNumber]="pageNumber"
         [maxPageSize]="48"
         [detailsToShow]="orgDetailsToShow">
 </entity-viewer-ssp>
 ```
 
 **Options**:  
 `[items] :any[]` : array of the items you want to be displayed  
 `[totalItems]: number` : Total number of items (obtained from the DB)
 `[typeDescription] : string` : Used to advise users what they are seeing (or not seeing) eg There are no associated 'Organisations' if the array is empty.  Also the details modal dialog displays this text.  Use the singular and capitalised as you would want it on a heading.  eg. Organisation rather than organisations.   
 `[model] : string` : What data model is being used (used to redirect to the correct page if they want more details) Valid options currently are :  
 organisation  
 region  
 dataflow  
 dsa  
 dpa  
 dataSharingSummary  
 `[primary] : string` : The main property of the item you want displaying (eg name) case sensitive  
 `[primaryOrderText] : string` : The text to use in the orderBy dropdown box. (eg Name)  
 `[detailsToShow] :any[]` : the list of properties you want to be displayed in the details modal dialog box.  Each model has a function to return the default list . `new Organisation().getDisplayItems();` but this can be defined at the point of calling if you want a specific subset of properties.   
 `[displayClass] : string` : **optional** if you want to add a custom styling class, default is region  
 `[secondary] : string` : **optional** The secondary property of the item you want displaying (eg odsCode) case sensitive  
 `[secondaryOrderText] : string` : **optional** The text to use in the orderBy dropdown box. (eg ODS Code)  
 `[pageSize] : number` : **optional** The number of items to display on a page - default is 12  
 `[pageNumber] : number` : Current Page Number  
 `[maxPageSize] : number` : limit the maximum size of page default is 48 
 `[allowDelete] : boolean` : **optional** allow the deletion of the entities being displayed
 
  Deletions work by emitting an event when the delete button is pressed in the component.  
  Subscribe to the event by adding a listener like below
  
  `<entity-viewer (deleted)="delete($event)`
  
  then implement the logic in whatever function you have specified.
  
  Component emits events for the following.  Subscribe to hook up the server side pagination in whatever is calling this.
  
  `(onPageChange)` : Emitted whenever a user changes page and returns the new current Page.  
  `(onPageSizeChanged)` : Emitted whenever a user changes the page size and returns the new page size  
  `(search)` : Emitted when a user types a string in the search box and presses enter.  The search string is returned.  
  `(onOrderChange)` : Emitted when a user changes the order drop down and returns an object containing the a string of the column name (`column`) and a boolean advising if the order is descending or not.  
   
  This also implements a pdf viewer so documents can be viewed using this component.  To enable viewing of PDF documents, pass the document entities as you would normally ensuring it contains the document data.  
  The model giving 'details to show' should be extended to indicate which property is a document.  
  `{label: 'fileData', property: 'fileData', document : true},`
  
#### Flowchart
Angular implementation of the flowchart component

#### Folder
Endeavour library folder navigation component.  Optional context menu (configurable via `actionMenuItems` property).
 Events for selection changes and item actions.

```
<library-folder
    [showMenu]="true"
    [actionMenuItems]="actionMenuItems"
    (selectionChange)="folderChanged($event)"
    (itemActioned)="actionItem($event)">
</library-folder>
```

#### Layout
Comman application layout (shell, top bar, side menu)

#### Library
Base components for implementing domain specific library

#### Logger
Error logging service

#### MouseCapture
Mouse handling/dragging service component

#### Security
Keycloak security components and authenticating Http interceptor

### Making Changes

To make changes to the common angular code, you will need to perform the following steps.

* Increment the version number at the top of the `package.json` file
* Make your code changes!
* Build using the `npm run build` command
    * This will create a new version of the common tgz file

        **Note:** During development, the contents of this file can simply be unpacked
     into the relevant node_modules folder of your main project to circumvent the
     commit/install process.
* Once development is complete, you should commit:
    * Your code changes!
    * The updated `package.json` file
    * The new `eds-common-js.?.?.?.tgx` file
* In your main project, update the eds-common-js entry in your `package.json` file
* Perform an `npm install` to retrieve your new package
