import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import * as ts from "typescript";

@Component({
  selector: '[app-row-ratio]',
  templateUrl: './row-ratio.component.html',
  styleUrls: ['./row-ratio.component.css']
})
export class RowRatioComponent implements OnInit {
  @Input() data:Array<any> = [];
  @Input() name:string = '';
  @Input() prop:string = '';
  @Input() success:string = '';
  @Input() danger:string = '';

  constructor() { }

  ngOnInit(): void {
  }

  check_condition(value:any, condition:string){
    if(condition != ''){
      let code = "value " + condition
      return eval(code)
    }
    return false
  }

}
