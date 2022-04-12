import { ApiService } from "../services/api.service";
import { forkJoin, Observable } from "rxjs";

export class Company {
    ticker: string

    currentRatio?: number
    quickRatio?: number
    cashRatio?: number
    debtEquity?: number
    inventoryTurnover?: number
    daysInventory?: number
    assetTurnover?: number
    returnOnEquity?: number
    netMargin?: number
    priceEarnings?: number
    priceCashFlow?: number
    priceToSales?: number
    priceBookValue?: number

    priceEarnings5Y?: number
    priceToSales5Y?: number
    priceBookValue5Y?: number

    priceEarningsValue?: number
    priceToSalesValue?: number
    priceBookValueValue?: number

    price?: number
    valueByHistorical?: number
    valueByIndustry?: number
    valueIntrinsic?: number

    constructor(private _api: ApiService, ticker: string, is_target: boolean = false, data?: any) {
        this.ticker = ticker;

        if (data != null) {
            this.currentRatio = data['currentRatioTTM'];
            this.quickRatio = data['quickRatioTTM'];
            this.cashRatio = data['cashRatioTTM'];
            this.debtEquity = data['debtEquityRatioTTM'];
            this.inventoryTurnover = data['inventoryTurnoverTTM'];
            this.daysInventory = data['daysOfInventoryOutstandingTTM'];
            this.assetTurnover = data['assetTurnoverTTM'];
            this.returnOnEquity = data['returnOnEquityTTM'] * 100;
            this.netMargin = data['netProfitMarginTTM'] * 100;
            this.priceEarnings = data['priceEarningsRatioTTM'];
            this.priceCashFlow = data['priceCashFlowRatioTTM'];
            this.priceToSales = data['priceToSalesRatioTTM'];
            this.priceBookValue = data['priceBookValueRatioTTM'];
        }

        if (is_target) {

            forkJoin({
                hist: this.set_hitorical_ratios(),
                price: this.set_price()
            }).subscribe(list => {
                this.set_hitorical_values()
            });
        }

    }

    private avg(arr: Array<any>, prop: string) {
        return arr.reduce((total, current) => total += current[prop], 0) / arr.length
    }

    set_hitorical_ratios() {
        return new Observable(subscriber => {
            setTimeout((_: any) => {
                this._api.get_ratios_historical(this.ticker).subscribe((res) => {
                    let list = res as Array<any>;
                    if (list.length > 5)
                        list = list.slice(0, 5);

                    this.priceEarnings5Y = this.avg(list, 'priceEarningsRatio')
                    this.priceToSales5Y = this.avg(list, 'priceToSalesRatio')
                    this.priceBookValue5Y = this.avg(list, 'priceBookValueRatio')
                    console.log('2 ' + this.ticker + ' historical ratios obtained successfully');

                    subscriber.next(res)
                    subscriber.complete()
                }, err => subscriber.error(err))
            }, 100);
        });


    }



    set_price() {
        return new Observable(subscriber => {
            setTimeout((_: any) => {
                return this._api.get_price(this.ticker).subscribe((res) => {
                    let list = res as Array<any>;
                    this.price = list[0]['price'];
                    console.log('3 ' + this.ticker + ' stock price obtained successfully');

                    subscriber.next(res)
                    subscriber.complete()
                }, err => subscriber.error(err))
            }, 750);
        });
    }

    set_hitorical_values() {
        this.priceEarningsValue = (this.price! * this.priceEarnings!) / this.priceEarnings5Y!
        this.priceToSalesValue = (this.price! * this.priceToSales!) / this.priceToSales5Y!
        this.priceBookValueValue = (this.price! * this.priceBookValue!) / this.priceBookValue5Y!
        this.valueByHistorical = (this.priceEarningsValue + this.priceToSalesValue + this.priceBookValueValue) / 3

        console.log('4 '+ this.ticker + ' historical value calculated successfully');
    }

    set_industry_values(obj_avg: any) {
        let assessment_props = ['priceEarnings', 'priceCashFlow', 'priceToSales', 'priceBookValue'];
        let values_ratios = [];

        if (this.price != null){
            for (let prop of assessment_props)
                values_ratios.push((this.price! * obj_avg[prop]) / (<any>this)[prop]);

            this.valueByIndustry = values_ratios.reduce((a, b) => a + b, 0);

            this.valueIntrinsic = (this.valueByIndustry + this.valueByHistorical!) / 2

            console.log('5 ' + this.ticker + ' industry value calculated successfully');
        }else{
            console.log(this.ticker + ' waiting until price value');
            setTimeout((_:any)=>{this.set_industry_values(obj_avg)}, 200)
        }
    }




}