import { useCallback, useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AuthContext from "context/AuthContext"
import { db } from "firebaseApp"
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore"
// components
import FollowBtn from "components/followBtn/FollowBtn"
import PostItem from "components/post/PostItem"
// 데이터 타입
import { FollowType, PostType, ProfileType } from "interface"



type ProfilePageTabType = "my" | "likes"

export default function ProfilePage() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const [ profile, setProfile ] = useState<ProfileType | null>(null)
    const [ postList, setPostList ] = useState<PostType[]>([])
    const [ likePostList, setLikePostList ] = useState<PostType[]>([])

    const [ follower, setFollower ] = useState<FollowType[]>([])
    const [ following, setFollowing ] = useState<FollowType[]>([])

    const [ activeTab, setActiveTab ] = useState<ProfilePageTabType>("my")
    
    
    // 유저프로필 가져오기
    const fetchProfile = useCallback(async () => {
        if(id) {
            const profileRef = doc(db, 'profiles', id)
            const result = await getDoc(profileRef)
    
            setProfile({ uid : result?.id, ...result?.data() } as ProfileType)
        }
    }, [id])

    // 팔로워 & 팔로잉 가져오기
    const fetchFollow = useCallback(async () => {
        if(id) {
            const followerRef = doc(db, 'follower', id)
            const followingRef = doc(db, 'following', id)

            onSnapshot(followerRef, (doc) => {
                const result = doc?.data()?.users?.map((item : FollowType) => ({ uid : item?.uid }))
                // result가 없다면 빈배열 할당(0)
                console.log(result, '팔로워')
                setFollower(result || [])
            })
            onSnapshot(followingRef, (doc) => {
                const result = doc?.data()?.users?.map((item : FollowType) => ({ uid : item?.uid }))
                // result가 없다면 빈배열 할당(0)
                console.log(result, '팔로잉')
                setFollowing(result || [])
            })
        }
        
    }, [id])
    
    // 작성한 포스트리스트 가져오기
    const fetchPostList = useCallback(async () => {
        if(profile?.uid) {
            const postsRef = collection(db, 'posts')
            const postsQuery = query(postsRef, where('uid', '==', profile?.uid), orderBy('createdAt', 'desc'))

            onSnapshot(postsQuery, (snapshot) => {
                const result = snapshot?.docs?.map((item) => ({ id : item?.id, ...item?.data() }))
                setPostList(result as PostType[])
            })
        }
    }, [profile?.uid])

    // 좋아요 포스트리스트 가져오기(프로필 == 로그인유저 일때)
    const fetchLikePostList = useCallback(async () => {
        if(profile?.uid === user?.uid) {
            const postsRef = collection(db, 'posts')
            const postsQuery = query(postsRef, where('likes', 'array-contains', user?.uid), orderBy('createdAt', 'desc'))

            onSnapshot(postsQuery, (snapshot) => {
                const result = snapshot?.docs?.map((item) => ({ id : item?.id, ...item?.data() }))
                setLikePostList(result as PostType[])
            })
        }
    }, [profile?.uid])

    // 프로필 요청
    useEffect(() => {
        if(id) {
            setActiveTab('my') // id가 바뀌면 activeTab,profile 초기화
            setProfile(null)

            fetchProfile()
        }
    }, [fetchProfile, id])

    // 팔로워 & 팔로잉 요청
    useEffect(()=>{
        if(id) fetchFollow()
    }, [fetchFollow, id])

    // 작성 게시물 요청
    useEffect(() => {
        if(profile?.uid) fetchPostList()
    }, [fetchPostList, profile?.uid])

    // 좋아요 게시물 요청(프로필 == 로그인유저 일때)
    useEffect(() => {
        if(profile?.uid === user?.uid) fetchLikePostList()
    }, [fetchLikePostList, profile?.uid])

    // console.log('렌더링!')
    
    return (
        <div className="page">
            <h1 className="page__header">회원정보</h1>
            { profile && 
            <div className="profile">
                {/* 프로필사진 & 게시물,팔로우 정보 */}
                <div className="profile__block">
                    <div className="profile__flex-between">
                        <div className="profile__user-img"></div>
                        <div className="profile__flex-between">
                            <div className={`profile__info ${ !postList?.length && 'profile__info-no'}`}>
                                <div>{ postList?.length }</div>게시물
                            </div>
                            <div className={`profile__info ${false && 'profile__info-no'}`}>
                                <div>{ follower?.length }</div>팔로워
                            </div>
                            <div className={`profile__info ${false && 'profile__info-no'}`}>
                                <div>{ following?.length }</div>팔로윙
                            </div>
                        </div>
                    </div>
                </div>

                {/* 유저정보 & 프로필유틸 */}
                <div className="profile__block">
                    <div className="profile__flex-between">
                        <div>
                            <div className="profile__name">{ profile?.displayName || '이름미정' }</div>
                            <div className="profile__email">{ profile?.email }</div>
                        </div>

                        { user?.uid === profile?.uid ? 
                        <div className="profile__edit">
                            <Link to={`/profile/edit/${profile?.uid}`}>회원정보 편집</Link>
                        </div> : 
                        <FollowBtn targetUid={ profile?.uid }/> }
                        
                    </div>
                </div>

                {/* 게시물 탭 */}
                <div className="profile__tabs">
                    <div className="profile__flex">
                        <div className={`profile__tab ${activeTab === 'my' && 'profile__tab--active'}`} 
                            onClick={()=>{ setActiveTab('my') }}>작성 게시물</div>

                        { profile?.uid === user?.uid && // 로그인유저의 프로필일때만 렌더링
                        <div className={`profile__tab ${activeTab === 'likes' && 'profile__tab--active'}`}
                            onClick={()=>{ setActiveTab('likes') }}>추천한 게시물</div> }
                    </div>
                </div>
                
                {/* 게시물 목록 */}
                <div>
                { activeTab === 'my' && postList?.map((item) => <PostItem key={item?.id} post={item}/>)}
                { activeTab === 'likes' && profile?.uid === user?.uid && // 로그인유저의 프로필일때만 렌더링
                    likePostList?.map((item) => <PostItem key={item?.id} post={item}/>) }
                </div>
            </div> }
        </div>
    )
}