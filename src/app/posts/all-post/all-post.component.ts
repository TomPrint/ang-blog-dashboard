import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/post';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp from Firebase

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postService.getData().subscribe((data: Post[]) => {
      this.posts = data.map((post: Post) => ({
        ...post,
        createdAt: (post.createdAt as any as Timestamp).toDate()
      }));
      console.log(this.posts);
    });
  }

  onDelete(postImgPath: string, id: any)
  {   if (confirm('Are you sure you want to delete this category?')) {
    this.postService.deleteImage(postImgPath, id);} 
  }

  onFeatured(id: any, value: boolean) {
    const featuredData = {
      isFeatured: value
    };
    this.postService.markFeatured(id, featuredData);
  }

}
