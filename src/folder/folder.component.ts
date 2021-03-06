import {FolderNode} from "./models/FolderNode";
import {Folder} from "./models/Folder";
import {FolderService} from "./folder.service";
import {InputBoxDialog} from "../dialogs/inputBox/inputBox.dialog";
import {MessageBoxDialog} from "../dialogs/messageBox/messageBox.dialog";
import {FolderType} from "./models/FolderType";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Component, OnInit, ViewChild, EventEmitter, Output, Input} from "@angular/core";
import {ITreeOptions, TreeNode, TreeComponent} from "angular2-tree-component";
import {Observable} from "rxjs";
import {ITreeNode} from "angular2-tree-component/dist/defs/api";
import {LoggerService} from "../logger/logger.service";
import {ModuleStateService} from "../common/moduleState.service";
import {ItemType} from "./models/ItemType";
import {ActionMenuItem} from "./models/ActionMenuItem";

@Component({
	selector : 'library-folder',
	template : `<Tree [nodes]="treeData" [options]="options" (onActivate)="selectNode($event.node.data)" (onInitialized)="treeInitialized()">
		<template #treeNodeTemplate let-node>
			<div ngbDropdown class="show-child-on-hover folder-item">
				<span>{{ node.data.folderName }}</span>
				<button *ngIf="showMenu" type="button" class="btn btn-xs btn-default child-to-show pull-right" ngbDropdownToggle id="folderMenu">...</button>
				<ul class="dropdown-menu" aria-labelledby="folderMenu">
					<li *ngFor="let item of actionMenuItems">
						<a (click)="actionItem(node.data.uuid, item.type, 'add')">{{item.text}}</a>
					</li>

					<li role="separator" class="divider"></li>
					<li><a (click)="addChildFolder(node)">Add child folder</a></li>
					<li role="separator" class="divider"></li>
					<li [ngClass]="{'disabled': !node.data.parentFolderUuid}"><a (click)="!node.data.parentFolderUuid || renameFolder(node)">Rename</a></li>
					<li [ngClass]="{'disabled': !node.data.parentFolderUuid}"><a (click)="!node.data.parentFolderUuid || deleteFolder(node)">Delete</a></li>
					<li role="separator" class="divider"></li>
					<li class="disabled"><a href="#">Cut</a></li>
					<li class="disabled"><a href="#">Copy</a></li>
					<li><a (click)="pasteItem(node)">Paste</a></li>
				</ul>
			</div>
		</template>
	</Tree>
	`,
})
export class FolderComponent implements OnInit {
	@Input() folderType = FolderType.Library;
	@Input() showMenu = false;
	@Input() actionMenuItems : ActionMenuItem[] = [];
	@Output() selectionChange = new EventEmitter();
	@Output() itemActioned = new EventEmitter();
	@ViewChild(TreeComponent) tree: TreeComponent;

	public onSelected : Function;
	public onActionItem : Function;
	public id : string = 'libraryFolder';

	selectedNode : FolderNode;
	treeData : FolderNode[];
	options : ITreeOptions;

	constructor(
		protected logger : LoggerService,
		protected $modal : NgbModal,
		protected moduleStateService : ModuleStateService,
		protected folderService : FolderService) {
		this.options = {
			displayField : 'folderName',
			childrenField : 'nodes',
			idField : 'uuid',
			isExpandedField : 'isExpanded',
			getChildren : (node) => { this.getChildren(node)}
		}
	}

	ngOnInit() {
		this.getRootFolders();
	}

	getRootFolders() {
		var vm = this;
		vm.folderService.getFolders(vm.folderType, null)
			.subscribe(
				(rootData) => {
					vm.folderService.getFolders(1, rootData.folders[0].uuid)
						.subscribe(
							(childData => {
								vm.treeData = rootData.folders;

								if (vm.treeData && vm.treeData.length > 0) {
									// Set folder type (not retrieved by API)
									vm.treeData.forEach((item) => {
										item.folderType = vm.folderType;
									});
								}
								// Set parent folder (not retrieved by API)
								childData.folders.forEach((item) => {
									item.parentFolderUuid = rootData.folders[0].uuid;
								});
								vm.treeData[0].nodes = childData.folders;
							}),
							(error) => vm.logger.error('Error loading root children', error)
					)
				},
				(error) => vm.logger.error('Error loading root', error)
			);
	}

	treeInitialized() {
		// Expand root if not already done
		this.tree.treeModel.getFirstRoot().expand();

		// Select previous selection if present
		var state = this.moduleStateService.getState(this.id);
		if (state) {
			const selection = this.tree.treeModel.getNodeById(state.selectedNode.uuid);
			if (selection)
				this.tree.treeModel.setActiveNode(selection, true);
		}
	}


	saveState() {
		var state = {
			selectedNode : this.selectedNode
		};
		this.moduleStateService.setState(this.id, state);
	}

	getChildren(node : ITreeNode) {
		var vm = this;
		let observable = Observable.create(observer => {
			vm.folderService.getFolders(1, node.id)
				.subscribe(
					(data) => {
						// Set parent folder (not retrieved by API)
						data.folders.forEach((item) => {
							item.parentFolderUuid = node.id;
						});
						observer.next(data.folders);
						node.data.isExpanded = true;
						node.data.nodes = data.folders;
						vm.tree.treeModel.update();
					});
		});
		return observable.toPromise();
	}

	selectNode(node : FolderNode) {
		if (node === this.selectedNode) { return; }
		var vm = this;
		vm.selectedNode = node;
		vm.saveState()
		node.loading = true;
		vm.selectionChange.emit({selectedFolder: node});
	}

	actionItem(uuid : string, type : ItemType, action : string) {
		var vm = this;
		vm.saveState();
		vm.itemActioned.emit({uuid : uuid, type : type, action : action});
	}

	addChildFolder(node : TreeNode) {
		var vm = this;
		var parentNode : FolderNode = node.data;
		InputBoxDialog.open(vm.$modal, 'New Folder', 'Enter new folder name', 'New folder', 'Create folder', 'Cancel')
			.result.then(function (result: string) {
			var folder: Folder = {
				uuid: null,
				folderName: result,
				folderType: vm.folderType,
				parentFolderUuid: parentNode.uuid,
				contentCount: 0,
				hasChildren: true
			};
			vm.folderService.saveFolder(folder)
				.subscribe(
					(response) => {
						vm.logger.success('Folder created', response, 'New folder');
						folder.uuid = response.uuid;
						node.data.nodes.push(folder);
						parentNode.hasChildren = true;
						vm.tree.treeModel.update();
					},
					(error) => vm.logger.error('Error creating folder', error, 'New folder')
				);
		});
	}

	renameFolder(node : TreeNode) {
		var vm = this;
		var folderNode : FolderNode = node.data;
		InputBoxDialog.open(vm.$modal,
			'Rename folder', 'Enter new name for ' + folderNode.folderName, folderNode.folderName, 'Rename folder', 'Cancel')
			.result.then(function (newName: string) {
			var oldName = folderNode.folderName;
			folderNode.folderName = newName;
			vm.folderService.saveFolder(folderNode)
				.subscribe(
					(response) => vm.logger.success('Folder renamed to ' + newName, response, 'Rename folder'),
					(error) => {
						folderNode.folderName = oldName;
						vm.logger.error('Error renaming folder', error, 'Rename folder');
					});
		});
	}

	deleteFolder(node : TreeNode) {
		var vm = this;
		var folderNode : FolderNode = node.data;
		MessageBoxDialog.open(vm.$modal, 'Delete folder', 'Are you sure you want to delete folder ' + folderNode.folderName + '?', 'Yes', 'No')
			.result.then(function () {
			vm.folderService.deleteFolder(folderNode)
				.subscribe(
					(response) => {
						var parentNodes = node.parent.data.nodes;
						var idx = parentNodes.indexOf(node.data, 0);
						if (idx > -1) {
							parentNodes.splice(idx, 1);
							vm.tree.treeModel.update();
						}
						vm.logger.success('Folder deleted', response, 'Delete folder');
					},
					(error) => vm.logger.error('Error deleting folder', error, 'Delete folder')
				);
		});
	}
}
