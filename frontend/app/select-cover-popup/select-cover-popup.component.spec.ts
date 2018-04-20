import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoverPopupComponent } from './select-cover-popup.component';

describe('SelectCoverPopupComponent', () => {
  let component: SelectCoverPopupComponent;
  let fixture: ComponentFixture<SelectCoverPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCoverPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCoverPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
