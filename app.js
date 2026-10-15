const products = [
  {id:"ai",name:"AI Starter Kit",price:25,category:"Guides & eBooks",description:"A beginner-friendly guide to AI tools, useful prompts, and practical examples.",tags:["AI","Beginner","Guide"],art:"art-ai",title:"AI STARTER KIT",badge:"POPULAR"},
  {id:"study",name:"Student Success Pack",price:15,category:"Student Resources",description:"Study planner, revision schedule, and note-taking templates to help you stay organized.",tags:["Study","Productivity","Templates"],art:"art-study",title:"STUDENT SUCCESS"},
  {id:"creator",name:"Creator's Toolkit",price:30,category:"Creator Tools",description:"Content calendar, caption prompts, and video planning sheets for creators.",tags:["Social Media","Content","Templates"],art:"art-creator",title:"CREATOR'S TOOLKIT"},
  {id:"business",name:"Small Business Planner",price:25,category:"Business Templates",description:"Simple worksheets for planning goals, customers, and weekly business tasks.",tags:["Business","Planning"],art:"art-business",title:"BUSINESS PLANNER"},
  {id:"focus",name:"Productivity Reset",price:12,category:"Productivity",description:"A practical weekly planner and task-prioritization worksheet.",tags:["Focus","Planner"],art:"art-productivity",title:"PRODUCTIVITY RESET"},
  {id:"free",name:"Free Goal-Setting Sheet",price:0,category:"Guides & eBooks",description:"A one-page worksheet to help you choose a goal and plan your first steps.",tags:["Free","Starter"],art:"art-free",title:"GOAL SETTING"}
];
let cart = [];
let activeCategory = "All";
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const resultLabel = document.getElementById("resultLabel");
const toast = document.getElementById("toast");

function productArt(p){
  return `<div class="product-art ${p.art}"><div class="mock-doc"><strong>${p.title}</strong><div class="mock-lines"></div><div class="mock-lines"></div><div class="mock-lines short"></div><div class="mock-lines"></div><div class="mock-lines short"></div></div><div class="mock-doc second"><div class="mock-lines"></div><div class="mock-lines short"></div><div class="mock-lines"></div><div class="mock-lines"></div></div></div>`;
}
function renderProducts(){
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = products.filter(p => (activeCategory === "All" || p.category === activeCategory) && `${p.name} ${p.description} ${p.tags.join(" ")} ${p.category}`.toLowerCase().includes(query));
  productGrid.innerHTML = filtered.map(p => `<article class="product-card">${productArt(p)}<div class="product-body"><h3>${p.name}</h3><p>${p.description}</p><div class="tags">${p.tags.map(t=>`<span>${t}</span>`).join("")}</div><div class="product-bottom"><span class="price">${p.price===0?"Free":`₵${p.price}`}</span><button class="add-button" data-add="${p.id}">${p.price===0?"Get free resource":"＋ Add to cart"}</button></div></div></article>`).join("");
  resultLabel.textContent = `${filtered.length} product${filtered.length===1?"":"s"}`;
  emptyState.hidden = filtered.length !== 0;
}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2400)}
function updateCart(){
  document.getElementById("cartCount").textContent = cart.reduce((n,item)=>n+item.qty,0);
  document.getElementById("cartTotal").textContent = `₵${cart.reduce((n,item)=>n+item.price*item.qty,0)}`;
  const el=document.getElementById("cartItems");
  el.innerHTML=cart.length?cart.map(item=>`<div class="cart-item"><div><h4>${item.name}</h4><small>₵${item.price} × ${item.qty}</small></div><button class="remove-item" data-remove="${item.id}">Remove</button></div>`).join(""):'<p class="fine-print">Your cart is empty. Explore the products to add something useful.</p>';
}
productGrid.addEventListener("click",e=>{
  const btn=e.target.closest("[data-add]");if(!btn)return;
  const p=products.find(x=>x.id===btn.dataset.add);
  if(p.price===0){showToast("Free sample selected — connect a real file before launch.");return}
  const existing=cart.find(x=>x.id===p.id);if(existing)existing.qty++;else cart.push({...p,qty:1});
  updateCart();showToast(`${p.name} added to cart.`);
});
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();activeCategory="All";document.querySelectorAll(".category").forEach(b=>b.classList.remove("selected"));renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"});});
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.querySelectorAll(".category").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;document.querySelectorAll(".category").forEach(b=>b.classList.toggle("selected",b===btn));renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"});}));
const overlay=document.getElementById("cartOverlay");
document.getElementById("cartOpen").addEventListener("click",()=>{overlay.hidden=false;});
document.getElementById("cartClose").addEventListener("click",()=>overlay.hidden=true);
overlay.addEventListener("click",e=>{if(e.target===overlay)overlay.hidden=true;});
document.getElementById("cartItems").addEventListener("click",e=>{const btn=e.target.closest("[data-remove]");if(!btn)return;cart=cart.filter(x=>x.id!==btn.dataset.remove);updateCart();});
document.getElementById("checkoutButton").addEventListener("click",()=>showToast("Checkout isn't connected yet. We'll add payment after testing the store."));
document.getElementById("freeButton").addEventListener("click",()=>{activeCategory="All";document.getElementById("searchInput").value="free";renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"});});
document.getElementById("menuToggle").addEventListener("click",()=>{const nav=document.getElementById("nav");const isOpen=nav.classList.toggle("open");document.getElementById("menuToggle").setAttribute("aria-expanded",String(isOpen));});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();updateCart();
