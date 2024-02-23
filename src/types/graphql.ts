
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreateAreaInput {
    title: string;
    parentId?: Nullable<number>;
}

export class UpdateAreaInput {
    title?: Nullable<string>;
    emoji?: Nullable<string>;
}

export class AreaWhereInput {
    id?: Nullable<number>;
    title?: Nullable<string>;
    parentId?: Nullable<number>;
}

export class LoginUserInput {
    email: string;
    password: string;
}

export class SignupUserInput {
    firstname: string;
    email: string;
    password: string;
}

export class CreateBoardInput {
    title: string;
    description?: Nullable<string>;
    authorId?: Nullable<number>;
}

export class UpdateBoardInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    progress?: Nullable<number>;
    isArchived?: Nullable<boolean>;
}

export class BoardWhereInput {
    id?: Nullable<number>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    progress?: Nullable<number>;
    isArchived?: Nullable<boolean>;
}

export class CreateColumnInput {
    title: string;
    boardId: number;
}

export class UpdateColumnInput {
    title?: Nullable<string>;
}

export class ColumnWhereInput {
    id?: Nullable<number>;
    title?: Nullable<string>;
}

export class HandleGoalQueryInput {
    body: string;
}

export class CreateProjectInput {
    title: string;
    description: string;
    authorId?: Nullable<number>;
}

export class UpdateProjectInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    progress?: Nullable<number>;
    isArchived?: Nullable<boolean>;
    emoji?: Nullable<string>;
}

export class ProjectWhereInput {
    id?: Nullable<number>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    progress?: Nullable<number>;
    parentId?: Nullable<number>;
    isArchived?: Nullable<boolean>;
}

export class CreateResourceInput {
    title?: Nullable<string>;
    contentJSON: Json;
    contentHTML: string;
}

export class ConnectResourceInput {
    projectId?: Nullable<number>;
    taskId?: Nullable<number>;
    parentId?: Nullable<number>;
}

export class UpdateResourceInput {
    title?: Nullable<string>;
    emoji?: Nullable<string>;
    contentJSON?: Nullable<Json>;
    contentHTML?: Nullable<string>;
}

export class ResourceWhereInput {
    id?: Nullable<number>;
    uuid?: Nullable<string>;
    isRoot?: Nullable<boolean>;
    projectId?: Nullable<number>;
    taskId?: Nullable<number>;
    parentId?: Nullable<number>;
}

export class CreateTaskInput {
    title: string;
    description?: Nullable<string>;
    order?: Nullable<number>;
    boardId?: Nullable<number>;
    columnId?: Nullable<number>;
    projectId?: Nullable<number>;
    dueDate?: Nullable<DateTime>;
    listOrder?: Nullable<number>;
}

export class UpdateTaskInput {
    title?: Nullable<string>;
    description?: Nullable<string>;
    columnId?: Nullable<number>;
    order?: Nullable<number>;
    isCompleted?: Nullable<boolean>;
    dueDate?: Nullable<DateTime>;
    listOrder?: Nullable<number>;
}

export class TaskWhereInput {
    id?: Nullable<number>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    columnId?: Nullable<number>;
    projectId?: Nullable<number>;
}

export class CreateUserInput {
    firstname: string;
    lastname: string;
    password?: Nullable<string>;
    email: string;
    avatarURL?: Nullable<string>;
    isOauthUser?: Nullable<boolean>;
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

export class TasksOrdersInput {
    id?: Nullable<number>;
    order?: Nullable<number>;
    columnId?: Nullable<number>;
    listOrder?: Nullable<number>;
}

export class Area {
    id?: Nullable<number>;
    uuid?: Nullable<string>;
    title?: Nullable<string>;
    projects?: Nullable<Nullable<Project>[]>;
    subareas?: Nullable<Nullable<Area>[]>;
    parentId?: Nullable<number>;
    parent?: Nullable<Area>;
    isArchived?: Nullable<boolean>;
    emoji?: Nullable<string>;
    author?: Nullable<User>;
    authorId?: Nullable<number>;
}

export abstract class IQuery {
    abstract getAllAreas(where?: Nullable<AreaWhereInput>): Nullable<Area>[] | Promise<Nullable<Area>[]>;

    abstract getArea(uuid: string): Nullable<Area> | Promise<Nullable<Area>>;

    abstract getArchivedAreas(): Nullable<Area>[] | Promise<Nullable<Area>[]>;

    abstract getCurrentUser(): GetCurrentUserResponse | Promise<GetCurrentUserResponse>;

    abstract refresh(): RefreshResponse | Promise<RefreshResponse>;

    abstract getAllBoards(where: BoardWhereInput): Nullable<Board>[] | Promise<Nullable<Board>[]>;

    abstract getBoard(id: number): Nullable<Board> | Promise<Nullable<Board>>;

    abstract getAllColumns(where: ColumnWhereInput): Nullable<Column>[] | Promise<Nullable<Column>[]>;

    abstract getColumn(uuid: string): Nullable<Column> | Promise<Nullable<Column>>;

    abstract getAllProjects(where?: Nullable<ProjectWhereInput>): Nullable<Project>[] | Promise<Nullable<Project>[]>;

    abstract getProject(uuid: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract getProjectWhere(where?: Nullable<ProjectWhereInput>): Nullable<Project> | Promise<Nullable<Project>>;

    abstract getArchivedProjects(): Nullable<Project>[] | Promise<Nullable<Project>[]>;

    abstract getAllResources(where: ResourceWhereInput): Nullable<Resource>[] | Promise<Nullable<Resource>[]>;

    abstract getResource(where: ResourceWhereInput): Nullable<Resource> | Promise<Nullable<Resource>>;

    abstract getArchivedResources(): Nullable<Resource>[] | Promise<Nullable<Resource>[]>;

    abstract getAllTasks(where: TaskWhereInput): Nullable<Task>[] | Promise<Nullable<Task>[]>;

    abstract getTask(uuid: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract getArchivedTasks(): Nullable<Task>[] | Promise<Nullable<Task>[]>;

    abstract getAllUsers(): Nullable<User>[] | Promise<Nullable<User>[]>;

    abstract getUser(where: UserWhereUniqueInput): Nullable<User> | Promise<Nullable<User>>;

    abstract getUserProfile(): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createArea(createAreaInput: CreateAreaInput): Area | Promise<Area>;

    abstract updateArea(uuid: string, updateAreaInput: UpdateAreaInput): Area | Promise<Area>;

    abstract removeArea(uuid: string): Nullable<Area> | Promise<Nullable<Area>>;

    abstract archiveArea(uuid: string): Nullable<Area> | Promise<Nullable<Area>>;

    abstract unarchiveArea(uuid: string): Nullable<Area> | Promise<Nullable<Area>>;

    abstract login(loginUserInput: LoginUserInput): LoginResponse | Promise<LoginResponse>;

    abstract signup(signupUserInput: SignupUserInput): SignupResponse | Promise<SignupResponse>;

    abstract logout(): LogoutResponse | Promise<LogoutResponse>;

    abstract createBoard(createBoardInput: CreateBoardInput, projectId: number): Board | Promise<Board>;

    abstract updateBoard(id: number, updateBoardInput: UpdateBoardInput): Board | Promise<Board>;

    abstract removeBoard(id: number): Nullable<Board> | Promise<Nullable<Board>>;

    abstract createColumn(createColumnInput: CreateColumnInput): Column | Promise<Column>;

    abstract updateColumn(id: number, updateColumnInput: UpdateColumnInput): Column | Promise<Column>;

    abstract removeColumn(id: number): Nullable<Column> | Promise<Nullable<Column>>;

    abstract verifyAccount(token: string): SuccessPayload | Promise<SuccessPayload>;

    abstract resendVerificationLink(email: string): SuccessPayload | Promise<SuccessPayload>;

    abstract sendPasswordResetLink(email: string): SuccessPayload | Promise<SuccessPayload>;

    abstract handleGoalQuery(handleGoalQueryInput: HandleGoalQueryInput): Nullable<HandleGoalQueryPayload> | Promise<Nullable<HandleGoalQueryPayload>>;

    abstract createProject(createProjectInput: CreateProjectInput, areaIds?: Nullable<Nullable<number>[]>, parentId?: Nullable<number>): Project | Promise<Project>;

    abstract updateProject(uuid: string, updateProjectInput: UpdateProjectInput, areaIds?: Nullable<Nullable<number>[]>): Project | Promise<Project>;

    abstract removeProject(uuid: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract archiveProject(uuid: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract unarchiveProject(uuid: string): Nullable<Project> | Promise<Nullable<Project>>;

    abstract createResource(createResourceInput: CreateResourceInput, connectResourceInput: ConnectResourceInput): Resource | Promise<Resource>;

    abstract updateResource(uuid: string, updateResourceInput: UpdateResourceInput): Resource | Promise<Resource>;

    abstract removeResource(uuid: string): Nullable<Resource> | Promise<Nullable<Resource>>;

    abstract archiveResource(uuid: string): Nullable<Resource> | Promise<Nullable<Resource>>;

    abstract unarchiveResource(uuid: string): Nullable<Resource> | Promise<Nullable<Resource>>;

    abstract createTask(createTaskInput: CreateTaskInput): Task | Promise<Task>;

    abstract updateTask(uuid: string, updateTaskInput: UpdateTaskInput): Task | Promise<Task>;

    abstract removeTask(uuid: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract archiveTask(uuid: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract unarchiveTask(uuid: string): Nullable<Task> | Promise<Nullable<Task>>;

    abstract createUser(createUserInput: CreateUserInput): User | Promise<User>;

    abstract updateUser(id: number, updateUserInput: UpdateUserInput): User | Promise<User>;

    abstract setCurrentRefreshToken(refreshToken: string, id: number): User | Promise<User>;

    abstract resetPassword(resetPasswordInput: ResetPasswordInput): User | Promise<User>;

    abstract removeUser(id: number): Nullable<User> | Promise<Nullable<User>>;

    abstract updateProjectTasksOrders(uuid: string, tasksOrdersInput: Nullable<TasksOrdersInput>[]): Nullable<Project> | Promise<Nullable<Project>>;
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

export class Board {
    id?: Nullable<number>;
    uuid?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    isArchived?: Nullable<boolean>;
    project?: Nullable<Project>;
    tasks?: Nullable<Nullable<Task>[]>;
    columns?: Nullable<Nullable<Column>[]>;
}

export class Column {
    id?: Nullable<number>;
    title?: Nullable<string>;
    board?: Nullable<Board>;
    tasks?: Nullable<Nullable<Task>[]>;
}

export class SuccessPayload {
    success: boolean;
}

export class GoalQuery {
    body?: Nullable<string>;
}

export class HandleGoalQueryPayload {
    success: boolean;
    project?: Nullable<Project>;
}

export class Project {
    id?: Nullable<number>;
    uuid?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    progress?: Nullable<number>;
    isArchived?: Nullable<boolean>;
    author?: Nullable<User>;
    authorId?: Nullable<number>;
    boards?: Nullable<Nullable<Board>[]>;
    areas?: Nullable<Nullable<Area>[]>;
    tasks?: Nullable<Nullable<Task>[]>;
    subprojects?: Nullable<Nullable<Project>[]>;
    parentId?: Nullable<number>;
    emoji?: Nullable<string>;
    resources?: Nullable<Nullable<Resource>[]>;
}

export class Resource {
    id?: Nullable<number>;
    uuid?: Nullable<string>;
    title?: Nullable<string>;
    project?: Nullable<Project>;
    projectId?: Nullable<number>;
    taskId?: Nullable<number>;
    task?: Nullable<Task>;
    contentJSON?: Nullable<Json>;
    contentHTML?: Nullable<string>;
    subResources?: Nullable<Nullable<Resource>[]>;
    parentId?: Nullable<number>;
    parent?: Nullable<Resource>;
    isRoot?: Nullable<boolean>;
    isArchived?: Nullable<boolean>;
    emoji?: Nullable<string>;
    author?: Nullable<User>;
    authorId?: Nullable<number>;
}

export class Task {
    id?: Nullable<number>;
    uuid?: Nullable<string>;
    title?: Nullable<string>;
    description?: Nullable<string>;
    order?: Nullable<number>;
    board?: Nullable<Board>;
    column?: Nullable<Column>;
    columnId?: Nullable<number>;
    project?: Nullable<Project>;
    projectId?: Nullable<number>;
    dueDate?: Nullable<DateTime>;
    isCompleted?: Nullable<boolean>;
    isArchived?: Nullable<boolean>;
    listOrder?: Nullable<number>;
}

export class User {
    id?: Nullable<number>;
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    password?: Nullable<string>;
    email?: Nullable<string>;
    avatarURL?: Nullable<string>;
    isOauthUser?: Nullable<boolean>;
}

export type AccountType = any;
export type Json = any;
export type DateTime = any;
export type UserWhereUniqueInput = any;
type Nullable<T> = T | null;
