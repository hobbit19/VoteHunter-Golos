import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatorCommunityComponent } from './creator-community.component';

describe('CreatorCommunityComponent', () => {
  let component: CreatorCommunityComponent;
  let fixture: ComponentFixture<CreatorCommunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatorCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatorCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
