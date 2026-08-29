export namespace IUserType {
  export type CreateUserDTO = {
    username: string;
    name: string;
  };

  export type IUser = {
    id: string;
    username: string;
    name: string;
    created_at: Date;
  };
}
