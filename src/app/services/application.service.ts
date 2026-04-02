import { Injectable } from '@angular/core';
import { Application } from '../model/application';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

  applications: Application[] = [];

  readonly API_URL = 'http://localhost:8080/applications';

  constructor(private http: HttpClient) {
    this.applications = [];
  }

  getApplications() {
    return this.http.get<Application[]>(this.API_URL);
  }

  addApplication(application: Application) {
    return this.http.post<Application>(this.API_URL, application);
  }

  deleteApplication(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}