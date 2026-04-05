import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application.service';
import { CommonModule, NgClass } from '@angular/common';
import { Application } from '../../model/application';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgClass, CommonModule, FormsModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {

  applications: Application[] = []; 
  searchText: string = '';

  constructor(
    public applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications() {
    this.applicationService.getApplications().subscribe({
      next: (data) => {
        this.applicationService.applications = data.reverse();
        this.applications = [...data];
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error fetching applications:', e);
      }
    })
  }

  updateAplication(application: Application) {
    if (application.status === 'ENVIADO') {
      application.status = 'RECHAZADO';
    } else if (application.status === 'RECHAZADO') {
      application.status = 'ENVIADO';
    }
    this.applicationService.updateApplication(application).subscribe({
      next: (updatedApp) => {
        this.getApplications();
        console.log('Application updated successfully:', updatedApp);
        Swal.fire({
          title: 'Cambio de estado exitoso',
          icon: 'success',
          confirmButtonText: 'OK',

          confirmButtonColor: '#193026',
          color: '#ffffff',
          background: '#111'
        });
      },
      error: (e) => {
        console.error('Error updating application:', e);
      }
    })
  }

  deleteApplication(id: number) {

    Swal.fire({
      title: '¿Eliminar candidatura?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#ff4d4d', 
      cancelButtonColor: '#193026',  
      color: '#ffffff',
      background: '#111'
    }).then((result) => {

      if (result.isConfirmed) {

        this.applicationService.deleteApplication(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'La candidatura ha sido eliminada',
              icon: 'success',
              confirmButtonColor: '#193026',
              color: '#ffffff',
              background: '#111'
            });
            this.getApplications();
          },
          error: () => {
            Swal.fire({
              title: 'Error al eliminar',
              text: 'Inténtalo de nuevo',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#ff4d4d',
              color: '#ffffff',
              background: '#111'
            });
          }
        });
      }
    });
  }

  filterApplications() {
    const text = this.searchText.toLowerCase();

    const filtered = this.applications.filter(app =>
      (app.name || '').toLowerCase().includes(text) ||
      (app.email || '').toLowerCase().includes(text) ||
      (app.msg || '').toLowerCase().includes(text) ||
      (app.affair || '').toLowerCase().includes(text) ||
      String(app.status || '').toLowerCase().includes(text) ||
      String(app.phone || '').toLowerCase().includes(text)
    );

    this.applicationService.applications = [...filtered];
  }
}