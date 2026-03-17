import { Link } from "react-router-dom";

export default function Sidebar(){

return(

<div style={{
width:"200px",
background:"#222",
color:"white",
height:"100vh",
padding:"20px"
}}>

<h2>BSIMS</h2>

<Link to="/">Dashboard</Link>
<br/><br/>

<Link to="/products">Products</Link>
<br/><br/>

<Link to="/sell">Sell</Link>
<br/><br/>

<Link to="/orders">Orders</Link>

</div>

);

}