import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';

@Directive({ selector: '[appDialogFocus]' })
export class DialogFocusDirective implements AfterViewInit, OnDestroy {
  private element: ElementRef<HTMLElement> = inject(ElementRef);
  private previous = document.activeElement as HTMLElement | null;
  private previousOverflow = document.body.style.overflow;
  private focusables() {
    return Array.from(
      this.element.nativeElement.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]'
      )
    ).filter((el) => el.offsetParent !== null);
  }
  ngAfterViewInit() {
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => this.focusables()[0]?.focus());
  }
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    const elements = this.focusables();
    if (event.shiftKey && document.activeElement === elements[0]) {
      event.preventDefault();
      elements[elements.length - 1]?.focus();
    } else if (!event.shiftKey && document.activeElement === elements[elements.length - 1]) {
      event.preventDefault();
      elements[0]?.focus();
    }
  }
  ngOnDestroy() {
    document.body.style.overflow = this.previousOverflow;
    this.previous?.focus();
  }
}
