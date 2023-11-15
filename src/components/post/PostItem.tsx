import FollowBtn from 'components/followBtn/FollowBtn'
import styles from './Post.module.scss'
// 데이터 타입
import { PostType } from "interface"

interface PostItemProps {
    post : PostType
}

export default function PostItem({ post } : PostItemProps) {

    return (
        <div className={ styles.post }>
            <div className={ styles.post__header }>
                <div className={ styles.post__flex }>
                    <div className={ styles.post__userImg }></div>
                    <div>
                        <div className={ styles.post__userName }>
                        글쓴이 : { post?.uid }
                        </div>
                        <div className={ styles.post__createdAt }>
                            날짜 : { post?.createdAt }
                        </div>
                    </div>
                </div>
                <FollowBtn/>
            </div>

            <div className={ styles.post__content }>{ post?.content }</div>

            <div className={ styles.post__footer }>
                <div className={ styles.post__flex }>
                    <span className={ styles.post__hashTag }>#아싸</span>
                    <span className={ styles.post__hashTag }>#월드컵</span>
                    <span className={ styles.post__hashTag }>#붉은악마</span>
                </div>
                <div className={ styles.post__flex }> 
                    <div>추천 : 0</div>
                    <div>덧글 : 0</div>
                </div>
            </div>
        </div>
    )
}