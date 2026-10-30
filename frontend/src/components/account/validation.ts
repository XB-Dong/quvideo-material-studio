export function nameError(value: string) {
  const count = Array.from(value.trim()).length;
  return count < 1 || count > 30 ? "昵称须为1–30个字符" : null;
}
export function passwordError(value: string) {
  const count = Array.from(value).length;
  return count < 12 || count > 128 ? "密码须为12–128个字符" : null;
}
