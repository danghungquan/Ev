
// elevenlabs.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//  sk_5bd39bf5092e4241337c84532c8cf1d3d8b506aa9320b892

@Injectable({
  providedIn: 'root'
})
export class ElevenlabsService {
  private apiKey = 'sk_5bd39bf5092e4241337c84532c8cf1d3d8b506aa9320b892';  // Thay bằng API key thật
  private voiceId = 'NOpBlnGInO9m6vDvFkFC'; // Bạn cần lấy từ ElevenLabs dashboard

  private apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}`;

  constructor(private http: HttpClient) {}

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
}
