import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricsGeneralFormComponent } from './metrics-general-form.component';

describe('MetricsGeneralFormComponent', () => {
  let component: MetricsGeneralFormComponent;
  let fixture: ComponentFixture<MetricsGeneralFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsGeneralFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricsGeneralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
