import { useState } from "react"
// components
import PostItem from "components/post/PostItem"
// 데이터 타입
import { PostType } from "interface"


const temp : PostType[] = [
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

export default function SearchPage() {
    const [ searchQuery, setSearchQuery ] = useState<string>('')

    // 검색쿼리 핸들러
    const handleSearchQuery = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setSearchQuery(value?.trim())
    }


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
                    <div className={`search__tab search__tab--active`}>해쉬태그</div>
                </div>

                {/* 게시물 목록 */}
                <div className="search__list">
                { temp?.length 
                    ? temp?.map((item) => <PostItem key={item?.id} post={item}/>)
                    : <div className="search__no-result">검색결과가 없습니다.</div> }
                </div>
            </div>
            
        </div>
    )
}