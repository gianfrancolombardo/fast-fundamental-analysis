import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInUpOnEnterAnimation, fadeOutUpOnLeaveAnimation, fadeInLeftOnEnterAnimation, fadeOutRightOnLeaveAnimation } from 'angular-animations';
import { Company } from './models/company.model';
import { ApiService } from './services/api.service';
import { RowRatioComponent } from './shared/row-ratio/row-ratio.component';


import { forkJoin, Observable } from 'rxjs';
import { ViewportScroller } from '@angular/common';

enum Status {
  None,
  Working,
  Done
}

enum Positions {
  Target,
  Comp1,
  Comp2,
  Avg
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fadeInUpOnEnterAnimation({ duration: 300, translate: '50px' })
  ]
})
export class AppComponent {
  STATUS = Status;
  show_modal_apikey = true;
  apikey = "";

  main_form: FormGroup;
  main_status = Status.None;
  main_data: Company[] = [];

  constructor(private _formbuilder: FormBuilder, private _scroller: ViewportScroller, private _api: ApiService) {
    this.load_apikey()

    this.main_form = this._formbuilder.group({
      target: ['AAPL', Validators.required],
      comp1: ['MSFT', Validators.required],
      comp2: ['GOOG', Validators.required],
    })
  }

  // API KEY ---------------------------------------*
  toogle_modal_apikey() {
    this.show_modal_apikey = !this.show_modal_apikey
  }

  there_is_apikey() {
    return this.apikey != "";
  }

  load_apikey() {
    let temp_apikey = localStorage.getItem('apikey')
    if (temp_apikey != null) {
      this.apikey = temp_apikey
      this.show_modal_apikey = false
    }
  }

  save_apikey() {
    if (this.there_is_apikey()) {
      localStorage.setItem('apikey', this.apikey)
      this.show_modal_apikey = false
    }
  }

  // Functional Analysis --------------------------------*

  get_target() {
    return this.main_data[Positions.Target];
  }

  avg(arr: Array<any>, prop: string) {
    return arr.reduce((total, current) => total += current[prop], 0) / arr.length;
  }

  get_avg_obj() {
    let obj_avg = (<any>new Company(this._api, 'AVG'));
    let props = Object.getOwnPropertyNames(this.get_target());

    for (let prop of props) {
      if (!['ticker'].includes(prop)) {
        obj_avg[prop] = this.avg(this.main_data, prop);
      }
    }

    return obj_avg;
  }

  start_analyze() {

    if (this.main_form.valid) {
      
      this.main_status = Status.Working;
      this.main_data = new Array(3).fill(null);

      this._scroller.scrollToAnchor("analysis");

      forkJoin({
        target: this.add_company(this.main_form.value.target, true, Positions.Target, 0),
        comp1: this.add_company(this.main_form.value.comp1, false, Positions.Comp1, 750),
        comp2: this.add_company(this.main_form.value.comp2, false, Positions.Comp2, 1500),
      }).subscribe(list => {
        let obj_avg = this.get_avg_obj();
        this.main_data.push(obj_avg)
        this.get_target().set_industry_values(obj_avg);

        this._scroller.scrollToAnchor("analysis");

        this.main_status = Status.Done
      })


    }
  }

  add_company(ticker: string, target: boolean, index:number, sleep: number) {
    return new Observable(subscriber => {
      setTimeout((_:any) => {
        this._api.get_ratios(ticker).subscribe((data: any) => {
          let obj = new Company(this._api, ticker, target, data[0]);
          this.main_data[index] = obj;
          console.log('1 ' + ticker + ' ratios ttm obtained successfully')

          subscriber.next(obj)
          subscriber.complete()
        }, err => subscriber.error(err))
      }, sleep);
    });
  }

  is_liquidity() {
    let target = this.get_target();
    let avg = (target.currentRatio! + target.quickRatio! + target.cashRatio!) / 3;
    return avg >= 1;
  }

  is_solvency() {
    return this.get_target().debtEquity! < 1;
  }

  is_efficiency() {
    return true;
  }

  is_profitability() {
    let target = this.get_target();
    if (target.returnOnEquity! > 10 && target.netMargin! > 10)
      return 0
    else if (target.returnOnEquity! > 10 || target.netMargin! > 10)
      return 1
    else
      return 2
  }

  is_assessment() {
    return true
  }
}
