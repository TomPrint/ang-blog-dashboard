import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, getDocs, query, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, getStorage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: Storage, private firestore: Firestore, private toastr: ToastrService) { }

  uploadImage(selectedImage: any, postData: any) {
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

        // Save post data to Firestore
        return addDoc(collection(this.firestore, 'posts'), postData);
      })
      .then(() => {
        console.log('Post Data Saved Successfully');
        this.toastr.success('Post Saved Successfully');
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        this.toastr.error('Error uploading post.');
      });
  }
}



