import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';

import { UppercaseDirective } from './uppercase.directive';

@Component({
  template: `
    <input type="text" [formControl]="control" appUppercase />
  `,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, UppercaseDirective],
})
class TestComponent {
  control = new FormControl('batman');
}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should convert initial value to uppercase on init', () => {
    expect(input.value).toBe('BATMAN');
    expect(component.control.value).toBe('BATMAN');
  });

  it('should convert typed value to uppercase on input', () => {
    input.value = 'superman';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.value).toBe('SUPERMAN');
    expect(component.control.value).toBe('SUPERMAN');
  });
});
