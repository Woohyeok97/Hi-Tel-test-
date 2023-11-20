import AuthContext from "context/AuthContext"
import { useContext, useState } from "react"


export default function ProfileEditPage() {
    const { user } = useContext(AuthContext)
    const [ name, setName ] = useState<string>('')

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {

        } catch(err : any) {
            console.log(err?.code)
        }
    }

    const handleName = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setName(value?.trim())
    }

    return (
        <div className="page">
            <h1 className="page__header">회원정보 편집</h1>

            <form onSubmit={ handleSubmit } className="form">
                <div className="form__flex">
                    <label htmlFor="name">{`이름편집 >>`}</label>
                    <input 
                        type="text"
                        name="name"
                        id="name"
                        onChange={ handleName }
                        value={ name }
                        placeholder="사용할 이름을 입력해주십시오."
                        className="form__input"
                    />
                </div>
                <input type="submit" value="회원정보 편집"/>
            </form>
        </div>
    )
}