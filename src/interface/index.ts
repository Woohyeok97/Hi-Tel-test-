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

// 유저프로필 인터페이스
export interface ProfileType {
    uid : string,
    email : string,
    displayName : string | null,
    photoURL : string | null,
    createdAt : string,
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

// 알림 인터페이스
export interface NotificationType {
    uid : string,
    content : string,
    createdAt : string,
    url? : string,
    isRead : boolean,
}

// 명령어 액션 인터페이스
export interface CommandActionType {
    [key : string] : () => void | string | Promise<void>
}