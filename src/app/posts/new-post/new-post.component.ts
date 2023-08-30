import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';



@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  imgSrc: any = './assets/placeholder-image.png';
  selectedImg: any;
  categories: Array<Category> = [];
  postForm: FormGroup

  constructor (private categoriesService: CategoriesService, private fb: FormBuilder, private postService: PostsService) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: ['', Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      postImg: ['',  Validators.required],
      content: ['',  Validators.required]
    })
    
  }

  ngOnInit(): void {
    this.categoriesService.getData().subscribe(val=>{
        this.categories = val;
        console.log(this.categories)
    });
    
  }

  get fc() {
    return this.postForm.controls;
  }



  onTitleChanged($event: any){
    // console.log($event.target.value);
    const title = $event.target.value;
   this.permalink= title.replace(/\s/g, "-");
    // console.log(this.permalink);
  }

  showPreview(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader(); 
      reader.onload = (e) => {
        this.imgSrc = e.target?.result;
      };
      
      reader.readAsDataURL(file);
      this.selectedImg = file
      // console.log(this.selectedImg);
    }
  }

  onSubmit() {
    const formData = this.postForm.value;

    // Splitting the category string
    const splitted = formData.category.split("-");

    const postData: Post = {
      title: formData.title,
      permalink: formData.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: '',
      excerpt: formData.excerpt,
      content: formData.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date()
    };

    console.log(postData);
    this.postService.uploadImage(this.selectedImg, postData);
}

}
