import { Navigate, Route, Routes } from "react-router-dom";
// pages
import HomePage from "pages/home";
import PostDetailPage from "pages/post/detail";
import PostEditPage from "pages/post/edit";
import SearchPage from "pages/search";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";
import ProfilePage from "pages/profile";
import ProfileEditPage from "pages/profile/edit";
import NotifiCationPage from "pages/notification";


interface RouterProps {
    isAuthenticated : boolean,
}

export default function Router({ isAuthenticated } : RouterProps) {
    
    return (
        <Routes>
            <Route path="/" element={ <HomePage/> }/>
            <Route path="/post/detail/:id" element={ <PostDetailPage/> }/>
            <Route path="/search" element={ <SearchPage/> }/>

            { isAuthenticated && <>
                <Route path="/profile/:id" element={ <ProfilePage/> }/>
                <Route path="/profile/edit/:id" element={ <ProfileEditPage/> }/>
                <Route path="/post/edit/:id" element={ <PostEditPage/> }/>
                <Route path="/notification/:id" element={ <NotifiCationPage/> }/>
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