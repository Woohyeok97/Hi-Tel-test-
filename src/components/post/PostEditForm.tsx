import styles from './Post.module.scss'
import { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from 'context/AuthContext'
import { db } from 'firebaseApp'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { PostType } from 'interface'


export default function PostEditForm() {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    // 여러번 클릭방지 상태
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)
    // 입력중인 해쉬태그
    const [ hashTag, setHashTag ] = useState<string>('')
    // 수정할 게시물
    const [ prevPost, setPrevPost ] = useState<PostType | null>(null)
    const [ content, setContent ] = useState<string>('')
    const [ hashTagList, setHashTagList ] = useState<string[]>([])
    const navigate = useNavigate()


    // 수정할 게시물 가져오기
    const fetchPost = useCallback(async () => {
        if(id && user?.uid) {
            const postRef = doc(db, 'posts', id)
            
            onSnapshot(postRef, (doc) => {
                // 로그인중인 유저의 게시물인지 유효성검사
                if(doc?.data()?.uid !== user?.uid) {
                    navigate('/')
                    console.log('잘못된 접근입니다.')
                    return
                } 
                setPrevPost({ id : doc?.id, ...doc?.data() } as PostType)
                setContent(doc?.data()?.content)
                setHashTagList(doc?.data()?.hashTag)
            })
        }
    }, [id, user?.uid])

    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true)
        e.preventDefault()

        // 로그인상태 유효성검사
        if(!user?.uid || user?.uid !== prevPost?.uid) {   
            console.log('잘못된 접근입니다.')
            setIsSubmitting(false)
            navigate('/')
            return
        }
        // content 유효성검사
        if(!content) {
            console.log('게시물 내용을 입력해주십시오.')
            setIsSubmitting(false)
            return
        }
        // 게시물 수정
        try {
            const postsRef = doc(db, 'posts', prevPost?.id);
            const updatePost = {
                content : content,
                hashTag : hashTagList,
            }
            await updateDoc(postsRef, updatePost)

            navigate(`/post/detail/${prevPost?.id}`)
            console.log('게시물을 편집하였습니다.')

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
        const SPACE_KEY_CODE = 32

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

            setHashTagList((prev) => [ ...prev, hashTag ])
            setHashTag('')
        }
    }

    // 수정할 게시물 가져오기
    useEffect(() => {
        if(user?.uid) fetchPost()
    }, [fetchPost, user?.uid])


    return (
        <form onSubmit={ handleSubmit } className={ styles.postForm }>
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