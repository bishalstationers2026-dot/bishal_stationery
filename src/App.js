import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {

const { user } = useAuth();

if(!user){
return <Login/>
}

return <Dashboard/>

}

export default App;