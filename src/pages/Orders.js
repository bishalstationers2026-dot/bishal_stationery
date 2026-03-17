import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";

export default function Orders(){

const [orders,setOrders] = useState([]);
const [search,setSearch] = useState("");

useEffect(()=>{

const loadOrders = async()=>{

const data = await getDocs(collection(db,"orders"));

setOrders(
data.docs.map(doc=>({
...doc.data(),
id:doc.id
}))
);

};

loadOrders();

},[]);

const filteredOrders = orders.filter(o =>
o.customer?.toLowerCase().includes(search.toLowerCase())
);

const today = new Date().toDateString();

const todaySales = orders
.filter(o => o.date && new Date(o.date.seconds * 1000).toDateString() === today)
.reduce((sum,o)=> sum + o.total,0);


const printInvoice = (order) => {

const doc = new jsPDF();

doc.text("Bishal Stationery", 20, 20);
doc.text(`Invoice: ${order.invoiceNumber}`, 20, 30);
doc.text(`Customer: ${order.customer}`, 20, 40);

let y = 50;

order.items.forEach(item => {
doc.text(
`${item.name} x ${item.qty} = Rs ${item.price * item.qty}`,
20,
y
);
y += 6;
});

doc.text(`Total: Rs ${order.total}`, 20, y + 10);

doc.save(`${order.invoiceNumber}.pdf`);

};

return(

<div style={{padding:"20px"}}>

<h2>Orders History</h2>

<h3>Today's Sales: ₹{todaySales}</h3>

<input
placeholder="Search customer"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<hr/>

{filteredOrders.map(order=>(

<div
key={order.id}
style={{
border:"1px solid #ccc",
padding:"10px",
marginBottom:"10px"
}}
>

<b>{order.customer}</b>

<div>Phone: {order.phone}</div>

<div>Total: ₹{order.total}</div>

<div>
Date:
{
order.date
? new Date(order.date.seconds*1000).toLocaleString()
: "No date"
}
</div>
<div>Invoice: {order.invoiceNumber}  <button onClick={()=>printInvoice(order)}>
Download Invoice
</button></div>


<h4>Items</h4>

{order.items?.map((item,i)=>(

<div key={i}>
{item.name} x {item.qty}
</div>


)
)}

</div>

))}

</div>

);

}