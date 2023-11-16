// 게시물 인터페이스
export interface PostType {
    id : string,
    uid : string,
    email : string,
    createdAt : string,
    content : string,
    hashTag? : string[],
    likes? : string[],
    likeCount : number,
    comments? : CommentType[]
}

// 코멘트 인터페이스
export interface CommentType {
    id : string,
    uid : string,
    email : string,
    createdAt : string,
    content : string,
}

// 팔로우 인터페이스
export interface FollowType {
    uid : string,
}

// 명령어 액션 인터페이스
export interface CommandActionType {
    [key : string] : () => void | string | Promise<void>
}