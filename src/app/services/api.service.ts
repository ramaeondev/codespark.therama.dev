import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService { 

  constructor(private http: HttpClient) { }

  getLanguages() {
    return this.http.post<any>( `${environment.apiUrl}/get-table-rows`, { table: 'languages' }).pipe(
      map(data => data.result)
    );
  } 
}