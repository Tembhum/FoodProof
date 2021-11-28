import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import Producer from "./pages/Producer";
import Dashboard from "./pages/Dashboard";
import CreateProduct from "./pages/CreateProduct";
import  Ipfs from "./pages/Ipfs";
import Transfer from "./pages/Transfer";
import ProductDetail from "./pages/ProductDetail";
import RegisterProducer from "./pages/RegisterProducer"
import Verifier from "./pages/Verifier";


import abis from "./abi/abis";
import addresses from "./abi/addresses";
import useContract from "./hooks/useContract";
import useAccount from "./hooks/useAccount";
import useProvider from "./hooks/useProvider";




function App() {
  let {id} = useParams();

  return (
    <Router>
      <div className="container">
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/producer" element={<Producer />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/newproduct" element={<CreateProduct />} />
          <Route path="/ipfs" element={<Ipfs />} />
          <Route path="/transfer/:id" element={<Transfer />} />
          <Route path="/productdetail/:id" element={<ProductDetail />} />
          <Route path="registerproducer" element={<RegisterProducer />} />
          <Route path="verifier" element={<Verifier />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
