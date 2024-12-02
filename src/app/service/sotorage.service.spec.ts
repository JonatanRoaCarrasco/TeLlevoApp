import { TestBed } from '@angular/core/testing';

import { SotorageService } from './sotorage.service';

describe('SotorageService', () => {
  let service: SotorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SotorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
