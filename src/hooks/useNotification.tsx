import AuthContext from "context/AuthContext"
import { addDoc, collection } from "firebase/firestore"
import { db } from "firebaseApp"
import { useContext } from "react"

interface HookProps {
    targetUid : string,
}
export default function useNofitication({ targetUid } : HookProps) {
    const { user } = useContext(AuthContext)

    const createNotification = async (content : string, url? : string | null) => {
        try {
            const notiRef = collection(db, 'notifications')
            const intertNoti = {
                uid : targetUid,
                content : content,
                url : url,
                createdAt : new Date().toLocaleDateString("ko", {
                    hour : '2-digit',
                    minute : '2-digit',
                    second : '2-digit'
                }),
                isRead : false
            }
    
            await addDoc(notiRef, intertNoti)
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    return { createNotification }
}