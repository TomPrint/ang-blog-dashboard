import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  postForm!: FormGroup;
  post: any;
  formStatus: string = 'Add New';
  docId!: string;

  constructor (
    private categoriesService: CategoriesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private postService: PostsService
  ) {
    this.route.queryParams.subscribe(val => {
      this.docId = val['id'];

      if (this.docId) {
        this.postService.getDataById(val['id']).subscribe(post => {
          this.post = post;
          this.createForm(); // Create the form when post data is available
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        });
      } else {
        this.createForm(); // Create the form with empty/default values when there's no post data
      }
    });
  }

  ngOnInit(): void {
    this.categoriesService.getData().subscribe(val => {
      this.categories = val;
    });
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, "-");
  }

  showPreview(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = e.target?.result;
      };
      reader.readAsDataURL(file);
      this.selectedImg = file;
    }
  }

  onSubmit() {
    const formData = this.postForm.value;
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

    this.postService.uploadImage(this.selectedImg, postData, this.formStatus, this.docId);
    this.postForm.reset();
    this.imgSrc = './assets/placeholder-image.png';
  }

  // Create the form with default values or post data
  private createForm() {
    this.postForm = this.fb.group({
      title: [this.post ? this.post.title : '', [Validators.required, Validators.minLength(10)]],
      permalink: [this.post ? this.post.permalink : '', Validators.required],
      excerpt: [this.post ? this.post.excerpt : '', [Validators.required, Validators.minLength(50)]],
      category: [this.post ? `${this.post.category.categoryId}-${this.post.category.category}` : '', Validators.required],
      postImg: ['', Validators.required],
      content: [this.post ? this.post.content : '', Validators.required]
    });
  }
}
