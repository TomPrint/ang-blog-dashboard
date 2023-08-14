import { Component } from '@angular/core';
import {Firestore, collection, addDoc, doc, setDoc} from '@angular/fire/firestore';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  constructor(private firestore: Firestore){}


  onSubmit(formData: any) {

    let categoryData = {
      category: formData.value.category,
      status: 'active'
    }

    let subCategoryData = {
      subCategory: 'subCategory1'
    }

    const collectionInstance = collection(this.firestore, 'categories');
    addDoc(collectionInstance, categoryData)
      .then((categoryDocRef) => {
        console.log('Category Data Saved Successfully');

        
        const subCollectionRef = collection(categoryDocRef, 'subCategories');
        return addDoc(subCollectionRef, subCategoryData);
      })
      .then(() => {
        console.log('SubCategory Data Saved Successfully');
      })
      .catch((error) => {
        console.log('Error:', error);
      });
      

  }

}


