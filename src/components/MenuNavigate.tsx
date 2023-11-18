import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "context/AuthContext"
import { getAuth, signOut } from "firebase/auth"
import { app } from "firebaseApp"
// 데이터 타입
import { CommandActionType } from "interface"


const INITIALMESSAGE = '명령어 입력 또는 마우스클릭'

export default function MenuNavigate() {
    const { user } = useContext(AuthContext)
    const [ command, setCommand ] = useState<string>('')
    const [ terminalMessage, setTerminalMessage ] = useState<string>(INITIALMESSAGE)
    const navigate = useNavigate()


    // 로그아웃 핸들러
    const handleLogout = async () => {
        const confirm = window.confirm('접속을 종료하시겠습니까?')

        if(confirm) {
            const auth = getAuth(app)
            await signOut(auth)

            console.log('접속을 종료하셨습니다.')
        }
    }

    // 명령어 입력 핸들러
    const handleInstruction = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setCommand(value.trim())
    }

    // 명령어 액션객체
    const commandAction : CommandActionType = {
        'a' : () => navigate('/'),
        'b' : () => user?.uid ? navigate(`/profile/${user?.uid}`) : '접속이후 이용해주십시오.',
        'c' : () => navigate('/search'),
        'd' : () => user?.uid ? handleLogout() : navigate('/users/login'),
    };
    
    // 명령어 액션객체 실행 핸들러
    // * 추가로 명령어 클릭했을때도 적절하게 터미널메시지가 변경되면 좋을듯..
    const handleKeyOn = (e : any) => {
        const ENTER_KEY_CODE = 13 // 엔터키 코드
        let message = INITIALMESSAGE

        if(command !== '' && e?.keyCode === ENTER_KEY_CODE) {
            // 간단한 대문자 or 소문자 비교를 위해 instruction을 소문자로 변환후 비교
            const lowerCommand = command.toLocaleLowerCase()
            // lowerCommand가 commandAction객체에 있는 key라면
            if(lowerCommand in commandAction) {
                const action = commandAction[lowerCommand]
                const actionResult = action() // 여기서 명령어 액션실행

                // 만약 action()의 반환값이 문자열이라면 message에 할당
                if(typeof(actionResult) === 'string') {
                    message = actionResult
                }
            // commandAction객체에 없는 key를 입력했을경우
            } else {
                message = '올바른 명령어를 입력하십시오.'
            }

            // 명령어 액션실행 후  
            setCommand('')  
            setTerminalMessage(message)  
        } 
    }

    const [v, setV] = useState(true)

    return (
        <div className="menu-navigate" style={{ display : v ? 'block' : 'none' }}> 
            <button onClick={()=>{ setV((prev) => !prev) }}>View</button>
            <div className="menu-navigate__flex">
                <div className="menu-navigate__menu" onClick={()=>{ navigate('/') }}>
                    초기화면(A)
                </div>
                <div className="menu-navigate__menu" 
                    onClick={() => user?.uid ? navigate(`/profile/${user?.uid}`) : setTerminalMessage('접속이후 이용해주십시오.') }>
                    마이페이지(B)
                </div>
                <div className="menu-navigate__menu" onClick={() => navigate('/search') }>
                    검색(C)
                </div>

                {/* user?.uid에 따라 로그인/로그아웃 메뉴 렌더링 */}
                { user?.uid 
                ? <div className="menu-navigate__menu" onClick={ handleLogout }>접속종료(D)</div>
                : <div className="menu-navigate__menu" onClick={() => navigate('/users/login') }>접속(D)</div> }
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