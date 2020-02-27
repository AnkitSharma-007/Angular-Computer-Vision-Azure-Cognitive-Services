import { Component, OnInit } from '@angular/core';
import { ComputervisionService } from '../services/computervision.service';
import { AvailableLanguage } from '../models/availablelanguage';
import { OcrResult } from '../models/ocrresult';

@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.css']
})
export class OcrComponent implements OnInit {

  loading = false;
  imageFile;
  imagePreview;
  imageData = new FormData();
  availableLanguage: AvailableLanguage[];
  DetectedTextLanguage: string;
  ocrResult: OcrResult;
  DefaultStatus: string;
  status: string;
  maxFileSize: number;
  isValidFile = true;

  constructor(private computervisionService: ComputervisionService) {
    this.DefaultStatus = "Maximum size allowed for the image is 4 MB";
    this.status = this.DefaultStatus;
    this.maxFileSize = 4 * 1024 * 1024; // 4MB
  }

  ngOnInit() {
    this.computervisionService.getAvailableLanguage().subscribe(
      (result: AvailableLanguage[]) => this.availableLanguage = result
    );
  }

  uploadImage(event) {
    this.imageFile = event.target.files[0];
    if (this.imageFile.size > this.maxFileSize) {
      this.status = `The file size is ${this.imageFile.size} bytes, this is more than the allowed limit of ${this.maxFileSize} bytes.`;
      this.isValidFile = false;
    } else if (this.imageFile.type.indexOf('image') == -1) {
      this.status = "Please upload a valid image file";
      this.isValidFile = false;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      this.status = this.DefaultStatus;
      this.isValidFile = true;
    }
  }

  GetText() {
    if (this.isValidFile) {

      this.loading = true;
      this.imageData.append('imageFile', this.imageFile);

      this.computervisionService.getTextFromImage(this.imageData).subscribe(
        (result: OcrResult) => {
          this.ocrResult = result;
          if (this.availableLanguage.find(x => x.languageID === this.ocrResult.language)) {
            this.DetectedTextLanguage = this.availableLanguage.find(x => x.languageID === this.ocrResult.language).languageName;
          } else {
            this.DetectedTextLanguage = "unknown";
          }
          this.loading = false;
        });
    }
  }
}
