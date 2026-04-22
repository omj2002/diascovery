import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  LucideAngularModule,
  Search,
  ChevronDown,
  Code,
  Trophy,
  Utensils,
  MoreHorizontal,
  Star,
  MapPin,
  Heart,
  CheckCircle,
  SearchX,
  ArrowRight,
  Check,
  User,
  Clock,
  MessageSquare,
  Activity,
  Gavel,
  Music,
  Camera,
  Book,
  Pen,
  Film,
  Briefcase,
  Palette,
  Cpu,
  Dumbbell,
  Hammer,
  Stethoscope,
  Landmark,
  GraduationCap,
  Plane,
  ShoppingCart,
  Wrench,
  Zap,
  Globe,
  Users,
  LogOut,
  Mail,
  Calendar,
  X
} from 'lucide-angular';

const icons = {
  Search, ChevronDown, Code, Trophy, Utensils, MoreHorizontal,
  Star, MapPin, Heart, CheckCircle, SearchX, ArrowRight, Check,
  User, Clock, MessageSquare, Activity, Gavel, Music, Camera,
  Book, Pen, Film, Briefcase, Palette, Cpu, Dumbbell, Hammer,
  Stethoscope, Landmark, GraduationCap, Plane, ShoppingCart,
  Wrench, Zap, Globe, Users, LogOut, Mail, Calendar, X
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick(icons))
  ],
};
