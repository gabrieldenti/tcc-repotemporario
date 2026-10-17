import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreferenciasAluno } from './preferencias-aluno';

describe('PreferenciasAluno', () => {
  let component: PreferenciasAluno;
  let fixture: ComponentFixture<PreferenciasAluno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreferenciasAluno],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferenciasAluno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
