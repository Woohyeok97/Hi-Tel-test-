import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { useParams } from "react-router-dom"
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "firebaseApp"
// components
import FollowBtn from "components/followBtn/FollowBtn"
import CommentForm from "components/comment/CommentForm"
import CommentItem from "components/comment/CommentItem"
// 데이터 타입
import { PostType } from "interface"


export default function PostDetailPage() {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const [ post, setPost ] = useState<PostType | null>(null)

    // 게시물 가져오기
    const fetchPost = useCallback(async () => {
        if(id) {
            const postRef = doc(db, 'posts', id)
            // 코멘트등 실시간 동기화를 위해 onSnapshot으로 게시물 가져오기
            onSnapshot(postRef, (doc) => {
                const result = { id : doc?.id, ...doc?.data() }
                setPost(result as PostType)
            })
        }
    }, [id])

    // 게시물 추천하기 & 취소하기 핸들러
    const handleLike = async () => {
        if(!user?.uid) {
            console.log('접속이후 이용해주십시오.')
            return
        }

        if(post?.id) {
            try {
                const postRef = doc(db, 'posts', post?.id);
                // 기존에 이미 로그인중인 유저가 추천을 했었다면 추천취소
                if(post?.likes?.includes(user?.uid)) {
                    await updateDoc(postRef, {
                        likes : arrayRemove(user?.uid),
                        likeCount : post?.likeCount ? post?.likeCount - 1 : 0
                    })
                    console.log('추천을 취소하였습니다.')
                // 아니라면 게시물추천
                } else {
                    await updateDoc(postRef, {
                        likes : arrayUnion(user?.uid),
                        likeCount : post?.likeCount ? post?.likeCount + 1 : 1
                    })
                    console.log('게시물을 추천하였습니다.')
                }
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    useEffect(() => {
        if(id) fetchPost()
    }, [fetchPost, id])

    return (
        <div className="page">
            <div className="page__header">[ 회 / 원 / 게 / 시 / 물 ]</div>
            <div className="post">
                <div className="post__header">
                    {/* 작성회원 프로필 */}
                    <div className="post__user-img"></div>
                    <div>
                        <div className="post__name">글쓴이 : { post?.uid }</div>
                        <div className="post__created">날짜 : { post?.createdAt }</div>
                    </div>
                    <FollowBtn/>
                </div>

                <div className="post__content">
                    {/* 게시물 내용 */}
                    <div className="post__text">{ post?.content }</div>

                    {/* 해쉬태그 */}
                    <div className="post__flex">
                    { post?.hashTag?.map((item) => (
                        <span key={item} id={item} className="post__hash-tag">#{ item }</span>)
                    ) }
                    </div>
                </div>

                <div className="post__footer">
                    <div className="post__flex">
                        <div className="post__like" onClick={ handleLike }>
                            추천 : { post?.likeCount }
                        </div>
                        <div>덧글 : { post?.comments?.length }</div>
                    </div>
                    <div className="post__flex">
                        <div className="post__edit">편집</div>
                        <div className="post__delete">삭제</div>
                    </div>
                </div>
            </div>

            <div>
                <div className="page__header-sub">[ 덧 / 글 / 남 / 기 / 기 ]</div>
                <CommentForm post={ post }/>
                <div className="page__header-sub">[ 회 / 원 / 들 / 덧 / 글 ]</div>
                { post?.comments?.map((item, i) => 
                    <CommentItem key={i} comment={ item } post={ post }/> 
                )}
            </div>
        </div>
    )
}