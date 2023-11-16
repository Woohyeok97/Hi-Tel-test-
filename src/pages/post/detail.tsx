import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { useParams } from "react-router-dom"
// components
import FollowBtn from "components/followBtn/FollowBtn"
// 데이터 타입
import { PostType } from "interface"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "firebaseApp"
import CommentForm from "components/comment/CommentForm"
import CommentItem from "components/comment/CommentItem"



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

    useEffect(() => {
        if(id) fetchPost()
    }, [fetchPost, id])



    return (
        <div className="page">
            <div className="page__header">[ 게 / 시 / 물 / 광 / 장 ]</div>
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
                        <div className="post__like">추천 : 0</div>
                        <div>덧글 : 0</div>
                    </div>
                    <div className="post__flex">
                        <div className="post__edit">편집</div>
                        <div className="post__delete">삭제</div>
                    </div>
                </div>
            </div>

            <div className="comment">
                <CommentForm/>
                <CommentItem/>
                <CommentItem/>
                <CommentItem/>
            </div>
        </div>
    )
}