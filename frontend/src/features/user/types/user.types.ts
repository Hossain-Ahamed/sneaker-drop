export namespace IUserType {
  export type IUser = {
    id: string;
    username: string;
    name: string;
    created_at: string;
  };

  export type CreateUserPayload = {
    username: string;
    name: string;
  };

  export type SignInPayload = {
    username: string;
  };
}
