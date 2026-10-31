import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeusServicos } from './meus-servicos';

describe('MeusServicos', () => {
  let component: MeusServicos;
  let fixture: ComponentFixture<MeusServicos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusServicos],
    }).compileComponents();

    fixture = TestBed.createComponent(MeusServicos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
