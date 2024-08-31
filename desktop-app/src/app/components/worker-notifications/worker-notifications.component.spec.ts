import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerNotificationsComponent } from './worker-notifications.component';

describe('WorkerNotificationsComponent', () => {
  let component: WorkerNotificationsComponent;
  let fixture: ComponentFixture<WorkerNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
