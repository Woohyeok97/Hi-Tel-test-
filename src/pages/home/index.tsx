import { useState } from "react"
import { Link } from "react-router-dom"
// components
import PostForm from "components/post/PostForm"
import PostItem from "components/post/PostItem"
// 데이터 타입
import { PostType } from "interface"


const tempList = [
    {
        id : '1',
        uid : '11',
        createdAt : '1997년 어느날',
        content : '한국은 4강을 갑니까?'
    },
    {
        id : '2',
        uid : '21',
        createdAt : '1997년 어느날',
        content : '한국은 4강을 갑니까?'
    },
    {
        id : '3',
        uid : '31',
        createdAt : '1997년 어느날',
        content : '한국은 4강을 갑니까?'
    }
]

export default function HomePage() {
    const [ postList, setPostList ] = useState<PostType[]>(tempList)
    const [ test, setT ] = useState(false)

    return (
        <div className="page">
            <h1 className="page__title">초기화면</h1>
            <PostForm/>

            <div className="page__header">[ 게 / 시 / 물 / 광 / 장 ]</div>
            <div className="page__tabs">
                <div className={`page__tab ${ test ? 'page__tab--active' : '' }`}
                onClick={()=>{ setT((prev) => !prev) }}>{ test && '>' } 전체글</div>
                <div className="page__tab">팔로윙</div>
            </div>
            

            <div className="page__">
                { postList?.map((item) => 
                <Link to={`/post/detail/${item?.id}`} key={item?.uid}>
                    <PostItem post={ item }/>
                </Link> )}
            </div>
        </div>
    )
}