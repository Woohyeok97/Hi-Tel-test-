import { useState } from "react";
import { Link } from "react-router-dom";
// components


export default function SignupPage() {
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const [ passwordConfirm, setPasswordConfirm ] = useState<string>('')
    // 에러메시지 상태관리
    const [ errMessage, setErrMessage ] = useState<string>('')

    // 가입요청 핸들러
    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            
        } catch(err : any) {

        }
    }


    // 폼데이터 핸들러
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        // 이메일 형식 정규식
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const { name, value } = e?.target;

        let errMessage = ''
        
        if(name === 'email') {
            setEmail(value)
            
            if(!value?.match(validRegex)) {
                errMessage = '이메일 형식으로 입력해주십시오.'
            } else if(password && password?.length < 8) {
                errMessage = '비밀번호는 8자 이상으로 입력해주십시오.'
            } else if(passwordConfirm && passwordConfirm !== value) {
                errMessage = '비밀번호를 확인해주십시오.'
            }
        }
        if(name === 'password') {
            setPassword(value)

            if(value && value?.length < 8) {
                errMessage = '비밀번호는 8자 이상으로 입력해주십시오.'
            } else if(passwordConfirm && passwordConfirm !== value) {
                errMessage = '비밀번호를 확인해주십시오.'
            } else if(email && !email?.match(validRegex)) {
                errMessage = '이메일 형식으로 입력해주십시오.'
            }
        }
        if(name === 'passwordConfirm') {
            setPasswordConfirm(value)
            
            if(password && password?.length < 8) {
                errMessage = '비밀번호는 8자 이상으로 입력해주십시오.'
            } else if(password && password !== value) {
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
                    disabled={ !!errMessage || (!email || !password || !passwordConfirm) }/>

                <div className="form__block">
                    <Link to="/users/login" className="form__link">
                        도움말) 기존회원이라면 클릭하십시오.
                    </Link> 
                </div>
            </form>
        </div>
    )
}