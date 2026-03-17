import { useEffect, useState } from "react";
import { db } from "../firebase";

import jsPDF from "jspdf";

import {
collection,
getDocs,
doc,
updateDoc,
addDoc
} from "firebase/firestore";

export default function Sell(){

const [products,setProducts] = useState([]);
const [cart,setCart] = useState([]);
const [customer,setCustomer] = useState("");
const [phone,setPhone] = useState("");
const [showCart,setShowCart] = useState(false);

const productsRef = collection(db,"products");

const [search,setSearch] = useState("");

// LOAD PRODUCTS
useEffect(() => {
loadProducts();
}, []);

const loadProducts = async()=>{
const data = await getDocs(productsRef);

setProducts(
data.docs.map(doc=>({
...doc.data(),
id:doc.id
}))
);
};

// ADD TO CART
const addToCart = (product)=>{
const existing = cart.find(p=>p.id === product.id);

if(existing){
setCart(
cart.map(p =>
p.id === product.id
? {...p, qty:p.qty+1}
: p
)
);
}else{
setCart([...cart,{...product,qty:1}]);
}
};

// DECREASE QTY
const decreaseQty = (id)=>{
setCart(
cart
.map(item =>
item.id === id
? {...item, qty:item.qty-1}
: item
)
.filter(item => item.qty > 0)
);
};

// TOTAL
const total = cart.reduce(
(sum,item)=>sum + item.price * item.qty,
0
);

// WHATSAPP BILL
const sendWhatsAppBill = (order) => {

let message = `🧾 *Bishal Stationery*\n\n`;

message += `Invoice: ${order.invoiceNumber}\n`;
message += `Customer: ${order.customer}\n\n`;

message += `Items:\n`;

order.items.forEach(item => {
message += `${item.name} x ${item.qty} = ₹${item.price * item.qty}\n`;
});

message += `\n-------------------\n`;
message += `Total: ₹${order.total}\n`;
message += `-------------------\n`;

message += `Thank you for shopping 🙏`;

const phone = "91" + order.phone;

const url =
"https://wa.me/" +
phone +
"?text=" +
encodeURIComponent(message);

window.open(url, "_blank");

};

// invoice pdf  
const generateInvoicePDF = (order) => {

const doc = new jsPDF();

doc.setFontSize(16);
doc.text("Bishal Stationery", 20, 20);

doc.setFontSize(10);
doc.text(`Invoice: ${order.invoiceNumber}`, 20, 30);
doc.text(`Customer: ${order.customer}`, 20, 36);
doc.text(`Phone: ${order.phone}`, 20, 42);

doc.text("Items:", 20, 52);

let y = 60;

order.items.forEach(item => {
doc.text(
`${item.name} x ${item.qty} = Rs ${item.price * item.qty}`,
20,
y
);
y += 6;
});

doc.text("---------------------------", 20, y);
y += 6;

doc.text(`Total: Rs ${order.total}`, 20, y);

doc.text("Thank you for shopping!", 20, y + 10);

// SAVE PDF
doc.save(`${order.invoiceNumber}.pdf`);
};

// CHECKOUT
const checkout = async()=>{

if(cart.length===0){
alert("Cart empty");
return;
}

const invoiceNumber = "INV-" + Date.now();

const order = {
invoiceNumber,
customer,
phone,
items:cart,
total,
date:new Date()
};

// SAVE TO FIREBASE
await addDoc(collection(db,"orders"),order);

// UPDATE STOCK
for(const item of cart){
await updateDoc(doc(db,"products",item.id),{
stock:item.stock-item.qty
});
}

// ✅ GENERATE PDF
generateInvoicePDF(order);

// ✅ SEND WHATSAPP
sendWhatsAppBill(order);

// RESET
setCart([]);
setCustomer("");
setPhone("");

alert("Invoice Created: " + invoiceNumber);

loadProducts();
};

// UI
return (

<div style={{padding:"15px"}}>

<h2>🛒 Sell Products</h2>

{/* PRODUCT GRID */}
<input
placeholder="🔍 Search product..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
width:"100%",
padding:"12px",
marginBottom:"15px",
borderRadius:"8px",
border:"1px solid #ccc",
fontSize:"14px"
}}
/>
<div 
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",
gap:"15px"
}}>



{products
.filter(p =>
p.name?.toLowerCase().includes(search.toLowerCase())
)
.map(p => (

<div key={p.id} style={{
border:"1px solid #ddd",
borderRadius:"10px",
padding:"10px",
textAlign:"center",
background:"#fff",
boxShadow:"0 2px 5px rgba(0,0,0,0.1)"
}}>

{/* IMAGE */}
{p.image ? (
<img
src={p.image}
alt={p.name}
style={{
width:"100%",
height:"100px",
objectFit:"cover",
borderRadius:"8px"
}}
/>
) : (
<div style={{
height:"100px",
background:"#eee",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}>
No Image
</div>
)}

{/* INFO */}
<h4>{p.name}</h4>
<p>₹{p.price}</p>

{/* BUTTON */}
<button
onClick={()=>addToCart(p)}
style={{
background:"#007bff",
color:"#fff",
border:"none",
padding:"8px",
borderRadius:"5px",
width:"100%"
}}
>
Add
</button>

</div>

))}

</div>

{/* FLOATING CART */}
{cart.length > 0 && (

<div
onClick={()=>setShowCart(true)}
style={{
position:"fixed",
bottom:"0",
left:"0",
right:"0",
background:"#000",
color:"#fff",
padding:"15px",
display:"flex",
justifyContent:"space-between",
cursor:"pointer"
}}
>

<div>🛒 {cart.length} items</div>
<div>₹{total}</div>
<div>View Cart →</div>

</div>

)}

{/* FULL SCREEN CART */}
{showCart && (

<div style={{
position:"fixed",
top:"0",
left:"0",
right:"0",
bottom:"0",
background:"#fff",
zIndex:"999",
padding:"20px",
overflow:"auto"
}}>

<h2>🧾 Your Cart</h2>

<button onClick={()=>setShowCart(false)}>
⬅ Back
</button>

<hr/>

{cart.map(item => (

<div key={item.id} style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"10px"
}}>

<div>
{item.name}
</div>

<div>

<button onClick={()=>decreaseQty(item.id)}>-</button>

<span style={{margin:"0 10px"}}>
{item.qty}
</span>

<button onClick={()=>addToCart(item)}>+</button>

</div>

<div>
₹{item.price * item.qty}
</div>

</div>

))}

<hr/>

<h3>Total: ₹{total}</h3>

{/* CUSTOMER INFO */}
<input
placeholder="Customer Name"
value={customer}
onChange={(e)=>setCustomer(e.target.value)}
style={{width:"100%",marginBottom:"10px"}}
/>

<input
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
style={{width:"100%",marginBottom:"10px"}}
/>

<button
onClick={checkout}
style={{
background:"green",
color:"white",
padding:"12px",
width:"100%",
border:"none",
borderRadius:"6px"
}}
>
Complete Order
</button>

</div>

)}

</div>

);

}