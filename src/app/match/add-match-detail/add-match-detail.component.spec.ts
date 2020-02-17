import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMatchDetailComponent } from './add-match-detail.component';

describe('AddMatchDetailComponent', () => {
  let component: AddMatchDetailComponent;
  let fixture: ComponentFixture<AddMatchDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMatchDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
