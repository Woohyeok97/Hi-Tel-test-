import Layout from "components/layout/Layout";
import { useState } from "react";
// components
import Router from "Router";



function App() {
    const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(true)

    return (
        <Layout>
            <Router isAuthenticated={ isAuthenticated }/>
        </Layout>
    );
}

export default App;
