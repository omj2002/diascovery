import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '../../core/services/api/category.api.service';
import { Category } from '../../core/models/api.models';

@Component({
    selector: 'app-category-details',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule],
    templateUrl: './category-details.component.html',
    styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {
    category: Category | undefined;

    constructor(
        private categoryService: CategoryService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.categoryService.getCategories().subscribe(cats => {
                    this.category = cats.find(c => c.id === id);
                });
            }
        });
    }
}
