import {flowchart} from "./flowchart.viewmodel";
import {Component, Input, Output, EventEmitter} from "@angular/core";
import {DraggingService} from "../mouseCapture/dragging.service";
import {SvgElement} from "../core/svg.helper";

@Component({
	selector : 'flow-chart',
	template : `<svg
  class="chart-container"
  xmlns="http://www.w3.org/2000/svg"
  mousecapture>
    <defs>
        <linearGradient spreadMethod="pad" y2="0" x2="0" y1="1" x1="0" id="ruleBackgroundGradient">
            <stop
              offset="0" stop-opacity="0.99609" stop-color="#80bdff"/>
            <stop offset="0.63934" stop-opacity="0.99219" stop-color="#cce5ff"/>
        </linearGradient>
        <linearGradient spreadMethod="pad" y2="0" x2="0" y1="1" x1="0" id="testBackgroundGradient">
            <stop
                    offset="0" stop-opacity="0.99609" stop-color="#0FF0B2"/>
            <stop offset="0.63934" stop-opacity="0.99219" stop-color="#9BFFD6"/>
        </linearGradient>
        <linearGradient spreadMethod="pad" y2="0" x2="0" y1="1" x1="0" id="expressionRuleBackgroundGradient">
            <stop
              offset="0" stop-opacity="0.99609" stop-color="#B1EAFF"/>
            <stop offset="0.63934" stop-opacity="0.99219" stop-color="#D7F5FF"/>
        </linearGradient>
        <linearGradient spreadMethod="pad" y2="0" x2="0" y1="1" x1="0" id="queryRuleBackgroundGradient">
            <stop
              offset="0" stop-opacity="0.99609" stop-color="gainsboro"/>
            <stop offset="0.63934" stop-opacity="0.99219" stop-color="whitesmoke"/>
        </linearGradient>
        <linearGradient spreadMethod="pad" y2="0" x2="0" y1="1" x1="0" id="startRuleBackgroundGradient">
            <stop offset="0" stop-opacity="0.99609" stop-color="green"/>
            <stop offset="0.63934" stop-opacity="0.99219" stop-color="lightgreen"/>
        </linearGradient>

        <marker id="markerArrow" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
            <path d="M2,2 L2,10 L8,6 L2,2" style="fill: darkgreen"/>
        </marker>
    </defs>
    <g
      *ngFor="let rule of chart.rule"
      (mousedown)="ruleMouseDown($event, rule)"
      (mouseover)="mouseOverRule = rule"
      (mouseout)="mouseOverRule = null"
      [attr.transform]="'translate(' + rule.x() + ',' + rule.y()+')'">

        <circle *ngIf="rule.description()=='START'"
                [attr.class]="rule.selected() && 'selected-rule-start'
                || (rule == mouseOverRule && 'mouseover-rule-start' || 'rule-start')"
                r="40" cx="212" cy="30"
                fill="url(#startRuleBackgroundGradient)"/>

        <rect *ngIf="rule.description()!='START' && rule.type()=='1' && !rule.queryLibraryItemUUID()"
              [attr.class]="rule.selected() && 'selected-rule-rect'
                      || (rule == mouseOverRule && 'mouseover-rule-rect' || 'rule-rect')"
              ry="10" rx="10" x="0" y="0"
              [attr.width]="rule.width()"
              [attr.height]="110"
              fill="url(#ruleBackgroundGradient)">
        </rect>

        <rect *ngIf="rule.description()!='START' && rule.type()=='3' && !rule.queryLibraryItemUUID()"
              [attr.class]="rule.selected() && 'selected-rule-rect'
                      || (rule == mouseOverRule && 'mouseover-rule-rect' || 'rule-rect')"
              ry="10" rx="10" x="0" y="0"
              [attr.width]="rule.width()"
              [attr.height]="110"
              fill="url(#testBackgroundGradient)">
        </rect>

        <rect *ngIf="rule.description()!='START' && rule.type()=='4'"
              [attr.class]="rule.selected() && 'selected-rule-rect'
                      || (rule == mouseOverRule && 'mouseover-rule-rect' || 'rule-rect')"
              ry="10" rx="10" x="0" y="0"
              [attr.width]="rule.width()"
              [attr.height]="110"
              fill="url(#expressionRuleBackgroundGradient)">
        </rect>

        <rect *ngIf="rule.description()!='START' && rule.queryLibraryItemUUID()"
              [attr.class]="rule.selected() && 'selected-rule-rect'
                      || (rule == mouseOverRule && 'mouseover-rule-rect' || 'rule-rect')"
              ry="10" rx="10" x="0" y="0"
              [attr.width]="rule.width()"
              [attr.height]="110"
              fill="url(#queryRuleBackgroundGradient)">
        </rect>

        <text *ngIf="rule.description()=='START'"
              class="rule-text-start"
              x="210" y="31"
              text-anchor="middle"
              alignment-baseline="middle">
            {{rule.description()}}
        </text>

        <text *ngIf="rule.description()!='START' && rule.type()=='1' && !rule.queryLibraryItemUUID()"
              class="rule-type-text"
              x="18"
              y="20"

              alignment-baseline="middle">
            FEATURE
        </text>

        <text *ngIf="rule.description()!='START' && rule.type()=='3'"
              class="rule-type-text"
              x="18"
              y="20"

              alignment-baseline="middle">
            TEST
        </text>

        <text *ngIf="rule.description()!='START' && rule.queryLibraryItemUUID()"
              class="rule-type-text"
              x="18"
              y="20"

              alignment-baseline="middle">
            LIBRARY FEATURE
        </text>

        <text *ngIf="rule.description()!='START' && rule.type()=='4'"
              class="rule-type-text"
              x="18"
              y="20"

              alignment-baseline="middle">
            FUNCTION
        </text>

        <text (click)="editTest($event, rule)"
              *ngIf="rule.description()!='START' && rule.description().length<=30"
              class="rule-text"
              [attr.x]="rule.width()/2"
              y="60"
              text-anchor="middle"
              alignment-baseline="middle">
            {{rule.description()}}
            <title>{{rule.extendedDescription()}}</title>
        </text>

        <text (click)="editTest($event, rule)"
              *ngIf="rule.description()!='START' && rule.description().length>30"
              class="rule-text"
              [attr.x]="rule.width()/2"
              y="50"
              text-anchor="middle"
              alignment-baseline="middle">
            {{firstString(rule.description(), 30)}}
            <title>{{rule.extendedDescription()}}</title>
        </text>

        <text (click)="editTest($event, rule)"
              *ngIf="rule.description()!='START' && rule.description().length>30"
              class="rule-text"
              [attr.x]="rule.width()/2"
              y="70"
              text-anchor="middle"
              alignment-baseline="middle">
            {{secondString(rule.description(), 30)}}
            <title>{{rule.extendedDescription()}}</title>
        </text>

        <g *ngIf="rule.description()!='START'"
           (mouseup)="connectorMouseUp($event, rule, 0, 0, true)"
           class="connector input-connector">

            <circle
              class="connector-circle"
              [attr.r]="connectorSize"
              cx="0"
              cy="50"
            />
        </g>

        <g
          (mousedown)="connectorMouseDown($event, rule, 1, 0, false)"
          class="connector output-connector">
            <text *ngIf="rule.description()!='START'"
                  class="connector-text-out-pass"
                  x="230"
                  y="30"
                  text-anchor="end"
                  alignment-baseline="middle">
                PASS
            </text>

            <circle *ngIf="rule.description()!='START'"
                    class="connector-circle"
                    [attr.r]="connectorSize"
                    cx="250"
                    cy="30"/>

            <circle *ngIf="rule.description()=='START'"
                    class="connector-circle"
                    r="9"
                    cx="250"
                    cy="30"/>

            <path *ngIf="rule.description()!='START' && rule.onPassAction() == 'NO_ACTION'"
                  class="connection-line-noaction"
                  d="M 260, 30
                     L 280, 30,
                     280, 15,
                     280, 45">
            </path>

            <path *ngIf="rule.description()!='START' && rule.onPassAction() == 'INCLUDE'"
                  class="connection-line-noaction"
                  d="M 260, 30
                 L 280, 30">
            </path>

            <text *ngIf="rule.description()!='START' && rule.onPassAction() == 'INCLUDE'"
                  class="connector-text-out-include-tick"
                  x="285"
                  y="30"
                  alignment-baseline="middle">
                ✔
            </text>
        </g>
        <g
          (mousedown)="connectorMouseDown($event, rule, 2, 1, false)"
          class="connector output-connector">
            <text *ngIf="rule.description()!='START'"
                  class="connector-text-out-fail"
                  x="230"
                  y="85"
                  text-anchor="end"
                  alignment-baseline="middle">
                FAIL
            </text>

            <circle *ngIf="rule.description()!='START'"
                    class="connector-circle"
                    [attr.r]="connectorSize"
                    cx="250"
                    cy="85"/>

            <path *ngIf="rule.description()!='START' && rule.onFailAction() == 'NO_ACTION'"
                  class="connection-line-noaction"
                  d="M 260, 85
                     L 280, 85,
                     280, 70,
                     280, 100">
            </path>

            <path *ngIf="rule.description()!='START' && rule.onFailAction() == 'INCLUDE'"
                  class="connection-line-noaction"
                  d="M 260, 85
                 L 280, 85">
            </path>

            <text *ngIf="rule.description()!='START' && rule.onFailAction() == 'INCLUDE'"
                  class="connector-text-out-include-tick"
                  x="285"
                  y="85"
                  alignment-baseline="middle">
                ✔
            </text>
        </g>
    </g>

    <g>
        <g *ngFor="let rule of chart.rule" class="connection">
            <g *ngFor="let startingrules of chart.startingRules">
                <path *ngIf="rule.description()=='START' &&
                            rule.y() > findDestRuleY(startingrules.ruleId())"
                      class="connection-line"
                      [attr.d]="'M ' + (rule.x()+250) +', '+(rule.y()+30) +' ' +
                     'L '+(findDestRuleX(startingrules.ruleId())-35) + ', '+ (rule.y()+30) + ' '+
                     (findDestRuleX(startingrules.ruleId())-35) + ', ' + (findDestRuleY(startingrules.ruleId())+50) + ' ' +
                     (findDestRuleX(startingrules.ruleId())-20) + ', ' + (findDestRuleY(startingrules.ruleId())+50)"
                      style="marker-end: url(#markerArrow);">
                </path>

                <path *ngIf="rule.description()=='START' &&
                            rule.y() < findDestRuleY(startingrules.ruleId())"
                      class="connection-line"
                      [attr.d]="'M ' + (rule.x()+250) +', '+(rule.y()+30) +' ' +
                     'L '+(findDestRuleX(startingrules.ruleId())-35) + ', '+ (rule.y()+30) + ' '+
                     (findDestRuleX(startingrules.ruleId())-35) + ', ' + (findDestRuleY(startingrules.ruleId())+50) + ' ' +
                     (findDestRuleX(startingrules.ruleId())-20) + ', ' + (findDestRuleY(startingrules.ruleId())+50)"
                      style="marker-end: url(#markerArrow);">
                </path>

                <circle *ngIf="rule.description()=='START'"
                        class="connection-endpoint"
                        r="5"
                        [attr.cx]="rule.x()+250"
                        [attr.cy]="rule.y()+30">
                </circle>

                <circle
                  class="connection-endpoint"
                  r="5"
                  [attr.cx]="findDestRuleX(startingrules.ruleId())"
                  [attr.cy]="findDestRuleY(startingrules.ruleId())+50">
                </circle>

                <g>

                    <g *ngFor="let nextrule of rule.onPassRuleId()">

                        <path *ngIf="rule.x()+300 > findDestRuleX(nextrule) &&
              rule.y() > findDestRuleY(nextrule) && nextrule>0"
                              class="connection-line"
                              [attr.d]="'M '+(rule.x()+250)+', '+(rule.y()+30)+' '+
                         'L '+(rule.x()+280)+', '+(rule.y()+30)+' '+
                         (rule.x()+280)+', '+(rule.y()-30)+' '+
                         (findDestRuleX(nextrule)-40)+', '+(rule.y()-30)+' '+
                         (findDestRuleX(nextrule)-40)+', '+(findDestRuleY(nextrule)+50)+' ' +
                         (findDestRuleX(nextrule)-20)+', '+(findDestRuleY(nextrule)+50)"
                              style="marker-end: url(#markerArrow);">
                        </path>

                        <path *ngIf="rule.x()+335 > findDestRuleX(nextrule) &&
              rule.y() < findDestRuleY(nextrule) && nextrule>0"
                              class="connection-line"
                              [attr.d]="'M '+(rule.x()+250)+', '+(rule.y()+30)+' '+
                       'L '+(rule.x()+315)+', '+(rule.y()+30)+' '+
                       (rule.x()+315)+', '+(rule.y()+145)+' '+
                       (findDestRuleX(nextrule)-40)+', '+(rule.y()+145)+' '+
                       (findDestRuleX(nextrule)-40)+', '+(findDestRuleY(nextrule)+50) + ' ' +
                       (findDestRuleX(nextrule)-20)+', '+(findDestRuleY(nextrule)+50)"
                              style="marker-end: url(#markerArrow);">
                        </path>

                        <path *ngIf="rule.x()+300 < findDestRuleX(nextrule) &&
              rule.y() > findDestRuleY(nextrule) && nextrule>0"
                              class="connection-line"
                              [attr.d]="'M '+(rule.x()+250)+', '+(rule.y()+30)+' '+
                         'L '+(findDestRuleX(nextrule)-50)+', '+(rule.y()+30)+' '+
                         (findDestRuleX(nextrule)-50)+', '+(findDestRuleY(nextrule)+50)+' '+
                         (findDestRuleX(nextrule)-20)+', '+(findDestRuleY(nextrule)+50)"
                              style="marker-end: url(#markerArrow);">
                        </path>

                        <path *ngIf="rule.x()+335 < findDestRuleX(nextrule) &&
              rule.y() < findDestRuleY(nextrule) && nextrule>0"
                              class="connection-line"
                              [attr.d]="'M '+(rule.x()+250)+', '+(rule.y()+30) + ' ' +
                         'L '+(findDestRuleX(nextrule)-35)+', '+(rule.y()+30)+' '+
                         (findDestRuleX(nextrule)-35)+', '+(findDestRuleY(nextrule)+50)+' '+
                         (findDestRuleX(nextrule)-20)+', '+(findDestRuleY(nextrule)+50)"
                              style="marker-end: url(#markerArrow);">
                        </path>

                        <circle *ngIf="nextrule>0"
                                class="connection-endpoint"
                                r="5"
                                [attr.cx]="rule.x()+250"
                                [attr.cy]="rule.y()+30">
                        </circle>

                        <circle *ngIf="nextrule>0"
                                class="connection-endpoint"
                                r="5"
                                [attr.cx]="findDestRuleX(nextrule)"
                                [attr.cy]="findDestRuleY(nextrule)+50">
                        </circle>

                    </g>
                    <g *ngFor="let nextrule of rule.onFailRuleId()">

                        <path *ngIf="rule.x()+335 > findDestRuleX(nextrule) &&
          rule.y() > findDestRuleY(nextrule) && nextrule>0"
                              class="connection-line"
                              [attr.d]="'M '+(rule.x()+250)+', '+(rule.y()+85)+' '+
                   'L '+(rule.x()+315)+', '+(rule.y()+85)+' '+
                   (rule.x()+315)+', '+(rule.y()-45)+' '+
                   (findDestRuleX(nextrule)-50)+', '+(rule.y()-45)+', '+
                   (findDestRuleX(nextrule)-50)+', '+(findDestRuleY(nextrule)+50)+' '+
                   (findDestRuleX(nextrule)-20)+', '+(findDestRuleY(nextrule)+50)"
                              style="marker-end: url(#markerArrow);">
                        </path>

                        <path *ngIf="rule.x()+300 > findDestRuleX(nextrule) &&
          rule.y() < findDestRuleY(nextrule) && nextrule>0"
                              class="connection-line"
                              [attr.d]="'M '+(rule.x()+250)+', '+(rule.y()+85)+' '+
                     'L '+(rule.x()+280)+', '+(rule.y()+85)+' '+
                     (rule.x()+280)+', '+(rule.y()+130)+' '+
                     (findDestRuleX(nextrule)-50)+', '+(rule.y()+130)+' '+
                     (findDestRuleX(nextrule)-50)+', '+(findDestRuleY(nextrule)+50) + ' ' +
                     (findDestRuleX(nextrule)-20)+', '+(findDestRuleY(nextrule)+50)"
                              style="marker-end: url(#markerArrow);">
                        </path>

                        <path *ngIf="rule.x()+335 < findDestRuleX(nextrule) &&
          rule.y() > findDestRuleY(nextrule) && nextrule>0"
                              class="connection-line"
                              [attr.d]="'M '+(rule.x()+250)+', '+(rule.y()+85)+ ' '+
                     'L '+(findDestRuleX(nextrule)-35)+', '+(rule.y()+85)+' '+
                     (findDestRuleX(nextrule)-35)+', '+(findDestRuleY(nextrule)+50)+' '+
                     (findDestRuleX(nextrule)-20)+', '+(findDestRuleY(nextrule)+50)"
                              style="marker-end: url(#markerArrow);">
                        </path>

                        <path *ngIf="rule.x()+300 < findDestRuleX(nextrule) &&
          rule.y() < findDestRuleY(nextrule) && nextrule>0"
                              class="connection-line"
                              [attr.d]="'M '+(rule.x()+250)+', '+(rule.y()+85)+' '+
                     'L '+(findDestRuleX(nextrule)-50)+', '+(rule.y()+85)+' '+
                     (findDestRuleX(nextrule)-50)+', '+(findDestRuleY(nextrule)+50)+' '+
                     (findDestRuleX(nextrule)-20)+', '+(findDestRuleY(nextrule)+50)"
                              style="marker-end: url(#markerArrow);">
                        </path>

                        <circle *ngIf="nextrule>0"
                                class="connection-endpoint"
                                r="5"
                                [attr.cx]="rule.x()+250"
                                [attr.cy]="rule.y()+85">
                        </circle>

                        <circle *ngIf="nextrule>0"
                                class="connection-endpoint"
                                r="5"
                                [attr.cx]="findDestRuleX(nextrule)"
                                [attr.cy]="findDestRuleY(nextrule)+50">
                        </circle>
                    </g>
                </g>
            </g>

            <g *ngIf="draggingConnection">

                <path *ngIf="dragPoint1.x > dragPoint2.x && dragPoint1.y > dragPoint2.y"
                      class="dragging-connection dragging-connection-line"
                      [attr.d]="'M '+dragPoint1.x+', '+(dragPoint1.y-30)+' '+
                 'L '+(dragPoint1.x+65)+', '+(dragPoint1.y-30)+', '+
                 (dragPoint1.x+65)+', '+(dragPoint1.y-125)+', '+
                 (dragPoint2.x-40)+', '+(dragPoint1.y-125)+', '+
                 (dragPoint2.x-40)+', '+dragPoint2.y+' '+
                 (dragPoint2.x-20)+', '+dragPoint2.y"
                      style="marker-end: url(#markerArrow);">
                </path>

                <path *ngIf="dragPoint1.x > dragPoint2.x && dragPoint1.y < dragPoint2.y"
                      class="dragging-connection dragging-connection-line"
                      [attr.d]="'M '+dragPoint1.x+', '+(dragPoint1.y-30)+' '+
                 'L '+(dragPoint1.x+65)+', '+(dragPoint1.y-30)+', '+
                 (dragPoint1.x+65)+', '+(dragPoint1.y+55)+', '+
                 (dragPoint2.x-40)+', '+(dragPoint1.y+55)+', '+
                 (dragPoint2.x-40)+', '+dragPoint2.y+' '+
                 (dragPoint2.x-20)+', '+dragPoint2.y"
                      style="marker-end: url(#markerArrow);">
                </path>

                <path *ngIf="(dragPoint1.x < dragPoint2.x) && ((dragPoint1.y > dragPoint2.y) && (dragPoint1.y - dragPoint2.y >= 20 ))"
                      class="dragging-connection dragging-connection-line"
                      [attr.d]="'M '+dragPoint1.x+', '+(dragPoint1.y-30)+' '+
                   'L '+(dragPoint2.x-20)+', '+dragPoint2.y"
                      style="marker-end: url(#markerArrow);">
                </path>
                <path *ngIf="(dragPoint1.x < dragPoint2.x) && ((dragPoint1.y < dragPoint2.y) && (dragPoint2.y - dragPoint1.y >= 20 ))"
                      class="dragging-connection dragging-connection-line"
                      [attr.d]="'M '+dragPoint1.x+', '+(dragPoint1.y-30)+' '+
                     'L '+(dragPoint2.x-20)+', '+(dragPoint2.y-10)"
                      style="marker-end: url(#markerArrow);">
                </path>
                <path *ngIf="(dragPoint1.x < dragPoint2.x) && (dragPoint1.y - dragPoint2.y < 20 ) && (dragPoint1.y - dragPoint2.y >= 0 )"
                      class="dragging-connection dragging-connection-line"
                      [attr.d]="'M '+dragPoint1.x+', '+(dragPoint1.y-30)+' '+
                       'L '+(dragPoint2.x-20)+', '+(dragPoint2.y-5)"
                      style="marker-end: url(#markerArrow);">
                </path>
                <path *ngIf="(dragPoint1.x < dragPoint2.x) && (dragPoint2.y - dragPoint1.y < 20 ) && (dragPoint2.y - dragPoint1.y >= 0 )"
                      class="dragging-connection dragging-connection-line"
                      [attr.d]="'M '+dragPoint1.x+', '+(dragPoint1.y-30)+' '+
                         'L '+(dragPoint2.x-20)+', '+(dragPoint2.y-5)"
                      style="marker-end: url(#markerArrow);">
                </path>

                <circle
                  class="dragging-connection dragging-connection-endpoint"
                  r="4"
                  [attr.cx]="dragPoint1.x"
                  [attr.cy]="dragPoint1.y-30">
                </circle>

                <circle
                  class="dragging-connection dragging-connection-endpoint"
                  r="4"
                  [attr.cx]="dragPoint2.x"
                  [attr.cy]="dragPoint2.y">
                </circle>
            </g>
        </g>
    </g>
</svg>`
})
export class FlowChartComponent {
	@Input() chart : any;
	@Output() onRuleDescription = new EventEmitter();
	@Output() onRulePassAction = new EventEmitter();
	@Output() onRuleFailAction = new EventEmitter();
	@Output() onEditTest = new EventEmitter();

	private ruleClass;
	private destRuleId : number;
	private draggingConnection : boolean;
	private connectorSize : number;
	private mouseOverRule : any;
	private dragPoint1 : any;
	private dragPoint2 : any;
	private mouseDownRule : any;

	constructor(private dragging: DraggingService) {

		this.destRuleId = 0;
		//
		// Init data-model variables.
		//
		this.draggingConnection = false;
		this.connectorSize = 10;

		//
		// Reference to the connection, connector or rule that the mouse is currently over.
		//
		this.mouseOverRule = null;

		this.ruleClass = 'rule';
	}

	// Translate the coordinates so they are relative to the svg element.
	translateCoordinates(x, y) {
		var svg_elem: SvgElement = <SvgElement>document.getElementsByTagName("svg")[0];
		var s = document.getElementById('flowChart').style.zoom;
		if (s == "90%") {
			x = x + (x * 12 / 100);
			y = y + (y * 12 / 100);
		}
		else if (s == "80%") {
			x = x + (x * 26 / 100);
			y = y + (y * 26 / 100);
		}
		else if (s == "70%") {
			x = x + (x * 42 / 100);
			y = y + (y * 42 / 100);
		}
		else if (s == "60%") {
			x = x + (x * 68 / 100);
			y = y + (y * 68 / 100);
		}
		else if (s == "50%") {
			x = x + (x * 102 / 100);
			y = y + (y * 102 / 100);
		}
		var matrix = svg_elem.getScreenCTM();
		var point = svg_elem.createSVGPoint();
		point.x = x;
		point.y = y;
		var r = point.matrixTransform(matrix.inverse());
		return r;
	}

	// Handle mousedown on a rule.
	ruleMouseDown(evt, rule) {
		var vm = this;
		vm.mouseDownRule = rule;
		var chart = this.chart;
		var lastMouseCoords;

		this.dragging.startDrag(evt, {

			//
			// Rule dragging has commenced.
			//
			dragStarted: function (x, y) {

				lastMouseCoords = vm.translateCoordinates(
					x, y);

				//
				// If nothing is selected when dragging starts,
				// at least select the rule we are dragging.
				//
				if (!vm.mouseDownRule.selected()) {
					chart.deselectAll();
					vm.mouseDownRule.select();
				}
			},

			//
			// Dragging selected rule... update their x,y coordinates.
			//
			dragging: function (x, y) {

				var curCoords = vm.translateCoordinates(x, y);
				var deltaX = curCoords.x - lastMouseCoords.x;
				var deltaY = curCoords.y - lastMouseCoords.y;

				chart.updateSelectedRuleLocation(deltaX, deltaY);

				lastMouseCoords = curCoords;
			},

			//
			// The rule wasn't dragged... it was clicked.
			//
			clicked: function () {
				chart.handleRuleClicked(vm.mouseDownRule, evt.ctrlKey);

				vm.onRuleDescription.emit({description : vm.mouseDownRule.description()});
				vm.onRulePassAction.emit({action : vm.mouseDownRule.onPassAction()});
				vm.onRuleFailAction.emit({action : vm.mouseDownRule.onFailAction()});
			},

		});
	}

	editTest(evt, rule) {
		this.onEditTest.emit({ruleId : rule.id()});
	};

	connectorMouseUp(evt, rule, connector, connectorIndex, isInputConnector) {
		this.destRuleId = rule.id();
	}

	// Handle mousedown on an input connector.
	connectorMouseDown(evt, rule, connector, connectorIndex, isInputConnector) {
		var vm = this;
		//
		// Initiate dragging out of a connection.
		//
		vm.dragging.startDrag(evt, {

			//
			// Called when the mouse has moved greater than the threshold distance
			// and dragging has commenced.
			//
			dragStarted: function (x, y) {

				var curCoords = vm.translateCoordinates(x, y);

				vm.draggingConnection = true;
				vm.dragPoint1 = flowchart.computeConnectorPos(rule, connectorIndex, isInputConnector);
				vm.dragPoint2 = {
					x: curCoords.x,
					y: curCoords.y
				};
			},

			//
			// Called on mousemove while dragging out a connection.
			//
			dragging: function (x, y, evt) {
				var startCoords = vm.translateCoordinates(x, y);
				vm.dragPoint1 = flowchart.computeConnectorPos(rule, connectorIndex, isInputConnector);
				vm.dragPoint2 = {
					x: startCoords.x,
					y: startCoords.y
				};
			},

			//
			// Clean up when dragging has finished.
			//
			dragEnded: function () {

				var sourceRuleId = rule.id();
				var destRuleId = vm.destRuleId;

				if (destRuleId > 0) {

					//
					// Dragging has ended...
					// The mouse is over a valid connector...
					// Create a new connection.
					//
					vm.chart.createNewConnection(rule, sourceRuleId, destRuleId, connectorIndex);
					if (connectorIndex == 0) {
						vm.onRulePassAction.emit({action : 'GOTO_RULES'});
					}
					else if (connectorIndex == 1) {
						vm.onRuleFailAction.emit({action : 'GOTO_RULES'});
					}
					vm.destRuleId = 0;
				}

				vm.draggingConnection = false;
				delete vm.dragPoint1;
				delete vm.dragPoint2;
			}

		});
	}

	findDestRuleX(ruleId) {
		var chart = this.chart;
		var x = 0;
		for (var i = 0; i < chart.rule.length; ++i) {
			var rule = chart.rule[i];
			if (rule.data.id == ruleId) {
				x = rule.data.layout.x;
			}
		}
		return x;
	}

	findDestRuleY(ruleId) {
		var chart = this.chart;
		var y = 0;
		for (var i = 0; i < chart.rule.length; ++i) {
			var rule = chart.rule[i];
			if (rule.data.id == ruleId) {
				y = rule.data.layout.y;
			}
		}
		return y;
	}

	stringSplitter(str, width) {
		if (str.length > width) {
			var p = width
			for (; p > 0 && str[p] != ' '; p--) {
			}
			if (p > 0) {
				var left = str.substring(0, p);
				var right = str.substring(p + 1);
				return left + '~' + this.stringSplitter(right, width);
			}
		}
		return str;
	}

	firstString(str, width) {
		var s = this.stringSplitter(str, width);
		return s.split('~')[0];
	}

	secondString(str, width) {
		var s = this.stringSplitter(str, width);
		return s.split('~')[1];
	}

}