import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navcomponent } from './navcomponent';

describe('Navcomponent', () => {
  let component: Navcomponent;
  let fixture: ComponentFixture<Navcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
