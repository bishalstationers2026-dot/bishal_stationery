import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
} from "firebase/firestore";

import { useAuth } from "../context/AuthContext";

export default function Products(){

const { role } = useAuth();

const [products,setProducts] = useState([]);
const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [stock,setStock] = useState("");
const [image,setImage] = useState(null);

const [search,setSearch] = useState("");
const [editing,setEditing] = useState(null);
const [selectedProduct,setSelectedProduct] = useState(null);

const productsRef = collection(db,"products");

// LOAD PRODUCTS
useEffect(()=>{
loadProducts();
},[]);

const loadProducts = async()=>{
const data = await getDocs(productsRef);

setProducts(
data.docs.map(doc=>({
...doc.data(),
id:doc.id
}))
);
};

// CLOUDINARY UPLOAD
const uploadImage = async (image) => {

const formData = new FormData();
formData.append("file", image);
formData.append("upload_preset", "product_images");

const res = await fetch(
"https://api.cloudinary.com/v1_1/dk3wbwtfr/image/upload",
{
method: "POST",
body: formData
}
);

const data = await res.json();
return data.secure_url;
};

// ADD PRODUCT
const addProduct = async()=>{

if(role !== "owner"){
alert("Only owner can add");
return;
}

let imageUrl = "";

if(image){
imageUrl = await uploadImage(image);
}

await addDoc(productsRef,{
name,
price:Number(price),
stock:Number(stock),
image:imageUrl
});

setName("");
setPrice("");
setStock("");
setImage(null);

loadProducts();
};

// DELETE PRODUCT
const deleteProduct = async(id)=>{

if(role !== "owner"){
alert("Only owner can delete");
return;
}

await deleteDoc(doc(db,"products",id));
loadProducts();
};

// START EDIT
const startEdit = (p)=>{
setEditing(p.id);
setName(p.name);
setPrice(p.price);
setStock(p.stock);
};

// UPDATE PRODUCT
const updateProduct = async()=>{

if(role !== "owner"){
alert("Only owner can edit");
return;
}

let imageUrl = "";

if(image){
imageUrl = await uploadImage(image);
}

await updateDoc(doc(db,"products",editing),{
name,
price:Number(price),
stock:Number(stock),
...(imageUrl && {image:imageUrl})
});

setEditing(null);
setName("");
setPrice("");
setStock("");
setImage(null);

loadProducts();
};

// SEARCH FILTER
const filteredProducts = products.filter(p =>
p.name?.toLowerCase().includes(search.toLowerCase())
);

// UI
return(

<div style={{padding:"15px"}}>

<h2>📦 Products</h2>

{/* SEARCH */}
<input
placeholder="🔍 Search product..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
width:"100%",
padding:"10px",
marginBottom:"15px",
borderRadius:"8px",
border:"1px solid #ccc"
}}
/>

{/* ADD / EDIT FORM */}
{role === "owner" && (

<div style={{marginBottom:"20px"}}>

<input
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>

<input
placeholder="Stock"
value={stock}
onChange={(e)=>setStock(e.target.value)}
/>

<input
type="file"
onChange={(e)=>setImage(e.target.files[0])}
/>

<br/><br/>

{editing ? (
<button onClick={updateProduct}>
Update Product
</button>
) : (
<button onClick={addProduct}>
Add Product
</button>
)}

</div>

)}

{/* PRODUCT GRID */}
<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",
gap:"15px"
}}>

{filteredProducts.map(p => (

<div key={p.id} style={{
border:"1px solid #ddd",
borderRadius:"10px",
padding:"10px",
background:"#fff",
boxShadow:"0 2px 5px rgba(0,0,0,0.1)"
}}>

{/* IMAGE CLICK */}
{p.image ? (
<img
src={p.image}
alt={p.name}
onClick={()=>setSelectedProduct(p)}
style={{
width:"100%",
height:"100px",
objectFit:"cover",
borderRadius:"8px",
cursor:"pointer"
}}
/>
) : (
<div
onClick={()=>setSelectedProduct(p)}
style={{
height:"100px",
background:"#eee",
display:"flex",
alignItems:"center",
justifyContent:"center",
cursor:"pointer"
}}>
No Image
</div>
)}

{/* INFO */}
<h4>{p.name}</h4>
<p>₹{p.price}</p>

<p>
Stock: {p.stock}
{p.stock <= 5 && (
<span style={{color:"red",marginLeft:"5px"}}>
⚠
</span>
)}
</p>

{/* ACTIONS */}
{role === "owner" && (
<div style={{display:"flex",gap:"5px"}}>

<button onClick={()=>startEdit(p)}>
Edit
</button>

<button onClick={()=>deleteProduct(p.id)}>
Delete
</button>

</div>
)}

</div>

))}

</div>

{/* FULL SCREEN PRODUCT VIEW */}
{selectedProduct && (

<div style={{
position:"fixed",
top:"0",
left:"0",
right:"0",
bottom:"0",
background:"#fff",
zIndex:"9999",
padding:"20px",
overflow:"auto"
}}>

<button onClick={()=>setSelectedProduct(null)}>
⬅ Back
</button>

<hr/>

{/* BIG IMAGE */}
{selectedProduct.image && (
<img
src={selectedProduct.image}
alt={selectedProduct.name}
style={{
width:"100%",
maxHeight:"300px",
objectFit:"contain",
marginBottom:"20px"
}}
/>
)}

<h2>{selectedProduct.name}</h2>

<p>Price: ₹{selectedProduct.price}</p>

<p>
Stock: {selectedProduct.stock}
{selectedProduct.stock <= 5 && (
<span style={{color:"red",marginLeft:"10px"}}>
⚠ LOW STOCK
</span>
)}
</p>

{/* OWNER ACTIONS */}
{role === "owner" && (

<div style={{marginTop:"20px"}}>

<button onClick={()=>{
startEdit(selectedProduct);
setSelectedProduct(null);
}}>
Edit Product
</button>

<button
onClick={()=>{
deleteProduct(selectedProduct.id);
setSelectedProduct(null);
}}
style={{marginLeft:"10px"}}
>
Delete
</button>

</div>

)}

</div>

)}

</div>

);

}