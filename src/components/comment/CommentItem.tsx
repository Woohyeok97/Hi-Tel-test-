import { useContext } from "react"
import AuthContext from "context/AuthContext"
import { arrayRemove, doc, updateDoc } from "firebase/firestore"
import { db } from "firebaseApp"
// 데이터 타입
import { CommentType, PostType } from "interface"

interface CommentItemProps {
    comment : CommentType,
    post : PostType,
}


export default function CommentItem({ comment, post } : CommentItemProps) {
    const { user } = useContext(AuthContext)

    // 코멘트 삭제 핸들러
    const handleDeleteComment = async () => {
        const confirm = window.confirm('덧글을 삭제하시겠습니까?')

        if(confirm && comment.uid === user?.uid) {
            try {
                const postRef = doc(db, 'posts', post?.id)
                await updateDoc(postRef, {
                    comments : arrayRemove(comment)
                })
    
                console.log('덧글을 삭제하였습니다.')
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    
    return (
        <div className="comment">
            {/* 코멘트유저 프로필 */}
            <div className="comment__header">
                <div className="comment__flex">
                    <div className="comment__user-img"></div>
                    <div>
                        <div className="comment__name">글쓴이 : { comment?.uid }</div>
                        <div className="comment__created">날짜 : { comment?.createdAt }</div>
                    </div>
                </div>

                { comment?.uid === user?.uid && 
                <div className="comment__delete" onClick={ handleDeleteComment }>삭제</div> }
            </div>
            
            <div className="comment__content">{ comment?.content }</div>
        </div>
    )
}