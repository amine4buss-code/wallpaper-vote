/* ===== Global Reset ===== */

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family:Arial, Helvetica, sans-serif;
  background:#0f0f0f;
  color:#ffffff;
  line-height:1.6;
}

/* ===== Navbar ===== */

header{
  background:#111;
  border-bottom:1px solid #222;
}

nav{
  max-width:1200px;
  margin:auto;
  display:flex;
  justify-content:center;
  gap:25px;
  padding:20px;
}

nav a{
  color:#ffffff;
  text-decoration:none;
  font-size:16px;
  transition:0.3s;
}

nav a:hover{
  color:#00d4ff;
}

/* ===== Hero Section ===== */

.hero{
  text-align:center;
  padding:80px 20px;
}

.hero h1{
  font-size:42px;
  margin-bottom:15px;
}

.hero p{
  font-size:18px;
  color:#aaa;
}

/* ===== Categories ===== */

.categories{
  max-width:1000px;
  margin:auto;
  padding:50px 20px;
  text-align:center;
}

.categories h2{
  margin-bottom:30px;
  font-size:28px;
}

.categories ul{
  list-style:none;
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
  gap:20px;
}

.categories a{
  display:block;
  background:#181818;
  padding:15px;
  border-radius:8px;
  text-decoration:none;
  color:white;
  transition:0.3s;
}

.categories a:hover{
  background:#00d4ff;
  color:black;
}

/* ===== Features Section ===== */

.features{
  max-width:1000px;
  margin:auto;
  padding:50px 20px;
}

.features h2{
  text-align:center;
  margin-bottom:20px;
}

.features ul{
  list-style:disc;
  padding-left:20px;
  color:#bbb;
}

/* ===== Footer ===== */

footer{
  margin-top:60px;
  background:#111;
  text-align:center;
  padding:30px;
  border-top:1px solid #222;
}

footer nav{
  margin-top:10px;
}

footer a{
  color:#aaa;
  text-decoration:none;
  margin:0 10px;
}

footer a:hover{
  color:#00d4ff;
}
