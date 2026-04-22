import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category, Candidate, Subcategory } from '../../shared/models/data.models';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private categories: Category[] = [
        {
            id: 'employees',
            title: 'Digital & Software',
            description: 'Expert developers, designers, and tech specialists.',
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
            icon: 'code',
            subcategories: [
                { id: 'java-dev', title: 'Java Developer', categoryId: 'employees' },
                { id: 'python-dev', title: 'Python Developer', categoryId: 'employees' },
                { id: 'dotnet-dev', title: '.NET Developer', categoryId: 'employees' },
                { id: 'uiux-designer', title: 'UI/UX Designer', categoryId: 'employees' }
            ]
        },
        {
            id: 'sports',
            title: 'Sports & Fitness',
            description: 'Trainers, athletes, and sports professionals.',
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
            icon: 'trophy',
            subcategories: [
                { id: 'cricketer', title: 'Cricketer', categoryId: 'sports' },
                { id: 'footballer', title: 'Footballer', categoryId: 'sports' },
                { id: 'tennis-player', title: 'Tennis Player', categoryId: 'sports' }
            ]
        },
        {
            id: 'chefs',
            title: 'Culinary Arts',
            description: 'World-class chefs and culinary experts.',
            image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
            icon: 'utensils',
            subcategories: [
                { id: 'italian-chef', title: 'Italian Chef', categoryId: 'chefs' },
                { id: 'indian-chef', title: 'Indian Chef', categoryId: 'chefs' },
                { id: 'pastry-chef', title: 'Pastry Chef', categoryId: 'chefs' }
            ]
        },
        {
            id: 'others',
            title: 'Lifestyle & More',
            description: 'Everything else from music to writing.',
            image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800',
            icon: 'more-horizontal',
            subcategories: [
                { id: 'content-writer', title: 'Content Writer', categoryId: 'others' },
                { id: 'video-editor', title: 'Video Editor', categoryId: 'others' },
                { id: 'yoga-instructor', title: 'Yoga Instructor', categoryId: 'others' }
            ]
        }
    ];

    private candidates: Candidate[] = [
        {
            id: '1',
            name: 'Rahul Sharma',
            role: 'Full Stack Java Developer',
            roleId: 'java-dev',
            skills: ['Java', 'Spring Boot', 'Angular', 'PostgreSQL'],
            experience: 5,
            location: 'Bangalore, India',
            profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
            rating: 4.8,
            reviewCount: 124,
            priceFrom: 25,
            bio: 'High performance Java enthusiast with 5 years experience in building scalable web applications. Expert in Spring ecosystem and frontend technologies.'
        },
        {
            id: '2',
            name: 'Sarah Miller',
            role: 'Senior UI/UX Designer',
            roleId: 'uiux-designer',
            skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
            experience: 8,
            location: 'London, UK',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
            rating: 4.9,
            reviewCount: 256,
            priceFrom: 45,
            bio: 'Award-winning designer focusing on creating beautiful, user-centric digital experiences. Over 8 years of industry experience working with Fortune 500 companies.'
        },
        {
            id: '3',
            name: 'Giovanni Rossi',
            role: 'Authentic Italian Chef',
            roleId: 'italian-chef',
            skills: ['Pasta Making', 'Tuscan Cuisine', 'Kitchen Management'],
            experience: 12,
            location: 'Rome, Italy',
            profileImage: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=400',
            rating: 5.0,
            reviewCount: 89,
            priceFrom: 80,
            bio: 'Specializing in traditional Tuscan cuisine. Bringing the real taste of Italy to your kitchen or restaurant event.'
        },
        {
            id: '4',
            name: 'James Wilson',
            role: 'Professional Tennis Coach',
            roleId: 'tennis-player',
            skills: ['ATP Level Coaching', 'Fitness Training', 'Tactical Analysis'],
            experience: 10,
            location: 'Miami, USA',
            profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
            rating: 4.7,
            reviewCount: 45,
            priceFrom: 60,
            bio: 'Certified ATP level coach helping players improve their game from basics to competitive levels.'
        },
        {
            id: '5',
            name: 'Anita Desai',
            role: 'Creative Content Writer',
            roleId: 'content-writer',
            skills: ['Copywriting', 'SEO', 'Creative Writing', 'Editing'],
            experience: 4,
            location: 'Mumbai, India',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
            rating: 4.6,
            reviewCount: 167,
            priceFrom: 15,
            bio: 'Passionate storyteller with a flair for creating engaging content that converts. Helping brands tell their story through impactful copy.'
        }
    ];

    getCategories(): Observable<Category[]> {
        return of(this.categories);
    }

    getCategoryById(id: string): Observable<Category | undefined> {
        return of(this.categories.find(c => c.id === id));
    }

    getCandidates(filters?: any): Observable<Candidate[]> {
        let filtered = [...this.candidates];
        if (filters) {
            if (filters.roleId) {
                filtered = filtered.filter(c => c.roleId === filters.roleId);
            }
            if (filters.categoryId) {
                const cat = this.categories.find(c => c.id === filters.categoryId);
                if (cat) {
                    const subIds = cat.subcategories.map((s: Subcategory) => s.id);
                    filtered = filtered.filter(c => subIds.includes(c.roleId));
                }
            }
            if (filters.search) {
                const query = filters.search.toLowerCase();
                filtered = filtered.filter(c =>
                    c.name.toLowerCase().includes(query) ||
                    c.role.toLowerCase().includes(query) ||
                    c.skills.some((s: string) => s.toLowerCase().includes(query))
                );
            }
        }
        return of(filtered);
    }

    getCandidateById(id: string): Observable<Candidate | undefined> {
        return of(this.candidates.find(c => c.id === id));
    }

    getTopCandidates(): Observable<Candidate[]> {
        return of([...this.candidates].sort((a, b) => b.rating - a.rating).slice(0, 4));
    }
}
