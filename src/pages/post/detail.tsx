import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { useParams } from "react-router-dom"
// components
import FollowBtn from "components/followBtn/FollowBtn"
// 데이터 타입
import { PostType } from "interface"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "firebaseApp"



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
            })
        }
    }, [id])


    useEffect(() => {
        if(id) fetchPost()
    }, [fetchPost, id])



    return (
        <div className="page">
            <div className="page__header">[ 게 / 시 / 물 / 광 / 장 ]</div>
            <div></div>
            {/* <FollowBtn/> */}
        </div>
    )
}