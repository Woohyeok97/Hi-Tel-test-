import styles from './NotiItem.module.scss'
import { useNavigate } from "react-router-dom"
// 데이터 타입
import { NotificationType } from "interface"
import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'firebaseApp'


interface NotiItemProps {
    notification : NotificationType
}

export default function NotiItem({ notification } : NotiItemProps) {
    const navigate = useNavigate()

    // 알림클릭 핸들러
    const handleClick = async () => {
        if(!notification?.isRead) {
            try {
                const notiRef = doc(db, 'notifications', notification?.id)
                await updateDoc(notiRef, {
                    isRead : true,
                })
                if(notification?.url) navigate(notification?.url)
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    return (
        <div className={`${notification?.isRead ? styles.read : styles.notiItem}`} onClick={ handleClick }>
            <div>
                <div className={ styles.notiItem__content }>{ notification?.content }</div>
                <div className={ styles.notiItem__createdAt }>{ notification?.createdAt }</div>
            </div>
        </div>
    )
}