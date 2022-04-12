import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowRatioComponent } from './row-ratio.component';

describe('RowRatioComponent', () => {
  let component: RowRatioComponent;
  let fixture: ComponentFixture<RowRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowRatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
