/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, ViewChild } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ALFRESCO_CORE_PROVIDERS, AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ALFRESCO_TASKLIST_DIRECTIVES } from 'ng2-activiti-tasklist';

declare let AlfrescoApi: any;

@Component({
    selector: 'activiti-tasklist-demo',
    template: `
    <div *ngIf="isLoggedIn">
        <span>Task Filters</span>
        <activiti-filters (filterClick)="onFilterClick($event)"></activiti-filters>
        <span>Tasks</span>
        <activiti-tasklist [taskFilter]="taskFilter" [schemaColumn]="schemaColumn"
                                           (rowClick)="onRowClick($event)" #activititasklist></activiti-tasklist>
        <span>Task Details</span>
       <activiti-task-details [taskId]="currentTaskId" #activitidetails></activiti-task-details>
    </div>
    `,
    styles: [
        ':host > .container {padding: 10px}',
        '.p-10 { padding: 10px; }'
    ],
    directives: [ALFRESCO_TASKLIST_DIRECTIVES],
    providers: [AlfrescoAuthenticationService]
})
class ActivitiTaskListDemo {
    @ViewChild('activitidetails')
    activitidetails: any;

    @ViewChild('activititasklist')
    activititasklist: any;

    currentTaskId: string;

    schemaColumn: any [] = [];

    taskFilter: any;

    isLoggedIn: boolean = false;

    constructor(private setting: AlfrescoSettingsService,
                private auth: AlfrescoAuthenticationService) {
        this.setting.setProviders(['BPM']);
        this.auth.login('admin', 'admin', this.setting.getProviders()).subscribe(
            () => {
                this.isLoggedIn = true;
            }
        );
        this.schemaColumn = [
            {type: 'text', key: 'name', title: 'Name', cssClass: 'full-width name-column', sortable: true}
            // {type: 'text', key: 'created', title: 'Created', sortable: true}
        ];

    }

    onFilterClick(event: any) {
        this.taskFilter = event;
        this.activititasklist.load(this.taskFilter);
    }

    onRowClick(taskId) {
        this.currentTaskId = taskId;
        this.activitidetails.loadDetails(this.currentTaskId);
    }

}

bootstrap(ActivitiTaskListDemo, [
        HTTP_PROVIDERS,
        ALFRESCO_CORE_PROVIDERS]
);
