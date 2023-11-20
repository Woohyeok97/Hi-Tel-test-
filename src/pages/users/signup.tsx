import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GithubAuthProvider, GoogleAuthProvider, User, createUserWithEmailAndPassword, getAuth, signInWithPopup } from "firebase/auth";
import { app, db } from "firebaseApp";
import { addDoc, collection } from "firebase/firestore";


export default function SignupPage() {
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const [ passwordConfirm, setPasswordConfirm ] = useState<string>('')
    // 에러메시지 상태관리
    const [ errMessage, setErrMessage ] = useState<string>('')
    const navigate = useNavigate()


    // member콜렉션 추가 함수
    const createMember = async (userData : User) => {
        try {
            const membersRef = collection(db, 'members')
            const insertMember = {
                uid : userData?.uid,
                email : userData?.email,
                displayName : userData?.displayName,
                photoURL : userData?.photoURL,
                createdAt : new Date().toLocaleDateString("ko", {
                    hour : '2-digit',
                    minute : '2-digit',
                    second : '2-digit',
                }),
            }
    
            await addDoc(membersRef, insertMember)
        } catch(err : any) {
            console.log(err?.code)
            throw err
        }
    }
    
    // 가입요청 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const auth = getAuth(app)
            const result = await createUserWithEmailAndPassword(auth, email, password)

            // 회원가입시, members콜렉션에 유저프로필데이터 저장
            await createMember(result?.user)

            navigate('/')
            console.log('신규가입을 환영합니다.')
            
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // 소셜로그인 핸들러
    const handleSocialLogin = async (e : any) => {
        const { name } = e?.target;

        try {
            const auth = getAuth(app);
            let provider;

            if(name === 'google') {
                provider = new GoogleAuthProvider();
            }
            if(name === 'github') {
                provider = new GithubAuthProvider();
            }
            // signInWithPopup()으로 소셜로그인
            const result = await signInWithPopup(auth, provider as GoogleAuthProvider | GithubAuthProvider)
            // 회원가입시, members콜렉션에 유저프로필데이터 저장
            await createMember(result?.user)

            navigate('/')
            console.log('신규가입을 환영합니다.')

        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // 폼데이터 핸들러
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        // 이메일 형식 정규식
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const { name, value } = e?.target;

        let errMessage = ''
        
        if(name === 'email') {
            setEmail(value?.trim())
            
            if(!value?.match(validRegex)) {
                errMessage = '이메일 형식으로 입력해주십시오.'
            } else if(password && password?.length < 8) {
                errMessage = '비밀번호는 8자 이상으로 입력해주십시오.'
            } else if(passwordConfirm && passwordConfirm !== password) {
                errMessage = '비밀번호를 확인해주십시오.'
            }
        }
        if(name === 'password') {
            setPassword(value?.trim())

            if(value && value?.length < 8) {
                errMessage = '비밀번호는 8자 이상으로 입력해주십시오.'
            } else if(passwordConfirm && passwordConfirm !== value?.trim()) {
                errMessage = '비밀번호를 확인해주십시오.'
            } else if(email && !email?.match(validRegex)) {
                errMessage = '이메일 형식으로 입력해주십시오.'
            }
        }
        if(name === 'passwordConfirm') {
            setPasswordConfirm(value?.trim())
            
            if(password && password?.length < 8) {
                errMessage = '비밀번호는 8자 이상으로 입력해주십시오.'
            } else if(password && password !== value?.trim()) {
                errMessage = '비밀번호를 확인해주십시오.'
            } else if(email && !email?.match(validRegex)) {
                errMessage = '이메일 형식으로 입력해주십시오.'
            }
        }

        setErrMessage(errMessage)
    }

   

    return (
        <div className="page">
            <h1 className="page__title">신규가입 화면</h1>

            <form onSubmit={ handleSubmit } className="form">
                <div className="form__block">
                    <label htmlFor="email">{'[ 사용할 ID : ]'}</label>
                    <input 
                        type="email" 
                        name="email"
                        id="email" 
                        onChange={ handleChange }
                        className="form__input"
                    />
                </div>

                <div className="form__block">
                    <label htmlFor="password">{'[ 비밀번호 : ]'}</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        onChange={ handleChange }
                        className="form__input"
                    />
                </div>

                <div className="form__block">
                    <label htmlFor="passwordConfirm">{'[ 비밀번호 확인 : ]'}</label>
                    <input 
                        type="password"
                        name="passwordConfirm"
                        id="passwordConfirm"
                        onChange={ handleChange }
                        className="form__input"
                    />
                </div>

                <div className="form__block">
                { errMessage && <div>안내) { errMessage }</div> }
                </div>

                <input type="submit" value="신규가입 요청" className="form__input-btn"
                    // 에러메시지가 있거나, 폼데이터값 중에 미입력이 있으면 비활성화
                    disabled={ !!errMessage || (!email || !password || !passwordConfirm) }
                />

                {/* 구글 로그인 */}
                <button name="google" className="form__btn form__btn-google"
                    onClick={ handleSocialLogin }>
                    구글로 시작하기
                </button>
                {/* 깃헙 로그인 */}
                <button name="github" className="form__btn form__btn-github"
                    onClick={ handleSocialLogin }>
                    깃허브로 시작하기
                </button>

                <div className="form__block">
                    <Link to="/users/login" className="form__link">
                        도움말) 기존회원이라면 클릭하십시오.
                    </Link> 
                </div>
            </form>
        </div>
    )
}