import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupInnerComponent } from './popup-inner.component';

describe('PopupInnerComponent', () => {
  let component: PopupInnerComponent;
  let fixture: ComponentFixture<PopupInnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupInnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
