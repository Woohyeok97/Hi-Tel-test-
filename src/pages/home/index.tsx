import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { db } from "firebaseApp"
// components
import PostForm from "components/post/PostForm"
import PostItem from "components/post/PostItem"
// 데이터 타입
import { FollowType, PostType } from "interface"



type TabType = 'all' | 'following'

export default function HomePage() {
    const { user } = useContext(AuthContext)
    const [ activeTab, setActiveTab ] = useState<TabType>('all')
    const [ following, setFollowing ] = useState<string[]>([])

    const [ postList, setPostList ] = useState<PostType[]>([])
    const [ followingPostList, setFollowingPostList ] = useState<PostType[]>([])


    // firestore에서 게시물리스트 가져오기
    const fetchPostList = () => {
        const postsRef = collection(db, 'posts');
        // 게시물을 최신순으로 가져오기 위해 query사용 
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
        
        // onSnapshot으로 실시간 리스너 부착
        onSnapshot(postsQuery, (snpashot) => {
            // 왜 타입에러가 나지;
            // const result : PostType[] = snpashot.docs.map((doc) => ({ ...(doc?.data()), id : doc?.id }))
            // setPostList(result)
            const result = snpashot.docs.map((doc) => ({ id : doc?.id, ...doc?.data() }))
            setPostList(result as PostType[])
        })
    }

    // 팔로윙 리스트 가져오기
    const fetchFollowing = useCallback(() => {
        if(user?.uid) {
            const followingRef = doc(db, 'following', user?.uid) 
            onSnapshot(followingRef, (doc) => {
                const result = doc?.data()?.users?.map((item : FollowType) => item?.uid)
                setFollowing(result)
            })
        }
    }, [user?.uid])

    // 팔로잉한 포스트 리스트 가져오기
    const fetchFollowingPostList = useCallback(() => {
        if(following?.length) {
            const postsRef = collection(db, 'posts')
            const postsQuery = query(postsRef, where('uid', 'in', following), orderBy('createdAt', 'desc'))
            // 이 윗부분
            onSnapshot(postsQuery, (snapshot) => {
                const result = snapshot?.docs?.map((item) => ({ id : item?.id, ...item?.data() }))
                setFollowingPostList(result as PostType[])
            })
        }
    }, [following])

    
    // 포스트 리스트 요청
    useEffect(() => {
        setActiveTab('all') // 로그인상태가 변경되면 activeTab 초기화
        fetchPostList()
    }, [user?.uid])

    // 팔로잉 목록 요청
    useEffect(() => {
        if(user?.uid) fetchFollowing()
    }, [fetchFollowing, user?.uid])

    // 팔로잉 포스트 리스트 요청
    useEffect(() => {
        if(following?.length) fetchFollowingPostList()
    }, [fetchFollowingPostList, following])


    return (
        <div className="page">
            <h1 className="page__header">초기화면</h1>
            
            <div className="page__title">[ 게 / 시 / 물 / 작 / 성 ]</div>
            <PostForm/>

            <div className="page__title">[ 게 / 시 / 물 / 광 / 장 ]</div>

            <div className="page__tabs">
                <div className="page__flex">
                    <div className={`page__tab ${ activeTab === 'all' && 'page__tab--active' }`}
                        onClick={()=>{ setActiveTab('all') }}>전체글</div>

                    <div className={`page__tab ${ activeTab === 'following' && 'page__tab--active' }`}
                        onClick={()=>{ user?.uid && setActiveTab('following') }}>
                        팔로윙{ !user?.uid && '(접속필요)' }
                    </div>
                </div>
            </div>
            
            {/* 게시물 */}
            <div>
                { activeTab === 'all' && postList?.map((item) => <PostItem post={ item } key={item?.id}/> ) }

                { activeTab === 'following' && user?.uid && (followingPostList.length
                ? followingPostList?.map((item) => <PostItem post={ item } key={item?.id}/>)
                : <div>게시물이 없습니다.</div> )}
            </div>
        </div>
    )
}