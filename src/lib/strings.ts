export function upperFirst(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function includesIgnoreCase(str1: string, str2: string) {
  return str1.toLowerCase().includes(str2.toLowerCase());
}
