export function generatePassword(
  length: number = 12,
  includeUppercase: boolean = true,
  includeLowercase: boolean = true,
  includeNumbers: boolean = true,
  includeSpecialChars: boolean = true,
): string {
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  if (includeUppercase) chars += uppercaseChars;
  if (includeLowercase) chars += lowercaseChars;
  if (includeNumbers) chars += numberChars;
  if (includeSpecialChars) chars += specialChars;

  if (chars.length === 0) {
    throw new Error('At least one character type must be selected');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
