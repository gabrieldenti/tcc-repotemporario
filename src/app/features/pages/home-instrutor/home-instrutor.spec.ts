import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeInstrutor } from './home-instrutor';

describe('HomeInstrutor', () => {
  let component: HomeInstrutor;
  let fixture: ComponentFixture<HomeInstrutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeInstrutor],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeInstrutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
