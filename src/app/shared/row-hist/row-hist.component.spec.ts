import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowHistComponent } from './row-hist.component';

describe('RowHistComponent', () => {
  let component: RowHistComponent;
  let fixture: ComponentFixture<RowHistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowHistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowHistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
