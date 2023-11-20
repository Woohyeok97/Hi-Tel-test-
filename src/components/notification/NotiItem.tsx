// 데이터 타입
import { NotificationType } from "interface"

interface NotiItemProps {
    notification : NotificationType | any
}

export default function NotiItem({ notification } : NotiItemProps) {
    return (
        <div>Noti~~</div>
    )
}