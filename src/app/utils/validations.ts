import { FormControl } from '@angular/forms';

export const passwordPattern =
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:"\\\\|,.<>\\/?]).+$';

export function dateValidator(
  control: FormControl
): { [key: string]: boolean } | null {
  const date = new Date(control.value);
  const today = new Date();
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', control.value);
    return { invalidDate: true };
  }
  if (date >= today) {
    return { futureDate: true };
  }
  return null;
}
