
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class LoginUserInput {
    email: string;
    password: string;
}

export class SignupUserInput {
    firstname: string;
    email: string;
    password: string;
}

export class CreateProjectInput {
    title: string;
    description: string;
    authorId: number;
}

export class UpdateProjectInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    progress?: Nullable<number>;
    isArchived?: Nullable<boolean>;
}

export class ProjectWhereInput {
    id?: Nullable<number>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    progress?: Nullable<number>;
    isArchived?: Nullable<boolean>;
}

export class CreateUserInput {
    firstname: string;
    lastname: string;
    password: string;
    email: string;
}

export class UpdateUserInput {
    firstname?: Nullable<string>;
    password?: Nullable<string>;
    lastname?: Nullable<string>;
    email?: Nullable<string>;
}

export class ResetPasswordInput {
    password: string;
    token: string;
    email: string;
}

export class LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export class RefreshResponse {
    user: User;
    accessToken: string;
    expSeconds: number;
}

export class SignupResponse {
    user: User;
}

export class LogoutResponse {
    success: boolean;
}

export class GetCurrentUserResponse {
    user?: Nullable<User>;
}

export abstract class IMutation {
    abstract login(loginUserInput: LoginUserInput): LoginResponse | Promise<LoginResponse>;

    abstract signup(signupUserInput: SignupUserInput): LoginResponse | Promise<LoginResponse>;

    abstract logout(): LogoutResponse | Promise<LogoutResponse>;

    abstract verifyAccount(token: string): SuccessPayload | Promise<SuccessPayload>;

    abstract resendVerificationLink(email: string): SuccessPayload | Promise<SuccessPayload>;

    abstract sendPasswordResetLink(email: string): SuccessPayload | Promise<SuccessPayload>;

    abstract createProject(createProjectInput: CreateProjectInput): Project | Promise<Project>;

    abstract updateProject(id: number, updateProjectInput: UpdateProjectInput): Project | Promise<Project>;

    abstract removeProject(id: number): Nullable<Project> | Promise<Nullable<Project>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(id: number, updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract setCurrentRefreshToken(refreshToken: string, id: number): User | Promise<User>;

    abstract resetPassword(resetPasswordInput: ResetPasswordInput): User | Promise<User>;

    abstract removeUser(id: number): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IQuery {
    abstract getCurrentUser(): GetCurrentUserResponse | Promise<GetCurrentUserResponse>;

    abstract refresh(): RefreshResponse | Promise<RefreshResponse>;

    abstract getAllProjects(where: ProjectWhereInput): Nullable<Project>[] | Promise<Nullable<Project>[]>;

    abstract getProject(uuid: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract getAllUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract getUser(where: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;

    abstract getUserProfile(): Nullable<User> | Promise<Nullable<User>>;
}

export class SuccessPayload {
    success: boolean;
}

export class Project {
    id?: Nullable<number>;
    uuid?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    progress?: Nullable<number>;
    isArchived?: Nullable<boolean>;
    author?: Nullable<User>;
}

export class User {
    id?: Nullable<number>;
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    password?: Nullable<string>;
    email?: Nullable<string>;
}

export type AccountType = any;
export type UserWhereUniqueInput = any;
type Nullable<T> = T | null;
