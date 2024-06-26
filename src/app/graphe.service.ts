import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Graphe } from './class/graphe';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrapheService {

  readonly url = 'http://localhost:8080/api/v1/graphe';
  private http = inject(HttpClient);
  public graphes = signal<Graphe[]>([])

  getGroupByDepartement(): Observable<Graphe[]> {
    return this.http.get<Graphe[]>(this.url + '/departement').pipe(
      tap(graphes => this.graphes.set(graphes))
    );
  }

  getGroupByCentreCout(): Observable<Graphe[]> {
    return this.http.get<Graphe[]>(this.url + '/centrecout').pipe(
      tap(graphes => this.graphes.set(graphes))
    );
  }

  getRaisonByCentreCout(code: String): Observable<Graphe[]> {
    return this.http.get<Graphe[]>(this.url + '/centrecout/' + code + '/raison').pipe(
      tap(graphes => this.graphes.set(graphes))
    );
  }

  getAllRaison(): Observable<Graphe[]> {
    return this.http.get<Graphe[]>(this.url + '/raison').pipe(
      tap(graphes => this.graphes.set(graphes))
    );
  }

  getAllRaisonTauxCompare(): Observable<Graphe[]> {
    return this.http.get<Graphe[]>(this.url + '/raison/taux').pipe(
      tap(graphes => this.graphes.set(graphes))
    );
  }

  constructor() { }
}
