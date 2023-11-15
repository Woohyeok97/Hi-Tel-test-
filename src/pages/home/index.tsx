import { useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { Link } from "react-router-dom"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"
import { db } from "firebaseApp"
// components
import PostForm from "components/post/PostForm"
import PostItem from "components/post/PostItem"
// 데이터 타입
import { PostType } from "interface"



type TabType = 'all' | 'following'

export default function HomePage() {
    const { user } = useContext(AuthContext)
    const [ activeTab, setActiveTab ] = useState<TabType>('all')
    const [ postList, setPostList ] = useState<PostType[]>([])

    // firestore에서 게시물리스트 가져오기
    const fetchPostList = () => {
        const postListRef = collection(db, 'posts');
        // 게시물을 최신순으로 가져오기 위해 query사용 
        const postListQuery = query(postListRef, orderBy('createdAt', 'desc'));
        
        // onSnapshot으로 실시간 리스너 부착
        onSnapshot(postListQuery, (snpashot) => {
            // 왜 타입에러가 나지;
            // const result : PostType[] = snpashot.docs.map((doc) => ({ ...(doc?.data()), id : doc?.id }))
            // setPostList(result)
            const result = snpashot.docs.map((doc) => ({ id : doc?.id, ...doc?.data() }))
            setPostList(result as PostType[])
        })
    }

    useEffect(() => {
        fetchPostList()
    }, [activeTab])
    

    return (
        <div className="page">
            <h1 className="page__title">초기화면</h1>
            <PostForm/>

            <div className="page__header">[ 게 / 시 / 물 / 광 / 장 ]</div>

            <div className="page__tabs">
                <div className={`page__tab ${ activeTab === 'all' && 'page__tab--active' }`}
                    onClick={()=>{ setActiveTab('all') }}>전체글</div>
                <div className={`page__tab ${ activeTab === 'following' && 'page__tab--active' }`}
                    onClick={()=>{ setActiveTab('following') }}>팔로윙</div>
            </div>
            
            {/* 게시물 */}
            <div className="page__">
                { postList?.map((item) => <PostItem post={ item } key={item?.id}/> )}
            </div>
        </div>
    )
}