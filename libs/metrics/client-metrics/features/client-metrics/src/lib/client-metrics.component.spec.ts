import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientMetricsComponent } from './client-metrics.component';

describe('ClientMetricsComponent', () => {
  let component: ClientMetricsComponent;
  let fixture: ComponentFixture<ClientMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientMetricsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
