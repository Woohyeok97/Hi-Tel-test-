export interface PostType {
    id : string,
    uid : string,
    email : string,
    createdAt : string,
    content : string,
    hashTag? : string[],
    likes? : string[],
    likeCount : number,
}

export interface CommandActionType {
    [key : string] : () => void | string | Promise<void>
}