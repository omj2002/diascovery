export interface Category {
    id: string;
    title: string;
    description: string;
    image: string;
    icon: string;
    subcategories: Subcategory[];
}

export interface Subcategory {
    id: string;
    title: string;
    categoryId: string;
}

export interface Candidate {
    id: string;
    name: string;
    role: string;
    roleId: string; // matches subcategory ID
    skills: string[];
    experience: number;
    location: string;
    profileImage: string;
    rating: number;
    reviewCount: number;
    priceFrom: number;
    bio: string;
    projects?: Project[];
}

export interface Project {
    title: string;
    description: string;
    image: string;
}
