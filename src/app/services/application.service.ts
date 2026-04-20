import { Injectable } from '@angular/core';
import { Application } from '../model/application';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  
  applications: Application[] = [];

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  
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