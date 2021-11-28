import React, { useState, useEffect } from "react";
import { Form, Input, Button, Divider, Card, Row, Col } from "antd";
import Navbar from "../components/Navbar";
import abis from "../abi/abis";
import addresses from "../abi/addresses";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";
import { create } from "ipfs-http-client";
import { useParams } from "react-router-dom";
const client = create("https://ipfs.infura.io:5001/api/v0");

const ProductDetail = (props) => {
  // let id ="test01"
  let { id } = useParams();
  console.log("param", id);
  const [fileUrl, updateFileUrl] = useState(``);
  // let mockPhotoHash = [
  //   "QmY6jTwkBWstSC8DAgfk6QNKwhwNh8XvWXgLLSfdcmmisK",
  //   "QmWdBALxW7YN7CEwDCqZy2Zqpk1LLTdK1qQHX5zHxjsSjV",
  //   "QmbSdrXucAyXoq4Z8Db6xdi1LwmfiEC5sdguKEVNgsAiDZ",
  // ];

  const [product, setProduct] = useState({
    id: "",
    name: "",
    companycode: "",
    origin: "",
    currentOwner: "",
    previousOwner: "",
    currentPrice: 0,
    photo: [],
    status: "",
  });

  const accounts = window.ethereum.request({ method: "eth_requestAccounts" });
  const { myAccount, balance } = useAccount();
  console.log("myAccount: ", myAccount);

  const producerContract = useContract(addresses.producer, abis.producer);
  const productContract = useContract(
    addresses.productManager,
    abis.productManager
  );

  async function connectToMetamask() {
    console.log("Connect to metamask!");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(url);
      console.log(added.path);
      addPhoto(id, added.path);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  function addPhoto(id, hash) {
    productContract.methods
      .addPhoto(id, hash)
      .send({ from: myAccount })
      .then(console.log);
  }

  function getProductDetail(id) {
    productContract.methods
      .getProductById(id)
      .call()
      .then((res) => {
        console.log(res);
        setProduct({
          id: id,
          name: res.name,
          companycode: res.companycode,
          origin: res.origin,
          currentOwner: res.currentOwner,
          previousOwner: res.previousOwner,
          currentPrice: res.price,
          photo: res.oldOwnerPhoto,
          status: res.productStatus,
        });
      });
  }

  useEffect(() => {
    // Update the document title using the browser API
    getProductDetail(id);
  }, []);

  return (
    <>
      {console.log(product)}
      <Navbar />
      <Card className="page-card">
        <div className="container">
          <h2> id: {product.id}</h2>
          <h2> Name: {product.name}</h2>
          <h2> Company code: {product.companycode}</h2>
          <h2> Producer Address: {product.origin}</h2>
          <h2> Current Owner Address: {product.currentOwner}</h2>
          <h2> Previous Owner Address: {product.previousOwner}</h2>
          <h2> Status: {product.status}</h2>
          {/* <h2> PhotoHash: {product.photo&&product.photo.map((url)=>{return <img src={`https://ipfs.infura.io/ipfs/${url}`}/>})}</h2> */}
          <h2>
            {" "}
            Photo:{" "}
            {product.photo.map((url) => {
              return (
                <img
                  style={{ margin: "10px" }}
                  width={120}
                  height={120}
                  src={`https://ipfs.infura.io/ipfs/${url}`}
                />
              );
            })}
          </h2>
          <br></br>
          <br></br>
          <h3>Add photo</h3>
          <input type="file" onChange={onChange} />
          {fileUrl && <img src={fileUrl} width="600px" />}
        </div>
      </Card>
    </>
  );
};

export default ProductDetail;
