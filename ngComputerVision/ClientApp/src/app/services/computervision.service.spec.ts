import { TestBed } from '@angular/core/testing';

import { ComputervisionService } from './computervision.service';

describe('ComputervisionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComputervisionService = TestBed.get(ComputervisionService);
    expect(service).toBeTruthy();
  });
});
