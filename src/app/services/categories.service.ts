import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, collectionData, getDocs, query, updateDoc, doc, deleteDoc} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private firestore: Firestore, private toastr: ToastrService) {
    this.getData();
   }
 
  saveData(data: Category) {
    
    const collectionInstance = collection(this.firestore, 'categories');
    addDoc(collectionInstance, data)
      .then(() => {
        console.log('Category Data Saved Successfully')
        this.toastr.success("Category Saved Successfully");
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  // getData(){
  //   const collectionInstance = collection(this.firestore, 'categories');
  //   collectionData(collectionInstance).subscribe(val =>{
  //     console.log(val)
  //   })
  // }

  
  getData(): Observable<Category[]> {
    const collectionInstance = collection(this.firestore, 'categories');
    const queryRef = query(collectionInstance);

    return collectionData(queryRef, { idField: 'id' }).pipe(
      map(querySnapshot => querySnapshot as Category[])
    );
  }


  updateData(id: string, updatedCategory: Partial<Category>): Promise<void> {
    const docRef = doc(this.firestore, 'categories', id);
  
    return updateDoc(docRef, updatedCategory)
      .then(() => {
        console.log('Category Data Updated Successfully');
        this.toastr.success('Category Updated Successfully');
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }

  deleteData(id: string): void {
    const docInstance = doc(this.firestore, 'categories', id);
    deleteDoc(docInstance)
      .then(() => {
        console.log('Category Data Deleted Successfully');
        this.toastr.success('Category Deleted Successfully');
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
      });
  }


}
