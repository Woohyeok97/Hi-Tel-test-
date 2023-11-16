import styles from './Post.module.scss'
import { useContext, useState } from 'react'
import AuthContext from 'context/AuthContext'
import { db } from 'firebaseApp'
import { addDoc, collection } from 'firebase/firestore'



export default function PostForm() {
    const { user } = useContext(AuthContext)
    // 여러번 클릭방지 상태
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)
    // 입력중인 해쉬태그
    const [ hashTag, setHashTag ] = useState<string>('')

    const [ content, setContent ] = useState<string>('')
    const [ hashTagList, setHashTagList ] = useState<string[]>([])
    

    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true)
        e.preventDefault()

        // 로그인상태 유효성검사
        if(!user?.uid) {   
            console.log('접속이후 이용해주십시오.')
            setIsSubmitting(false)
            return
        }
        // content 유효성검사
        if(!content) {
            console.log('게시물 내용을 입력해주십시오.')
            setIsSubmitting(false)
            return
        }
        // 게시물 업로드
        try {
            const postsRef = collection(db, 'posts');
            // 'posts' 콜렉션에 추가할 객체
            const insertPost = {
                uid : user?.uid,
                email : user?.email,
                content : content,
                hashTag : hashTagList,
                createdAt : new Date().toLocaleDateString("ko", {
                    hour : '2-digit',
                    minute : '2-digit',
                    second : '2-digit'
                }),
            }
            await addDoc(postsRef, insertPost)

            setContent('')
            setHashTagList([])
            console.log('게시물을 작성하였습니다.')

        } catch(err : any) {
            console.log(err?.code)
        }
        setIsSubmitting(false)
    }

    // content입력 핸들러
    const handleContent = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setContent(value)
    }

    // 해쉬태그 입력 핸들러
    const handleHashTag = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setHashTag(value?.trim())
    }

    // 해쉬태그 삭제 핸들러
    const handleRemoveHashTag = (e : any) => {
        const { id } = e.target;
        setHashTagList((prev) => prev.filter((item) => item !== id))
    }

    // 입력한 해쉬태그 hashTagList에 추가 핸들러
    const handleKeyUp = (e : any) => {
        const SPACE_KEY_CODE = 32 // 스페이스바 keyCode가 32임
        
        if(hashTag?.trim() !== '' && e?.keyCode == SPACE_KEY_CODE) {
            // 예외처리 -> hashTagList 개수제한
            if(hashTagList.length >= 3) {
                console.log('고마해라.')
                setHashTag('')
                return
            }
            // 예외처리 -> 입력한 해쉬태그가 이미 hashTagList에 있을때
            if(hashTagList.includes(hashTag?.trim())) {
                console.log('이미있다.')
                setHashTag('') 
                return
            }

            setHashTagList((prev) => [...prev, hashTag])
            setHashTag('')
        }
    }

    
    return (
        <form onSubmit={ handleSubmit } className={ styles.postForm }>
            <div className={ styles.postForm__header }>[ 게 / 시 / 물 / 작 / 성 ]</div>

            <div className={ styles.postForm__block }>
                <textarea 
                    onChange={ handleContent }
                    value={ content }
                    spellCheck={false}
                    placeholder="> 내용을 입력해주세요."
                />
            </div>
            
            <div className={ styles.postForm__block }>
                <div className={ styles.postForm__flex }>
                    { hashTagList?.length > 0 && hashTagList?.map((item) => 
                    ( <span key={item} id={item} className={ styles.postForm__hashTag }
                    onClick={ handleRemoveHashTag }>#{ item }</span>) )}
                </div>
                <input
                    type='text'
                    value={ hashTag }
                    onChange={ handleHashTag }
                    onKeyUp={ handleKeyUp }
                    className={ styles.postForm__input } 
                    placeholder='> 해쉬태그 + 스페이스바 (최대 3개)'
                />
            </div>
            
            <input type="submit" value="글작성" className={ styles.postForm__btn } disabled={isSubmitting}/>
        </form>
    )
}