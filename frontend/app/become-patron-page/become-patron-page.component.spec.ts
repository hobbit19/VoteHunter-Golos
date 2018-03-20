import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomePatronPageComponent } from './become-patron-page.component';

describe('BecomePatronPageComponent', () => {
  let component: BecomePatronPageComponent;
  let fixture: ComponentFixture<BecomePatronPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomePatronPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomePatronPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
