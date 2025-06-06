import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ElevenlabsService } from '../service/service';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private elevenlabs: ElevenlabsService) {}
  
  tableData: any = [];
  IdVoice = '';
  selectedDelimiter = " ";
  infoVoice: any = {
    name: "",
    category: "",
    language: "",
    listModel: []
  };
  infoSetting = {
    speed: 1,
    stability: 50,
    similarity: 75,
    style: 0,
    speakerBoost: true
  };



  fnSearchVoice(){
     this.elevenlabs.getVoiceInfoById(this.IdVoice).subscribe({
      next: (data) => {
          this.infoVoice.name = data.name ?? '';
          this.infoVoice.category = data.category ?? '';
          this.infoVoice.language = data.labels.language ?? '';
          this.infoVoice.listModel = data.high_quality_base_model_ids ?? [];
        console.log(data);
      },
      error: (err) => {
        console.error('Error fetching voice info:', err);
      }
    });
  }
  async fnExportFile() {
    let i = 0;
    for (const item of this.tableData) {
      i++
      await this.fnDownloadMP3(item.content, i); // đợi gọi API xong rồi mới tiếp
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

  fnOnfolderSelected(event: Event): void  {
    let id = 1;
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.tableData = [];
    const listFile = input.files;
    for (let index = 0; index < listFile.length; index++) {
      const file = listFile[index];
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        const arrayConten = this.fnSplitTextBySpaceMaxLength(text, 10, this.selectedDelimiter);
        for (let index = 0; index < arrayConten.length; index++) {
          const content = arrayConten[index];
          const nameFile = file.name.replace(/\.[^/.]+$/, '');
          let dataRecord = {
            id: id,
            nameFile: nameFile + '_' + index,
            status: "Pending",
            count: content.length,
            content: content
          }
          this.tableData.push(dataRecord)
          id++;
        }
        console.log(this.tableData);
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };
      reader.readAsText(file);
    }
  }

  fnOnFileSelected(event: Event): void {
    let id = 1;
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.tableData = [];
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const arrayConten = this.fnSplitTextBySpaceMaxLength(text, 10, this.selectedDelimiter);
      for (let index = 0; index < arrayConten.length; index++) {
        const content = arrayConten[index];
        const nameFile = file.name.replace(/\.[^/.]+$/, '');
        let dataRecord = {
          id: id,
          nameFile: nameFile + '_' + index,
          status: "Pending",
          count: content.length,
          content: content
        }
        this.tableData.push(dataRecord)
        id++;
      }
    };
    reader.onerror = () => {
      console.error('Error reading file');
    };
    reader.readAsText(file);
  }

  fnSplitTextBySpaceMaxLength(text: string, maxLength: number = 200, split: string = " "): string[] {
    const words = text.split(split);
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

  fnResetFileInput(fileInput: HTMLInputElement): void {
    fileInput.value = ''; // reset giá trị để click lại vẫn gọi được change
  }
  
  fnResetFolderInput(folderInput: HTMLInputElement): void {
    folderInput.value = ''; // reset giá trị để click lại vẫn gọi được change
  }
}
