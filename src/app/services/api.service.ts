import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseurl='https://financialmodelingprep.com/api/v3/'
  apikey = '';

  constructor(private http: HttpClient) { }

  private load_api(){

    let temp_apikey = localStorage.getItem('apikey')
    if (temp_apikey != null)
      this.apikey = temp_apikey
  }

  private set_apikey(){
    if (this.apikey=='')
      this.load_api()
  }

  // Error handling
  private errorHandl(error:any) {
    console.log('Error handle', error)
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  public get_ratios(ticker:string){
    this.set_apikey();

    return this.http
    .get(this.baseurl + `ratios-ttm/${ticker}?apikey=${this.apikey}`)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public get_ratios_historical(ticker:string){
    this.set_apikey();

    return this.http
    .get(this.baseurl + `ratios/${ticker}?apikey=${this.apikey}`)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public get_price(ticker:string){
    this.set_apikey();

    return this.http
    .get(this.baseurl + `quote-short/${ticker}?apikey=${this.apikey}`)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  

  
}
