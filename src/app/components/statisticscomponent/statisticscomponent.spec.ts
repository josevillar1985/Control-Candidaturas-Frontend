import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Statisticscomponent } from './statisticscomponent';

describe('Statisticscomponent', () => {
  let component: Statisticscomponent;
  let fixture: ComponentFixture<Statisticscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Statisticscomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Statisticscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
