import { useContext, useState } from "react";
import AuthContext from "context/AuthContext";
// components
import Router from "Router";
import Layout from "components/layout/Layout";


function App() {
    const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(true)
    const { user, init } = useContext(AuthContext)

    return (
        <Layout>
        { init ? <Router isAuthenticated={ !!user }/> : "잠시만 기다려 주십시오." }
        </Layout>
    );
}

export default App;
