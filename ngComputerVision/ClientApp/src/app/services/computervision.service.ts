import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComputervisionService {

  baseURL: string;

  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseURL = '/api/OCR';
  }


  getTextFromImage(image) {
    return this.http.post(this.baseURL, image)
      .pipe(response => {
        return response;
      });
  }
}
