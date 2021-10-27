export default interface User {
  accessToken: string,
    userId?: number,
    name: string,
    surname: string,
    username: string,
    groupId: number,
    confirmed?: boolean,
  }