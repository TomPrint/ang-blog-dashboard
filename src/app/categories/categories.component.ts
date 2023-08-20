import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  formCategory: string = '';
  formStatus: string= 'Add';
  categoryId: string=''
  

  constructor(private categoryService: CategoriesService) {}

  ngOnInit(): void {
    this.categoryService.getData().subscribe((data: Category[]) => {
      this.categories = data;
      console.log(this.categories);
    });
  }

  onSubmit(formData: any) {
    if (this.formStatus === 'Add') {
      let categoryData: Category = {
        category: formData.value.category
      };
      this.categoryService.saveData(categoryData);
      formData.reset();
    } else if (this.formStatus === 'Edit') {
    // Create a partial category object with the updated category value
      let updatedCategory: Partial<Category> = {
        category: formData.value.category
      };
      this.categoryService.updateData(this.categoryId, updatedCategory);
      formData.reset();
      this.formStatus = 'Add'; // Reset the form status after editing
    }
  }

  onEdit(category: any, id: any){
    this.formCategory = category
    this.formStatus = 'Edit'
    this.categoryId = id;
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteData(id);
    }
  }

}
