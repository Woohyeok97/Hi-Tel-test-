import { useContext } from "react";
import AuthContext from "context/AuthContext";
// components
import Router from "Router";
import Layout from "components/layout/Layout";


function App() {
    const { user, init } = useContext(AuthContext)

    return (
        <Layout>
        { init ? <Router isAuthenticated={ !!user }/> : "잠시만 기다려 주십시오." }
        </Layout>
    );
}

export default App;
