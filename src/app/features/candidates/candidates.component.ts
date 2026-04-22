import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '../../core/services/api/category.api.service';
import { CandidateService } from '../../core/services/api/candidate.api.service';
import { Candidate, Category } from '../../core/models/api.models';
import { CandidateCardComponent } from '../../shared/components/candidate-card/candidate-card.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-candidates',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule, CandidateCardComponent, FormsModule],
    templateUrl: './candidates.component.html',
    styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent implements OnInit {
    candidates: Candidate[] = [];
    categories: Category[] = [];

    // URL-driven filters
    selectedCategoryId: string = '';
    selectedCategoryName: string = '';
    searchQuery: string = '';

    // Sidebar filters (local state)
    locationQuery: string = '';
    selectedMinExp: number | null = null;
    selectedMaxExp: number | null = null;
    maxPrice: number | null = null;

    sortBy: string = 'rating';
    totalElements: number = 0;
    pageSize: number = 10;
    currentPage: number = 0;

    constructor(
        private categoryService: CategoryService,
        private candidateService: CandidateService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.categoryService.getCategories().subscribe(cats => {
            this.categories = cats;
            // Resolve category name once categories are loaded (in case route params came first)
            if (this.selectedCategoryId) {
                const found = cats.find(c => c.id === this.selectedCategoryId);
                this.selectedCategoryName = found ? found.title : this.selectedCategoryId;
            }
        });

        this.route.queryParams.subscribe(params => {
            this.searchQuery = params['search'] || '';
            this.selectedCategoryId = params['category'] || '';
            const roleId = params['roleId'] || '';
            this.currentPage = 0;
            // Resolve the human-readable name from already-loaded categories
            if (this.selectedCategoryId && this.categories.length) {
                const found = this.categories.find(c => c.id === this.selectedCategoryId);
                this.selectedCategoryName = found ? found.title : this.selectedCategoryId;
            } else {
                this.selectedCategoryName = '';
            }
            this.loadCandidates(roleId);
        });
    }

    loadCandidates(roleId: string = '') {
        this.candidateService.getCandidates({
            search: this.searchQuery,
            category: this.selectedCategoryId,
            roleId: roleId,
            location: this.locationQuery || undefined,
            minExp: this.selectedMinExp ?? undefined,
            maxExp: this.selectedMaxExp ?? undefined,
            maxPrice: this.maxPrice ?? undefined,
            sort: this.sortBy,
            page: this.currentPage,
            size: this.pageSize
        }).subscribe(page => {
            this.candidates = page.content;
            this.totalElements = page.totalElements;
        });
    }

    onSortChange() {
        this.currentPage = 0;
        this.loadCandidates();
    }

    onFilterChange() {
        this.currentPage = 0;
        this.loadCandidates();
    }

    onExperienceChange(min: number | null, max: number | null) {
        this.selectedMinExp = min;
        this.selectedMaxExp = max;
        this.onFilterChange();
    }

    onPageChange(page: number) {
        this.currentPage = page;
        this.loadCandidates();
    }

    protected readonly Math = Math;
}
