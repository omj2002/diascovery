import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '../../core/services/api/category.api.service';
import { CandidateService } from '../../core/services/api/candidate.api.service';
import { Category, Candidate } from '../../core/models/api.models';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { CandidateCardComponent } from '../../shared/components/candidate-card/candidate-card.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule, CategoryCardComponent, CandidateCardComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    searchQuery: string = '';
    categories: Category[] = [];
    visibleCategories: Category[] = [];
    categoriesToShow: number = 5;
    topCandidates: Candidate[] = [];

    constructor(
        private categoryService: CategoryService,
        private candidateService: CandidateService,
        private router: Router
    ) { }

    ngOnInit() {
        this.categoryService.getCategories().subscribe(cats => {
            this.categories = cats;
            this.updateVisibleCategories();
        });

        this.candidateService.getTopCandidates().subscribe(cands => {
            this.topCandidates = cands;
        });
    }

    onSearch() {
        if (this.searchQuery.trim()) {
            this.router.navigate(['/candidates'], { queryParams: { search: this.searchQuery } });
        }
    }

    updateVisibleCategories() {
        this.visibleCategories = this.categories.slice(0, this.categoriesToShow);
    }

    viewMoreCategories() {
        this.categoriesToShow += 5;
        this.updateVisibleCategories();
    }

    onPopularSearch(term: string) {
        this.searchQuery = term;
        this.onSearch();
    }
}
