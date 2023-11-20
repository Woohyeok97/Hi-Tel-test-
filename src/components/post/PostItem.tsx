import styles from './Post.module.scss'
import { Link } from 'react-router-dom'
// components
import FollowBtn from 'components/followBtn/FollowBtn'
// 데이터 타입
import { PostType } from "interface"
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from 'firebaseApp'
import { useContext } from 'react'
import AuthContext from 'context/AuthContext'


interface PostItemProps {
    post : PostType
}

export default function PostItem({ post } : PostItemProps) {
    const { user } = useContext(AuthContext)

    // 게시물 삭제 핸들러
    const handlePostDelete = async () => {
        const confirm = window.confirm('게시물을 삭제하겠습니까?')

        if(confirm && post?.uid === user?.uid) {
            try {
                const postRef = doc(db, 'posts', post?.id)
                await deleteDoc(postRef)
    
                console.log('게시물을 삭제했습니다.')
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    return (
        <div className={ styles.post }>
            <Link to={`/profile/${post?.uid}`}>
            <div className={ styles.post__header }>
                <div className={ styles.post__userImg }></div>
                <div>
                    <div className="post__name">글쓴이 : { post?.uid }</div>
                    <div className="post__created">날짜 : { post?.createdAt }</div>
                </div>
            </div>
            </Link>
            

            <Link to={`/post/detail/${post?.id}`}>
            <div className={ styles.post__content }>
                {/* 게시물 내용 */}
                <div className={ styles.post__text }>{ post?.content }</div>

                {/* 해쉬태그 */}
                <div className={ styles.post__flex }>
                { post?.hashTag?.map((item) => <span key={item} className={ styles.post__hashTag }>#{ item }</span>) }
                </div>
            </div>
            </Link>

            <div className={ styles.post__footer }>
                <div className={ styles.post__flex }>
                    <div className="post__like">
                        추천 : { post?.likeCount || 0 }
                    </div>
                    <div>덧글 : { post?.comments?.length || 0 }</div>
                </div>
                { post?.uid === user?.uid && 
                <div className={ styles.post__flex }>
                    <div className="post__edit">
                        <Link to={`/post/edit/${post?.id}`}>편집</Link>
                    </div>
                    <div className="post__delete">삭제</div>
                </div> }
            </div>
        </div>
    )

    // return (
    //     <div className={ styles.post }>
    //         <div className={ styles.post__header }>
    //             {/* 작성회원 프로필 */}
    //             <div className={ styles.post__flex }>
    //                 <div className={ styles.post__userImg }></div>
    //                 <div>
    //                     <div className={ styles.post__userName }>
    //                     글쓴이 : { post?.uid }
    //                     </div>
    //                     <div className={ styles.post__createdAt }>
    //                         날짜 : { post?.createdAt }
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* 포스트 유틸 */}
    //             { post?.uid === user?.uid && 
    //             <div className={ styles.post__flex }>
    //                 <div className={ styles.post__edit }>
    //                     <Link to={`/post/edit/${post?.id}`}>편집</Link>
    //                 </div>
    //                 <div className={ styles.post__delete } onClick={ handlePostDelete }>삭제</div>
    //             </div> }

    //             {/* <FollowBtn/> */}
    //         </div>
            
    //         {/* 게시물 내용 */}
    //         <Link to={`/post/detail/${post?.id}`}>
    //             <div className={ styles.post__content }>{ post?.content }</div>
    //         </Link>
            
    //         <div className={ styles.post__footer }>
    //             <div className={ styles.post__flex }>
    //                 <span className={ styles.post__hashTag }>#아싸</span>
    //                 <span className={ styles.post__hashTag }>#월드컵</span>
    //                 <span className={ styles.post__hashTag }>#붉은악마</span>
    //             </div>
    //             <div className={ styles.post__flex }> 
    //                 <div>추천 : 0</div>
    //                 <div>덧글 : 0</div>
    //             </div>
    //         </div>
    //     </div>
    // )
}