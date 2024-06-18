import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Ofs } from './class/ofs';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfsService {

  readonly url = 'http://localhost:8080/api/v1/ofs/categorie';
  private http = inject(HttpClient);
  public ofs = signal<Ofs[]>([])


  getTauxByCategorie(): Observable<Ofs[]> {
    return this.http.get<Ofs[]>(this.url + '/secteur').pipe(
      tap(ofs => this.ofs.set(ofs))
    );
  }
}
