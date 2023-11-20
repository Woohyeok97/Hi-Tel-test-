import { useContext, useState } from "react"
import AuthContext from "context/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
// 데이터 타입
import { PostType } from "interface";
import useNofitication from "hooks/useNotification";


interface CommentFormProps {
    post : PostType
}

export default function CommentForm({ post } : CommentFormProps) {
    const { user } = useContext(AuthContext)
    const [ content, setContent ] = useState<string>('')
    const { createNotification } = useNofitication({ targetUid : post?.uid })

    // 전송 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 로그인 유효성검사
        if(!user?.uid) {
            console.log('접속이후 이용해주십시오.')
            return
        }
        if(!content) {
            console.log('덧글을 입력해주십시오.')
            return
        }
        if(post?.id) {
            try {
                const postRef = doc(db, 'posts', post?.id)
                const addComment = {  // comments 필드에 추가할 코멘트객체
                    uid : user?.uid,
                    email : user?.email,
                    createdAt : new Date().toLocaleDateString("ko", {
                        hour : '2-digit',
                        minute : '2-digit',
                        second : '2-digit'
                    }),
                    content : content,
                }
                await updateDoc(postRef, {
                    comments : arrayUnion(addComment),
                })
                // 알림생성(다른유저 작성시)
                if(user?.uid !== post?.uid) {
                    await createNotification(`회원님 게시물에 덧글이 달렸습니다.`, `/post/detail/${post?.id}`)
                }
                
                setContent('')
                console.log('덧글을 남겼습니다.')
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    // 코멘트 입력 핸들러
    const handleComment = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e?.target;
        setContent(value)
    }

    return (
        <form onSubmit={ handleSubmit } className="form">
            <div className="form__block">
                <textarea
                    onChange={ handleComment }
                    value={ content }
                    spellCheck={false}
                    placeholder={ user?.uid ? "덧글을 입력해 주십시오." : "접속이후 이용해주십시오." }
                />
            </div>

            <div className="form__submit">
                <input 
                    type="submit"
                    value={`덧글 남기기`}
                    className="form__input-btn"
                />
            </div>
        </form>
    )
}