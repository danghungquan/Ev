import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ElevenlabsService } from '../service/service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  constructor(private elevenlabs: ElevenlabsService) {}

  text = 'I want to send you all the sweet, soft sunshine/ To see the fragrant season in your mysterious eyes on stormy days/ To tell you a few words of my heart/ Like autumn coming simply in the memories of each other.';
  tableData: string[] = [];

  async fnStart() {
    let i = 0;
    for (const item of this.tableData) {
      console.log(item);
      console.log(i);
      i++
      await this.fnDownloadMP3(item, i); // đợi gọi API xong rồi mới tiếp
    }
  }

  async fnDownloadMP3(text: string, i: number): Promise<void> {
    try {
      console.log('Gọi API ElevenLabs...');
      const blob = await firstValueFrom(this.elevenlabs.synthesize(text));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'file'+i+'.mp3';
      document.body.appendChild(a);
      a.click()
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Lỗi khi gọi ElevenLabs:', error);
      // Có thể throw lại nếu bạn muốn dừng vòng lặp ở fnStart()
      // throw error;
    }
  }


  fnOnFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const arrayConten = this.fnSplitTextBySpaceMaxLength(text, 10);
        this.tableData = arrayConten;
      console.log('File content:', text);
      // Bạn có thể xử lý nội dung file ở đây
    };
    reader.onerror = () => {
      console.error('Error reading file');
    };
    reader.readAsText(file);
  }

  fnSplitTextBySpaceMaxLength(text: string, maxLength: number = 200): string[] {
    const words = text.split(' ');
    const result: string[] = [];
    let currentChunk = '';

    for (const word of words) {
      // Nếu thêm từ này mà vượt quá maxLength
      if ((currentChunk.length + word.length + (currentChunk ? 1 : 0)) > maxLength) {
        // Thêm chunk hiện tại vào kết quả nếu không rỗng
        if (currentChunk) {
          result.push(currentChunk);
        }
        // Bắt đầu chunk mới với từ hiện tại
        currentChunk = word;
      } else {
        // Thêm từ vào chunk hiện tại (có space nếu cần)
        currentChunk += (currentChunk ? ' ' : '') + word;
      }
    }
    // Thêm chunk cuối cùng nếu còn
    if (currentChunk) {
      result.push(currentChunk);
    }
    return result;
  }
}
