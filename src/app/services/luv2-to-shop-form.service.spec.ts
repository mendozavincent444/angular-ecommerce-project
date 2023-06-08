import { TestBed } from '@angular/core/testing';

import { Luv2ToShopFormService } from './luv2-to-shop-form.service';

describe('Luv2ToShopFormService', () => {
  let service: Luv2ToShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Luv2ToShopFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
