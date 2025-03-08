// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  returnUrl: string = '/';
  error: string = '';
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.redirectBasedOnRole();
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Easy access to form fields
  get f() { 
    return this.loginForm.controls; 
  }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(
      this.f['email'].value,
      this.f['password'].value,
      this.f['rememberMe'].value
    )
    .pipe(first())
    .subscribe(
      data => {
        this.redirectBasedOnRole();
      },
      error => {
        this.error = error.error?.message || 'Identifiants incorrects. Veuillez réessayer.';
        this.loading = false;
      }
    );
  }

  redirectBasedOnRole() {
    const userRole = this.authService.getUserRole();
    
    switch(userRole) {
      case 'ROLE_SPORTIF':
        this.router.navigate(['/sportif/dashboard']);
        break;
      case 'ROLE_COACH':
        this.router.navigate(['/coach/dashboard']);
        break;
      case 'ROLE_RESPONSABLE':
        this.router.navigate(['/admin/dashboard']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}