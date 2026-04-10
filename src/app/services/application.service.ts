import { Injectable } from '@angular/core';
import { Application } from '../model/application';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  // Esta es la línea que faltaba y causaba el error:
  applications: Application[] = [];

  readonly API_URL = 'http://localhost:8080/applications';

  constructor(private http: HttpClient) {}

  // Mantenemos el check de salud para el círculo neón
  checkHealth(): Observable<boolean> {
    return this.http.get(this.API_URL).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getApplications() {
    return this.http.get<Application[]>(this.API_URL);
  }

  addApplication(formData: FormData) {
    return this.http.post(this.API_URL, formData);
  }

  updateApplication(application: Application) {
    return this.http.put<Application>(`${this.API_URL}/${application.id}`, application);
  }

  deleteApplication(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}