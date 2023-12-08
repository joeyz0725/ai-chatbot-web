const LOCAL_NAME = 'WEB_TOKEN'

export function getLocalToken() {
  const localToken = localStorage.getItem(LOCAL_NAME)
  return localToken
}

export function setLocalToken(token: string): void {
  // ss.set(LOCAL_NAME, token)
  localStorage.setItem(LOCAL_NAME, token)
}

export function removeLocalToken() {
  // ss.remove(LOCAL_NAME)
  localStorage.removeItem(LOCAL_NAME)
}
