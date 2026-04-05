import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import Swal from 'sweetalert2'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formcomponent',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formcomponent.html',
  styleUrl: './formcomponent.css',
})
export class Formcomponent {

  selectedFile!: File;

  constructor(public applicationService: ApplicationService, private http: HttpClient) { }

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    affair: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    msg: new FormControl('', [Validators.required]),
  });

  onSubmit() {

    if (this.formGroup.invalid || !this.selectedFile) {
      this.formGroup.markAllAsTouched();
      Swal.fire({
        title: 'Formulario incompleto',
        text: 'Rellena todos los campos obligatorios',
        icon: 'warning',
        confirmButtonColor: '#193026',
        color: '#ffffff',
        background: '#111'
      });
      return;
    }

    const formValue = this.formGroup.value;

    const formData = new FormData();

    formData.append('name', formValue.name || '');
    formData.append('email', formValue.email || '');
    formData.append('phone', formValue.phone || '');
    formData.append('affair', formValue.affair || '');
    formData.append('msg', formValue.msg || '');
    formData.append('status', 'ENVIADO');
    formData.append('date', new Date().toISOString());

    formData.append('cv', this.selectedFile);

    this.applicationService.addApplication(formData).subscribe({
      next: () => {

        this.http.post('http://localhost:5678/webhook-test/test', formData)
        .subscribe();
        formData.forEach((value, key) => {
          console.log(key, value);
        });
        Swal.fire({
          title: 'Mensaje enviado con éxito',
          icon: 'success',
          confirmButtonColor: '#193026',
          color: '#ffffff',
          background: '#111'
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error al enviar el mensaje',
          text: 'Inténtalo de nuevo',
          icon: 'error',
          confirmButtonColor: '#ff4d4d',
          color: '#ffffff',
          background: '#111'
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}