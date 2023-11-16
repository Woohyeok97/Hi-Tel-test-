import styles from './FollowBtn.module.scss'
import { useCallback, useContext, useEffect, useState } from 'react'
import AuthContext from 'context/AuthContext'
import { arrayRemove, arrayUnion, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from 'firebaseApp'
// 데이터 타입
import { FollowType, PostType } from 'interface'

interface FollowBtnProps {
    post : PostType
}


export default function FollowBtn({ post } : FollowBtnProps) {
    const { user } = useContext(AuthContext)
    const [ isFollowing, setIsFollowing ] = useState(false)

    // 내가 팔로잉한 유저인지 확인로직
    const fetchFollowing = useCallback(async () => {
        if(user?.uid) {
            const followingRef = doc(db, 'following', user?.uid)
            
            onSnapshot(followingRef, (doc) => {
                const result = doc?.data()?.users?.map((item : FollowType) => item.uid)                
                setIsFollowing(result.includes(post?.uid))
            })
        }
    }, [user?.uid])

    // 팔로잉 핸들러
    const handleFollowing = async () => {
        if(!user?.uid) {
            console.log('접속이후 이용해주십시오.')
            return
        }
        if(user?.uid === post?.uid) {
            console.log('본인을 사랑하는 마음이 아름답습니다.')
            return
        }
        try {
            const followingRef = doc(db, 'following', user?.uid)
            const followerRef = doc(db, 'follower', post?.uid)

            await setDoc(followingRef, {
                users : arrayUnion({ uid : post?.uid })
            })
            await setDoc(followerRef, {
                users : arrayUnion({ uid : user?.uid })
            })
            console.log('팔로윙 하셨습니다.')  
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // 언팔 핸들러
    const handleUnFollow = async () => {
        if(!user?.uid) {
            console.log('접속이후 이용해주십시오.')
            return
        }
        if(user?.uid === post?.uid) {
            console.log('본인을 사랑하는 마음이 아름답습니다.')
            return
        }
        try {
            const followingRef = doc(db, 'following', user?.uid)
            const followerRef = doc(db, 'follower', post?.uid)

            await setDoc(followingRef, {
                users : arrayRemove({ uid : post?.uid })
            })
            await setDoc(followerRef, {
                users : arrayRemove({ uid : user?.uid })
            })
            console.log('팔로윙을 취소하셨습니다.')  
        } catch(err : any) {
            console.log(err?.code)
        }

    }

    useEffect(() => {
        if(user?.uid) fetchFollowing()
    }, [fetchFollowing, user?.uid])

    console.log(user?.uid)

    return (
        <> { user?.uid !== post?.uid && (isFollowing 
        ? <div className={ styles.followBtn } onClick={ handleUnFollow }>팔로우</div>    
        : <div className={ styles.followBtn } onClick={ handleFollowing }>팔로윙</div> ) } </>   
    )
}