import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plant } from 'src/app/interfaces/backResponses';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public plants: Plant[];

  constructor(
    private _http: HttpClient
  ) {
    this.plants = [];
  }

  getPlants(): Observable<Plant[]> {
    return this._http.get<Plant[]>(`http://localhost:3000/plants`);
  }

  addPlant(data:any):Observable<any>{
    return this._http.post(`http://localhost:3000/plants`, data);
  }

  deletePlant(id:number): Observable<any> {
    return this._http.delete(`http://localhost:3000/plants/${id}`);
  }

  updatePlant(id: number, data: any): Observable<any>{
    return this._http.put(`http://localhost:3000/plants/${id}`, data);
  }
}
