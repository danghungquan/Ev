
// elevenlabs.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//  sk_5bd39bf5092e4241337c84532c8cf1d3d8b506aa9320b892

@Injectable({
  providedIn: 'root'
})
export class ElevenlabsService {
  constructor(private http: HttpClient) {}
  
  private apiKey = 'sk_5bd39bf5092e4241337c84532c8cf1d3d8b506aa9320b892';  // Thay bằng API key thật
  private voiceId = 'nPczCjzI2devNBz1zQrb'; // Bạn cần lấy từ ElevenLabs dashboard
  private apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`;
  private apiUrlIdVoice = 'https://api.elevenlabs.io/v1';


  synthesize(text: string) {
    const headers = new HttpHeaders({
      'xi-api-key': this.apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    });

    const body = {
      text: text,
      model_id: 'eleven_multilingual_v2', // model hỗ trợ nhiều ngôn ngữ
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    };

    return this.http.post(this.apiUrl, body, {
      headers: headers,
      responseType: 'blob', // nhận dữ liệu dạng file
    });
  }

  getVoiceInfoById(voiceId: string): Observable<any> {
    const url = `${this.apiUrlIdVoice}/voices/${voiceId}`;
    const headers = new HttpHeaders({
      'xi-api-key': this.apiKey
    });
    return this.http.get<any>(url, { headers });
  }
}
