// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Validateur personnalisé pour vérifier si les mots de passe correspondent
export const matchingPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { matching: true }
    : null;
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  error: string = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Rediriger vers la page d'accueil si l'utilisateur est déjà connecté
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      niveau: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: matchingPasswordsValidator
    });
  }

  // Accès facile aux contrôles de formulaire
  get f() { 
    return this.registerForm.controls; 
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  onSubmit() {
    this.submitted = true;

    // Arrêter ici si le formulaire est invalide
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Préparation des données pour l'API
    const userData = {
      nom: this.f['nom'].value,
      prenom: this.f['prenom'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      niveau_sportif: this.f['niveau'].value,
      role: 'ROLE_SPORTIF' // Par défaut, tous les nouveaux utilisateurs sont des sportifs
    };

    this.authService.register(userData)
      .pipe(first())
      .subscribe(
        data => {
          // Connexion automatique après inscription réussie
          this.authService.login(userData.email, userData.password, false)
            .pipe(first())
            .subscribe(
              () => {
                // Rediriger vers le tableau de bord sportif
                this.router.navigate(['/sportif/dashboard']);
              },
              error => {
                this.error = "Inscription réussie mais échec de connexion automatique. Veuillez vous connecter manuellement.";
                this.loading = false;
                this.router.navigate(['/login']);
              }
            );
        },
        error => {
          this.error = error.error?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
          if (error.error?.violations) {
            // Gestion des erreurs de validation spécifiques à Symfony
            this.handleValidationErrors(error.error.violations);
          }
          this.loading = false;
        }
      );
  }

  private handleValidationErrors(violations: any[]) {
    violations.forEach(violation => {
      const fieldName = violation.propertyPath;
      if (this.registerForm.get(fieldName)) {
        this.registerForm.get(fieldName)?.setErrors({ 
          serverError: violation.message 
        });
      }
    });
  }
}