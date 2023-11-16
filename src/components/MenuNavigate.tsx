import AuthContext from "context/AuthContext"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

// type InstructionType = 'A' | 'a' | 'B' | 'b' | 'C' | 'c'
const INITIALMESSAGE = '명령어 입력 또는 마우스클릭'

export default function MenuNavigate() {
    const { user } = useContext(AuthContext)
    const [ instruction, setInstruction ] = useState<string>('')
    const [ terminalMessage, setTerminalMessage ] = useState<string>(INITIALMESSAGE)
    const navigate = useNavigate()

    // 명령어 입력 핸들러
    const handleInstruction = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setInstruction(value.trim())
    }

    // 로그아웃 핸들러
    const handleLogout = async () => {
        const confirm = window.confirm('접속을 종료하시겠습니까?')
        if(confirm) {
            console.log('logout')
        }
    }

    // 페이지 이동 핸들러
    const handleKeyOn = (e : any) => {
        // instruction이 존재하고 키코드가 13일때(엔터키)
        if(instruction !== '' && e?.keyCode === 13) {
            // 간단한 대문자 or 소문자 비교를 위해 instruction을 소문자로 변환후 비교
            const lowerIntruction = instruction.toLocaleLowerCase()
            let message = INITIALMESSAGE

            if(lowerIntruction === 'a') {
                navigate('/')
            } else if(lowerIntruction === 'b') {
                if(!user?.uid) {
                    message = '접속이후 이용해주십시오.'
                } else {
                    navigate(`/my/${user?.uid}`)
                }
            } else if(lowerIntruction === 'c') {
                navigate('/search')
            } else if(lowerIntruction === 'd') {
                if(!user?.uid) {
                    navigate('/users/login')
                } else {
                    handleLogout()
                }
            } else {
                message = '올바른 명령어를 입력해주십시오.'
            }
            
            setTerminalMessage(message)
            setInstruction('')
        } 
    }

    
    return (
        <div className="menu-navigate">
            <div className="menu-navigate__flex">
                <div className="menu-navigate__menu" onClick={() => navigate('/') }>
                    초기화면(A)
                </div>
                <div className="menu-navigate__menu" 
                    onClick={() => user?.uid ? navigate(`/my/${user?.uid}`) : null }>
                    마이페이지(B)
                </div>
                <div className="menu-navigate__menu" onClick={() => navigate('/search') }>
                    검색(C)
                </div>

                {/* 로그인 여부에 따라 로그인/로그아웃 메뉴 렌더링 */}
                { user?.uid ? (
                    <div className="menu-navigate__menu" onClick={ handleLogout }>
                        접속종료(D)
                    </div>
                ) : (
                    <div className="menu-navigate__menu" onClick={() => navigate('/users/login') }>
                        접속(D)
                    </div>
                )}
            </div>

            {/* 명령어 인풋 */}
            <div className="menu-navigate__flex">
                <div>{'명령어 입력 >> '}</div>
                <input 
                    type="text"
                    value={ instruction }
                    onChange={ handleInstruction }
                    onKeyUp={ handleKeyOn }
                    placeholder={ terminalMessage }
                    className="menu-navigate__terminal"
                />
            </div>
        </div>
    )
}