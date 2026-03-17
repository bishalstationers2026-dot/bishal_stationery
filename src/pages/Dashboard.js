import { useState } from "react";
import Products from "./Products";
import Sell from "./Sell";
import Orders from "./Orders";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard(){

const [page,setPage] = useState("products");

return(

<div style={{padding:"20px"}}>

<h1>Bishal Stationery POS</h1>

<button onClick={()=>signOut(auth)}>Logout</button>

<hr/>

<button onClick={()=>setPage("products")}>Products</button>
<button onClick={()=>setPage("sell")}>Sell</button>
<button onClick={()=>setPage("orders")}>Orders</button>

<hr/>

{page==="products" && <Products/>}
{page==="sell" && <Sell/>}
{page==="orders" && <Orders/>}

</div>

)

}