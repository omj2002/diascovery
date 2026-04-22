import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '../../services/api/category.api.service';
import { Category } from '../../models/api.models';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule, LucideAngularModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    searchQuery: string = '';
    isScrolled: boolean = false;
    showCategoriesDropdown: boolean = false;
    categories: Category[] = [];
    isLoggedIn: boolean = false;
    userName: string = '';
    showUserDropdown: boolean = false;

    constructor(private categoryService: CategoryService, private router: Router) { }

    ngOnInit() {
        window.addEventListener('scroll', () => {
            this.isScrolled = window.scrollY > 20;
        });

        this.categoryService.getCategories().subscribe(cats => {
            this.categories = cats;
        });

        this.checkLoginState();

        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            this.checkLoginState();
        });
    }

    checkLoginState() {
        this.isLoggedIn = !!localStorage.getItem('token');
        this.userName = localStorage.getItem('name') || 'User';
    }

    onSearch() {
        if (this.searchQuery.trim()) {
            this.router.navigate(['/candidates'], { queryParams: { search: this.searchQuery } });
        }
    }

    toggleDropdown() {
        this.showCategoriesDropdown = !this.showCategoriesDropdown;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    }
}
