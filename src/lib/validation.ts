const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneAllowedPattern = /^[0-9+\-()\s]*$/;
const phoneInvalidCharactersPattern = /[^0-9+\-()\s]/g;

export function isValidEmail(email: string) {
  return emailPattern.test(email.trim());
}

export function sanitizePhone(phone: string) {
  return phone.replace(phoneInvalidCharactersPattern, "");
}

export function isValidPhone(phone: string) {
  return phoneAllowedPattern.test(phone);
}

export function isValidAgeNumber(age: string | number) {
  const parsedAge = Number(age);
  return Number.isInteger(parsedAge) && parsedAge > 0;
}

export function isAtLeastNumericAge(age: string | number, minAge: number) {
  if (!isValidAgeNumber(age)) return false;
  return Number(age) >= minAge;
}

export function isValidBirthDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day && date <= today;
}

export function calculateAge(value: string) {
  if (!isValidBirthDate(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hadBirthdayThisYear = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hadBirthdayThisYear) age -= 1;
  return age;
}

export function isAtLeastAge(value: string, minAge: number) {
  const age = calculateAge(value);
  return age !== null && age >= minAge;
}
