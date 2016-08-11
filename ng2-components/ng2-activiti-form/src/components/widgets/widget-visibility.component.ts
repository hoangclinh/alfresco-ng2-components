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

import { FormModel } from './widget.model';
import { VisibilityFormWidget } from './widget-visibility.model';


export class VisibilityCheckForm {

    public getVisiblityForForm(form: FormModel,visibilityObj: VisibilityFormWidget): boolean {
        let isLeftFieldPresent = visibilityObj.leftFormFieldId || visibilityObj.leftRestResponseId
        if(!isLeftFieldPresent){
            return true;
        }else{
            return this.evaluateVisibilityForField(form, visibilityObj);
        }
    }

    private evaluateVisibilityForField(form: FormModel, visibilityObj: VisibilityFormWidget): boolean {
       if(!visibilityObj.nextCondition){
            let leftValue = this.getLeftValue(form, visibilityObj);
            let rightValue = this.getRightValue(form, visibilityObj);
            return this.evaluateCondition(leftValue, rightValue, visibilityObj.operator);
       }else{
            let nextVisibilityCondition = <VisibilityFormWidget> visibilityObj.nextCondition;
            return this.evaluateVisibilityForField(form, nextVisibilityCondition);
       }
    }

    public getLeftValue(form: FormModel, visibilityObj: VisibilityFormWidget): any{
        if(visibilityObj.leftFormFieldId){
            let leftValue = this.getFormValueByName(form, visibilityObj.leftFormFieldId);
            return leftValue;
        }else{
           return visibilityObj.leftRestResponseId;
        }
    }

    private getRightValue(form: FormModel,visibilityObj: VisibilityFormWidget): any{
        if(visibilityObj.rightFormFieldId){
            let leftValue = this.getFormValueByName(form, visibilityObj.rightFormFieldId);
            return leftValue;
        }else if(visibilityObj.rightValue){
            return visibilityObj.rightValue;
        }else{
           return visibilityObj.rightRestResponseId;
        }
    }

    private getFormValueByName(form: FormModel, fieldName : string):  any {
         let firstFieldLength = Object.keys(form.json.fields).length;
         for (var i = 0; i < firstFieldLength; i++){
            let secondFieldLength = Object.keys(form.json.fields[i].fields).length;
             for( var j = 1; j <= secondFieldLength; j++){
                let res = form.json.fields[i].fields[j].find(field => field.id ===fieldName);
                if(res)
                    return res.value;
             }
         }
         return null;
    }


    private evaluateCondition(leftValue: string, rightValue: string, operator: string): boolean{
        switch(operator) {
            case "==":
                return leftValue === rightValue;
            case "<":
                return leftValue < rightValue;
            case "!=":
                return leftValue !== rightValue;
        };
    }

}


