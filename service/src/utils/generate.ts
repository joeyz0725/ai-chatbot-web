function generateRandomString(length: number): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters.charAt(randomIndex)
  }
  return result
}

function generateRandomUsername(): string {
  const prefix = 'qixiaobao'
  const randomSuffix = generateRandomString(4)
  return prefix + randomSuffix
}

function generateRandomPassword(): string {
  return generateRandomString(8)
}

function generateSpecificPassword(): string {
  return 'qixiaobao2023'
}

export {
  generateRandomString, generateRandomUsername,
  generateRandomPassword, generateSpecificPassword,
}
