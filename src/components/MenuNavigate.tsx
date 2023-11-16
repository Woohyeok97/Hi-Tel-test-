import AuthContext from "context/AuthContext"
import { CommandActionType } from "interface"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

// type InstructionType = 'A' | 'a' | 'B' | 'b' | 'C' | 'c'
const INITIALMESSAGE = '명령어 입력 또는 마우스클릭'

export default function MenuNavigate() {
    const { user } = useContext(AuthContext)
    const [ command, setCommand ] = useState<string>('')
    const [ terminalMessage, setTerminalMessage ] = useState<string>(INITIALMESSAGE)
    const navigate = useNavigate()

    // 명령어 입력 핸들러
    const handleInstruction = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setCommand(value.trim())
    }

    // 로그아웃 핸들러
    const handleLogout = async () => {
        const confirm = window.confirm('접속을 종료하시겠습니까?')
        if(confirm) {
            console.log('logout')
        }
    }
    const commandAction : CommandActionType = {
        'a' : () => navigate('/'),
        'b' : () => user?.uid ? navigate(`/my/${user?.uid}`) : '접속이후 이용해주십시오.',
        'c' : () => navigate('/search'),
        'd' : () => user?.uid ? handleLogout() : navigate('/users/login'),
    };
    
    // 페이지 이동 핸들러
    const handleKeyOn = (e : any) => {
        const ENTER_KEY_CODE = 13 // 엔터키 코드
        let message = INITIALMESSAGE

        if(command !== '' && e?.keyCode === ENTER_KEY_CODE) {
            // 간단한 대문자 or 소문자 비교를 위해 instruction을 소문자로 변환후 비교
            const lowerCommand = command.toLocaleLowerCase()
            const action = commandAction[lowerCommand]
             // 액션의 반환값이 문자라면
            // if(action) {
            //     console.log('gd')
            // } else {

            // }
            // if(typeof(action()) === 'function') {
            //     console.log('fun')
            // }
            
            

            setTerminalMessage(message)
            setCommand('')
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
                    value={ command }
                    onChange={ handleInstruction }
                    onKeyUp={ handleKeyOn }
                    placeholder={ terminalMessage }
                    className="menu-navigate__terminal"
                />
            </div>
        </div>
    )
}