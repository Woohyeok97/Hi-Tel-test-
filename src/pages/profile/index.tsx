import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import AuthContext from "context/AuthContext"
// components
import FollowBtn from "components/followBtn/FollowBtn"
import PostItem from "components/post/PostItem"

const temp = [
    {
        id : '1233',
        uid : '12dsd',
        email : 'asdds',
        createdAt : '2020.2.2',
        content : 'hi world',
        likeCount : 0,
    },
    {
        id : '123323',
        uid : '12dsd',
        email : 'asdds',
        createdAt : '2020.2.2',
        content : 'hi world',
        likeCount : 0,
    }
]


type ProfilePageTabType = "my" | "likes"

export default function ProfilePage() {
    const { user } = useContext(AuthContext)
    const [ activeTab, setActiveTab ] = useState<ProfilePageTabType>("my")
    
    // 이제 로그인한 본인의 정보 or 다른유저의 정보에 따른 데이터바인딩 개발
    // (다른유저 정보라면 팔로잉, 메시지 ui만들어서 렌더링)
    // 초기 포스트리스트 가져오기
    // 액티브탭별로 포스트리스트 렌더링하기
    return (
        <div className="page">
            <h1 className="page__title">프로필화면</h1>

            <div className="profile">
                {/* 프로필사진 & 게시물,팔로우 정보 */}
                <div className="profile__block">
                    <div className="profile__flex-between">
                        <div className="profile__user-img"></div>
                        <div className="profile__flex-between">
                            <div className={`profile__info ${true && 'profile__info-no'}`}>
                                <div>{0}</div>게시물
                            </div>
                            <div className={`profile__info ${false && 'profile__info-no'}`}>
                                <div>{233}</div>팔로워
                            </div>
                            <div className={`profile__info ${false && 'profile__info-no'}`}>
                                <div>{198}</div>팔로윙
                            </div>
                        </div>
                    </div>
                </div>

                {/* 유저정보 & 프로필유틸 */}
                <div className="profile__block">
                    <div className="profile__flex-between">
                        <div>
                            <div className="profile__name">{ user?.displayName || '이름미정' }</div>
                            <div className="profile__email">{ user?.email }</div>
                        </div>
                        <div className="profile__edit">
                            <Link to={`/`}>회원정보 편집</Link>
                        </div>
                    </div>
                </div>

                {/* 게시물 탭 */}
                <div className="profile__tabs">
                    <div className="profile__flex">
                        <div className={`profile__tab ${activeTab === 'my' && 'profile__tab--active'}`} 
                            onClick={()=>{ setActiveTab('my') }}>작성 게시물</div>
                        <div className={`profile__tab ${activeTab === 'likes' && 'profile__tab--active'}`}
                            onClick={()=>{ setActiveTab('likes') }}>추천한 게시물</div>
                    </div>
                </div>
                
                {/* 게시물 목록 */}
                <div>
                {/* { temp?.map((item) => <PostItem key={item?.id} post={item}/>) } */}
                </div>
            </div>
        </div>
    )
}