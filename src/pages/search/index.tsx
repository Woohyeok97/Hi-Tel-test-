import { useCallback, useEffect, useState } from "react"
// components
import PostItem from "components/post/PostItem"
// 데이터 타입
import { PostType } from "interface"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "firebaseApp"


export default function SearchPage() {
    const [ searchQuery, setSearchQuery ] = useState<string>('')
    const [ postList, setPostList ] = useState<PostType[]>([])

    // 검색쿼리 핸들러
    const handleSearchQuery = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setSearchQuery(value?.trim())
    }

    // 검색 포스트리스트 요청
    const fetchPostList = useCallback(() => {
        if(searchQuery) {
            const postsRef = collection(db, 'posts')
            const postsQuery = query(postsRef, where('hashTag', 'array-contains', searchQuery))

            onSnapshot(postsQuery, (snapshot) => {
                const result = snapshot?.docs?.map((item) => ({ id : item?.id, ...item?.data() }))
                setPostList(result as PostType[])
            })
        }
    }, [searchQuery])

    // 포스트리스트 요청
    useEffect(() => {
        if(searchQuery) fetchPostList()
    }, [fetchPostList, searchQuery])


    return (
        <div className="page">
            <h1 className="page__header">검색화면</h1>

            <div className="search">
                <div className="search__flex">
                    <label htmlFor="search">{`검색어 입력 >>`}</label>
                    <input 
                        type="text" 
                        name="search" 
                        id="search"
                        onChange={ handleSearchQuery }
                        value={ searchQuery }
                        placeholder="검색할 단어를 입력해 주십시오."
                        className="search__input"
                    />
                </div>

                <div className="search__tabs">
                    <div className={`search__tab search__tab--active`}>[ 검 색 결 과 ]</div>
                </div>

                {/* 게시물 목록 */}
                <div className="search__list">
                { postList?.map((item) => <PostItem key={item?.id} post={item}/>) }
                </div>
            </div>
        </div>
    )
}