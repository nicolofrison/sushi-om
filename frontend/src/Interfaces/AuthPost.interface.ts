export default interface AuthPost {
    name: string,
    surname: string,
    username?: string,
    groupName: string,
    groupPassword: string,
    signType: "createGroup" | "joinGroup"
  }