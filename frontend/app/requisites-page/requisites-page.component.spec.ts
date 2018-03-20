import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitesPageComponent } from './requisites-page.component';

describe('RequisitesPageComponent', () => {
  let component: RequisitesPageComponent;
  let fixture: ComponentFixture<RequisitesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
