import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatbotServieService {

  public text=""
  tempWords: any;
  private apiUrl = 'https://6755-125-22-161-174.ngrok-free.app/api/prompt_route';
 
  constructor(private http: HttpClient) { }

  sendMessage(query: string) {
    return this.http.post<any>(this.apiUrl, { query });
  }
 
}
