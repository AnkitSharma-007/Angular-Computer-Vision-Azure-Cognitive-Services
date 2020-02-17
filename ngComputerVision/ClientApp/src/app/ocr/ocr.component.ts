import { Component, OnInit } from '@angular/core';
import { ComputervisionService } from '../services/computervision.service';

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.css']
})
export class OcrComponent {

  loading = false;
  files;
  imagePreview;
  imageData = new FormData();
  textData = "No text to display";

  constructor(private computervisionService: ComputervisionService) { }

  uploadImage(event) {
    this.files = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (myevent: ProgressEvent) => {
      this.imagePreview = (myevent.target as FileReader).result;
    };
  }

  GetText() {
    if (this.files && this.files.length > 0) {
      this.loading = true;
      for (let j = 0; j < this.files.length; j++) {
        this.imageData.append('file' + j, this.files[j]);
      }
      this.computervisionService.getTextFromImage(this.imageData).subscribe(
        (result: string) => {
          this.textData = result;
          this.loading = false;
        });
    }
  }
}
