import { createContext,useContext,useEffect,useState } from "react";
import { auth,db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc,getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({children})=>{

const [user,setUser] = useState(null);
const [role,setRole] = useState(null);

useEffect(()=>{

const unsub = onAuthStateChanged(auth, async (u)=>{

if(u){

setUser(u);

const ref = doc(db,"users",u.uid);
const snap = await getDoc(ref);

if(snap.exists()){
setRole(snap.data().role);
}else{
setRole("staff");
}

}else{

setUser(null);
setRole(null);

}

});

return ()=>unsub();

},[]);

return(
<AuthContext.Provider value={{user,role}}>
{children}
</AuthContext.Provider>
);

};

export const useAuth = ()=>useContext(AuthContext);