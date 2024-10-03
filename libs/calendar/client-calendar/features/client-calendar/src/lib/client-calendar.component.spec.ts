import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientCalendarComponent } from './client-calendar.component';

describe('ClientCalendarComponent', () => {
  let component: ClientCalendarComponent;
  let fixture: ComponentFixture<ClientCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
