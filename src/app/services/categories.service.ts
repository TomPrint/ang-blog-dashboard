import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private firestore: Firestore) { }
 
  saveData(data:any) {
    
    const collectionInstance = collection(this.firestore, 'categories');
    addDoc(collectionInstance, data)
      .then(() => {
        console.log('Category Data Saved Successfully');
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

}
