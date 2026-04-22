export interface Subcategory {
  id: string;
  title: string;
  categoryId: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  // Candidate entity contains user_id (used as seller/buyer id for chat)
  userId?: string;
  // Sometimes backend may serialize as snake_case
  user_id?: string;
  roleEntity?: Subcategory;
  skills: CandidateSkill[];
  experience: number;
  location: string;
  profileImage: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  bio: string;
  goals?: string;
  availability?: string;
  interests?: string;
  projects?: Project[];
}

export interface CandidateSkill {
  id?: number;
  skill: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  projectType?: string;
  requiredRoles?: string;
  requiredSkills?: string;
  status?: string;
  teamSize?: number;
  ownerId?: string;
}

export interface ProjectInvitation {
  id: string;
  project: Project;
  candidate: Candidate;
  senderId: string;
  status: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  // Back-end fields
  buyerId: string;
  sellerId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  createdAt?: string;

  // Optional fields (older frontend expectations)
  otherPartyName?: string;
  otherPartyImage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;

  // Optional alias (if you already used it in UI somewhere)
  timestamp?: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface CandidateFilters {
  search?: string;
  category?: string;
  roleId?: string;
  location?: string;
  minExp?: number;
  maxExp?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  size?: number;
}
