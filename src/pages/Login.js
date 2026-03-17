import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login(){

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const login = async()=>{

try{

await signInWithEmailAndPassword(auth,email,password);

}catch(err){

alert("Login failed");

}

};

return(

<div style={{padding:"40px"}}>

<h2>Bishal Stationery Login</h2>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<br/><br/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<br/><br/>

<button onClick={login}>
Login
</button>

</div>

);

}