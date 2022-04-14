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

  public load_key(){
    let temp_apikey = localStorage.getItem('apikey')
    if (temp_apikey != null)
      this.apikey = temp_apikey
    return this.apikey;
  }

  public save_key(key:string){
    if (key!=null) {
      this.apikey = key;
      localStorage.setItem('apikey', key)
    }
  }

  private set_key(){
    if (this.apikey=='')
      this.load_key()
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
    this.set_key();

    return this.http
    .get(this.baseurl + `ratios-ttm/${ticker}?apikey=${this.apikey}`)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public get_ratios_historical(ticker:string){
    this.set_key();

    return this.http
    .get(this.baseurl + `ratios/${ticker}?apikey=${this.apikey}`)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  public get_price(ticker:string){
    this.set_key();

    return this.http
    .get(this.baseurl + `quote-short/${ticker}?apikey=${this.apikey}`)
    .pipe(retry(1), catchError(this.errorHandl));
  }

  

  
}
