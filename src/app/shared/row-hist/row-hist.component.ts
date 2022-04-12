import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[app-row-hist]',
  templateUrl: './row-hist.component.html',
  styleUrls: ['./row-hist.component.css']
})
export class RowHistComponent implements OnInit {
  @Input() data:any = null;
  @Input() name:string = '';
  @Input() prop:string = '';
  
  constructor() { }

  ngOnInit(): void {
  }
}
