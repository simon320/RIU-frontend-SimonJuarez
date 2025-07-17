import { NgControl } from '@angular/forms';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
    selector: '[appUppercase]'
})
export class UppercaseDirective {
    private el = inject(ElementRef<HTMLInputElement>);
    private ngControl = inject(NgControl);

    ngOnInit(): void {
        const currentValue = this.ngControl.control?.value;
        if (currentValue) {
            const uppercase = currentValue.toUpperCase();
            this.ngControl.control?.setValue(uppercase, { emitEvent: false });
            this.el.nativeElement.value = uppercase;
        }
    }

    @HostListener('input', ['$event.target.value'])
    onInput(value: string): void {
        const uppercase = value.toUpperCase();
        this.ngControl.control?.setValue(uppercase, { emitEvent: false });
        this.el.nativeElement.value = uppercase;
    }
}