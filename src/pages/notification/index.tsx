import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { db } from "firebaseApp"
// components
import NotiItem from "components/notification/NotiItem"
// 데이터 타입
import { NotificationType } from "interface"


export default function NotifiCationPage() {
    const { user } = useContext(AuthContext)
    const [ notiList, setNotiList ] = useState<NotificationType[]>([])

    // 알림 가져오기
    const fetchNotiList = useCallback(() => {
        if(user?.uid) {
            const notiRef = collection(db, 'notifications')
            const notiQuery = query(notiRef, where('uid', '==', user?.uid), orderBy('createdAt', 'desc'))

            onSnapshot(notiQuery, (snapshot) => {
                const result = snapshot?.docs?.map((item) => ({ id : item?.id, ...item?.data() }))
                setNotiList(result as NotificationType[])
            })
        }
    }, [user?.uid])

    // 알림요청
    useEffect(() => {
        if(user?.uid) fetchNotiList()
    }, [fetchNotiList, user?.uid])

    console.log(notiList)


    return (
        <div className="page">
            <div className="page__header">나의 알림</div>
            {/* <div>
                <div className=""></div>
                <div className=""></div>
                <div className=""></div>
            </div> */}
            <div>
            { notiList?.map((item) => <NotiItem key={item?.id} notification={ item }/>) || <div>없음</div>}
            </div>
        </div>
    )
}