import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../model/application';

@Component({
  selector: 'app-formcomponent',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formcomponent.html',
  styleUrl: './formcomponent.css',
})
export class Formcomponent {


  constructor(public applicationService: ApplicationService) { }

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    affair: new FormControl('', [Validators.required]),
    cv: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    msg: new FormControl('')
  });

  onSubmit() {
    const formValue = this.formGroup.value;

    const newApplication: Application = {
      name: formValue.name || '',
      email: formValue.email || '',
      phone: formValue.phone || '',
      cv: formValue.cv || '',
      affair: formValue.affair || '',
      msg: formValue.msg || '',
      status: 'ENVIADO',
      date: new Date()
    };

    this.applicationService.addApplication(newApplication).subscribe({
      next: (response) => {
        console.log('Application added successfully:', response);
      },
      error: (error) => {
        console.error('Error adding application:', error);
      }
    });
  }
}