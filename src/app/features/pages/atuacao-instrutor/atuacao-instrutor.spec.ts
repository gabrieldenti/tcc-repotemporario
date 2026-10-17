import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtuacaoInstrutor } from './atuacao-instrutor';

describe('AtuacaoInstrutor', () => {
  let component: AtuacaoInstrutor;
  let fixture: ComponentFixture<AtuacaoInstrutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtuacaoInstrutor],
    }).compileComponents();

    fixture = TestBed.createComponent(AtuacaoInstrutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
