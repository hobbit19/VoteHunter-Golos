import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorOverviewComponent } from './creator-overview.component';

describe('CreatorOverviewComponent', () => {
  let component: CreatorOverviewComponent;
  let fixture: ComponentFixture<CreatorOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
