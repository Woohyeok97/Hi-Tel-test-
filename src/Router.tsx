import { Navigate, Route, Routes } from "react-router-dom";
// pages
import HomePage from "pages/home";
import MyPage from "pages/my";
import PostDetailPage from "pages/post/detail";
import PostEditPage from "pages/post/edit";
import SearchPage from "pages/search";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";


interface RouterProps {
    isAuthenticated : boolean,
}

export default function Router({ isAuthenticated } : RouterProps) {
    console.log(isAuthenticated)
    return (
        <Routes>
            <Route path="/" element={ <HomePage/> }/>
            <Route path="/post/detail/:id" element={ <PostDetailPage/> }/>
            <Route path="/search" element={ <SearchPage/> }/>

            { isAuthenticated && <>
                <Route path="/my/:id" element={ <MyPage/> }/>
                <Route path="/post/edit/:id" element={ <PostEditPage/> }/>
            </> }
            
            {/* 나중에 부정으로 수정하기 */}
            { !isAuthenticated && <>
                <Route path="/users/login" element={ <LoginPage/> }/>
                <Route path="/users/signup" element={ <SignupPage/> }/>
            </> }
            
            {/* 이상한 경로  */}
            <Route path="*" element={ <Navigate replace to="/"/> }/>
        </Routes>
    )
}