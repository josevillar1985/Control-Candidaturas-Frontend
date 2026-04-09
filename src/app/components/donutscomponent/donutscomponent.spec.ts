import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Donutscomponent } from './donutscomponent';

describe('Donutscomponent', () => {
  let component: Donutscomponent;
  let fixture: ComponentFixture<Donutscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Donutscomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Donutscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
