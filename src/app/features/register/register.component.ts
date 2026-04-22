import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/api/auth.api.service';
import { CategoryService } from '../../core/services/api/category.api.service';
import { Category } from '../../core/models/api.models';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  private subs = new Subscription();
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: ['buyer' as 'buyer' | 'seller', [Validators.required]],
      candidateProfile: this.fb.group({
        roleTitle: [''],
        subcategoryId: [''],
        experience: [0],
        location: [''],
        priceFrom: [0],
        skills: [''],
        bio: [''],
        goals: [''],
        availability: [''],
        interests: [''],
        profileImage: [''],
      }),
    },
    { validators: [RegisterComponent.passwordsMatchValidator] }
  );

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    // Apply seller-only validation rules dynamically
    this.applyRoleBasedCandidateProfileValidation(this.form.controls.role.value ?? 'buyer');
    this.subs.add(
      this.form.controls.role.valueChanges.subscribe((role) => {
        this.applyRoleBasedCandidateProfileValidation(role ?? 'buyer');
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.errorMessage = 'Please check the form for errors. Ensure all required fields are filled correctly.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = this.buildRegisterPayload();
    // IMPORTANT: log final payload before API call
    console.log('Register payload:', payload);

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (err: HttpErrorResponse) => {
        // Log full backend error body for debugging 500s
        console.error('Register error:', {
          status: err?.status,
          statusText: err?.statusText,
          url: err?.url,
          error: err?.error,
          message: err?.message,
        });
        this.errorMessage =
          err?.error?.message ||
          err?.error?.error ||
          (typeof err?.error === 'string' ? err.error : '') ||
          'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private buildRegisterPayload(): any {
    const v = this.form.getRawValue();
    const base = {
      name: (v.name ?? '').trim(),
      email: (v.email ?? '').trim(),
      password: v.password ?? '',
      role: v.role,
    };

    if (v.role !== 'seller') {
      // buyer: do NOT send candidateProfile at all
      return base;
    }

    const p = v.candidateProfile ?? ({} as any);
    return {
      ...base,
      candidateProfile: {
        roleTitle: (p.roleTitle ?? '').trim(),
        subcategoryId: p.subcategoryId ?? '',
        experience: Number(p.experience ?? 0),
        location: (p.location ?? '').trim(),
        priceFrom: Number(p.priceFrom ?? 0),
        skills: (p.skills ?? '').trim(),
        bio: (p.bio ?? '').trim(),
        goals: (p.goals ?? '').trim(),
        availability: (p.availability ?? '').trim(),
        interests: (p.interests ?? '').trim(),
        profileImage: (p.profileImage ?? '').trim(),
      },
    };
  }

  private applyRoleBasedCandidateProfileValidation(role: 'buyer' | 'seller') {
    const group = this.form.controls.candidateProfile;
    const roleTitle = group.controls.roleTitle;
    const subcategoryId = group.controls.subcategoryId;
    const experience = group.controls.experience;
    const location = group.controls.location;
    const priceFrom = group.controls.priceFrom;
    const skills = group.controls.skills;
    const availability = group.controls.availability;

    if (role === 'seller') {
      roleTitle.setValidators([Validators.required, Validators.minLength(2)]);
      subcategoryId.setValidators([Validators.required]);
      experience.setValidators([Validators.required, Validators.min(0)]);
      location.setValidators([Validators.required, Validators.minLength(2)]);
      priceFrom.setValidators([Validators.required, Validators.min(1)]);
      skills.setValidators([Validators.required, Validators.minLength(2)]);
      availability.setValidators([Validators.required]);
    } else {
      roleTitle.clearValidators();
      subcategoryId.clearValidators();
      experience.clearValidators();
      location.clearValidators();
      priceFrom.clearValidators();
      skills.clearValidators();
      availability.clearValidators();
      // keep values but ensure they don't block buyer registration
    }

    roleTitle.updateValueAndValidity({ emitEvent: false });
    subcategoryId.updateValueAndValidity({ emitEvent: false });
    experience.updateValueAndValidity({ emitEvent: false });
    location.updateValueAndValidity({ emitEvent: false });
    priceFrom.updateValueAndValidity({ emitEvent: false });
    skills.updateValueAndValidity({ emitEvent: false });
    availability.updateValueAndValidity({ emitEvent: false });
  }

  private static passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Set the profile image control value to the base64 string
        this.form.get('candidateProfile.profileImage')?.setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
}
