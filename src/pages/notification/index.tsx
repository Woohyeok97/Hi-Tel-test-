import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import NotiItem from "components/notification/NotiItem"
// components


export default function NotifiCationPage() {
    const { user } = useContext(AuthContext)
    const [ notiList, setNotiList ] = useState([])

    // 알림 가져오기
    const fetchNotiList = useCallback(() => {
        if(user?.uid) {
            console.log('noti!!')
        }
    }, [user?.uid])

    // 알림요청
    useEffect(() => {
        if(user?.uid) fetchNotiList()
    }, [fetchNotiList, user?.uid])


    return (
        <div className="page">
            <div className="page__header">나의 알림</div>
            <div>
            { notiList?.map((item, i) => <NotiItem key={i} notification={'noti~'}/>) }
            </div>
        </div>
    )
}