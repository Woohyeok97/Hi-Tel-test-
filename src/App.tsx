import { useState } from "react";
// components
import Router from "Router";



function App() {
    const [ isAuthenticated, setIsAuthenticated ] = useState<boolean>(true)

    return (
            <Router isAuthenticated={ isAuthenticated }/>
    );
}

export default App;
