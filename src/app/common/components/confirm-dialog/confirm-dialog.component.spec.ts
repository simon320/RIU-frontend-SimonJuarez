import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { message: '¿Estas seguro?' } },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message from MAT_DIALOG_DATA', () => {
    const contentEl = fixture.debugElement.query(By.css('mat-dialog-content')).nativeElement;
    expect(contentEl.textContent).toContain('¿Estas seguro?');
  });

  it('should close dialog with false when Cancel button is clicked', () => {
    const cancelBtn = fixture.debugElement.queryAll(By.css('button'))[0];
    cancelBtn.nativeElement.click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close dialog with true when Delete button is clicked', () => {
    const deleteBtn = fixture.debugElement.queryAll(By.css('button'))[1];
    deleteBtn.nativeElement.click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
