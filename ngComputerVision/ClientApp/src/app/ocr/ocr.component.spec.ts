import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OcrComponent } from './ocr.component';

describe('OcrComponent', () => {
  let component: OcrComponent;
  let fixture: ComponentFixture<OcrComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OcrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
