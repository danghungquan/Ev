import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ElevenlabsService } from '../service/service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  text = 'I want to send you all the sweet, soft sunshine/ To see the fragrant season in your mysterious eyes on stormy days/ To tell you a few words of my heart/ Like autumn coming simply in the memories of each other.';
  voiceId = 'NOpBlnGInO9m6vDvFkFC';  // Lấy voice id từ ElevenLabs

  voices = ['Voice 1', 'Voice 2', 'Voice 3'];
  models = ['Model A', 'Model B', 'Model C'];
  tableData = [
    { id: 1, content: 'Hello', voice: 'Voice 1', status: 'Pending' },
    { id: 2, content: 'World', voice: 'Voice 2', status: 'Done' },
  ];

  constructor(private elevenlabs: ElevenlabsService) {}

  downloadMP3() {
    console.log('Gọi API ElevenLabs...');
    this.elevenlabs.synthesize(this.text).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'voice.mp3';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Lỗi khi gọi ElevenLabs:', error);
      }
    );
  }
}
