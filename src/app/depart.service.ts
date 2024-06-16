import { Injectable, inject, signal } from '@angular/core';
import { Depart } from './class/depart';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartService {

  readonly url = 'http://localhost:8080/api/v1/depart';
  private http = inject(HttpClient);
  public departs = signal<Depart[]>([])

  getAllDeparts(): Observable<Depart[]> {
    return this.http.get<Depart[]>(this.url).pipe(
      tap(departs => this.departs.set(departs))
    );
  }
}
