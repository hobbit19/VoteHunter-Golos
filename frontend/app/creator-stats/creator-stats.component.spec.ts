import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorStatsComponent } from './creator-stats.component';

describe('CreatorStatsComponent', () => {
  let component: CreatorStatsComponent;
  let fixture: ComponentFixture<CreatorStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
