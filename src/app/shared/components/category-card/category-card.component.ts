import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../../core/models/api.models';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-category-card',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule],
    templateUrl: './category-card.component.html',
    styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent {
    @Input() category!: Category;
}
