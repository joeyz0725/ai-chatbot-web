export function getCurrentDate() {
  const date = new Date()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

export function extractTokenFromHeader(authHeader: string) {
  if (authHeader) {
    const tokenMatch = authHeader.match(/Bearer\s(\S+)/);
    if (tokenMatch && tokenMatch[1]) {
      return tokenMatch[1];
    }
  }
  return null;
}

// 把字符串按空格拆开，然后组装成一个数字数组
export function splitAndCombine(str: string): number[] {
  const parts: string[] = str.split(' ');
  const numbers: number[] = parts.map(part => parseInt(part));
  return numbers;
}