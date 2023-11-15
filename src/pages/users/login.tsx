import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { app } from "firebaseApp"

export default function LoginPage() {
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const navigate = useNavigate()
    // 가입요청 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const auth = getAuth(app)
            await signInWithEmailAndPassword(auth, email, password)

            navigate('/')
            console.log('접속하셨습니다.')
        } catch(err : any) {
            console.log(err?.code)
        }
    }


    // 폼데이터 핸들러
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;
        
        if(name === 'email') {
            setEmail(value)
        }
        if(name === 'password') {
            setPassword(value)
        }
    }


   

    return (
        <div className="page">
            <h1 className="page__title">접속화면</h1>

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


                <input type="submit" value="접속 요청" className="form__input-btn"
                    // 폼데이터값 중에 미입력이 있으면 비활성화
                    disabled={ !email || !password }/>

                <div className="form__block">
                    <Link to="/users/signup" className="form__link">
                        도움말) 신규/무료가입을 원하시면 클릭하십시오.
                    </Link> 
                </div>
            </form>
        </div>
    )
}