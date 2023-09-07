import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, getDocs, query, updateDoc, doc, deleteDoc, where, DocumentData, DocumentReference, docData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, getStorage, deleteObject } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: Storage, 
    private firestore: Firestore, 
    private toastr: ToastrService, 
    private router: Router) {}

  uploadImage(selectedImage: any, postData: any, formStatus: any, id: any) {
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

    const storageRef = ref(this.storage, filePath);

    // Upload the selectedImage as bytes
    uploadBytes(storageRef, selectedImage)
      .then(snapshot => {
        console.log('Upload successful!', snapshot);
        return getDownloadURL(storageRef);
      })
      .then(url => {
        postData.postImgPath = url;
        console.log(postData); 

        if(formStatus =="Edit"){
          this.updateData(id, postData)
        } else{
          // callback for saveData method
          this.saveData(postData);   
        }     
      })

  }

    saveData(postData: any) {
      return addDoc(collection(this.firestore, 'posts'), postData)
      .then(() => {
      
        this.toastr.success('Post Saved Successfully');
        this.router.navigate(['/posts']);
        
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        this.toastr.error('Error uploading post.');
      });
    }

    getData(): Observable<Post[]> {
      const collectionInstance = collection(this.firestore, 'posts');
      const queryRef = query(collectionInstance);
  
      return collectionData(queryRef, { idField: 'id' }).pipe(
        map(querySnapshot => querySnapshot as Post[])
      );
    }

    getDataById(id: string): Observable<Post> {
      const docRef = doc(this.firestore, `posts/${id}`);
      return docData(docRef).pipe(
        map((post: any) => {
          if (post) {
            return { ...post, id: id }; // Set the id property correctly
          } else {
            return console.error("Erorr - id does not exist");
            ; 
          }
        })
      );
    }
    
    updateData(id: string, postData: any){
      const docRef = doc(this.firestore, `posts/${id}`)
      return updateDoc (docRef, postData).then(()=>{
        this.toastr.success('Post Updated Successfully');
        this.router.navigate(['/posts']);
      })
    }

    deleteImage(postImgPath: any, id: string){
      const storageRef = ref(this.storage, postImgPath);
      return deleteObject(storageRef).then(()=>{
        this.deleteData(id)

      })
    }

    deleteData(id: string): void {
      const docInstance = doc(this.firestore, 'posts', id);
      deleteDoc(docInstance)
        .then(() => {
          console.log('Post Data Deleted Successfully');
          this.toastr.warning('Post Deleted Successfully');
        })
        .catch((error) => {
          console.error('Error deleting Post:', error);
        });
    }

  }


