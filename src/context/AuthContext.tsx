import { ReactNode, createContext, useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";


const AuthContext = createContext({
    user : null as User | null,
    init : false,
})

interface AuthContextProviderProps {
    children : ReactNode,
}
export function AuthContextProvider({ children } : AuthContextProviderProps ) {
    const [ currentUser, setCurrentUser ] = useState<User | null>(null)
    const [ init, setInit ] = useState<boolean>(false)
    const auth = getAuth(app)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setCurrentUser(user)
            } else {
                setCurrentUser(null)
            }
            setInit(true)
        })

    }, [auth])

    return (
        <AuthContext.Provider value={{ user : currentUser, init : init }}>
            { children }
        </AuthContext.Provider>
    )
}


export default AuthContext;