import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Company } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private _firestore: AngularFirestore) { }

  save_company(company:any){
    let obj = Object.assign({date: new Date()}, company);
    delete obj['_api'];

    
    return this._firestore.collection('ideas').add(obj)
      .then(() => {
        console.log("Company saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving company: ", error);
      });
  }
}
