import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidacaoDocumental } from './validacao-documental';

describe('ValidacaoDocumental', () => {
  let component: ValidacaoDocumental;
  let fixture: ComponentFixture<ValidacaoDocumental>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidacaoDocumental],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidacaoDocumental);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
