import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Divider, Card, Row, Col } from "antd";
import Navbar from "../components/Navbar";
import abis from "../abi/abis";
import addresses from "../abi/addresses";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";
import useDidMountEffect from "../hooks/useDidMountEffect";
import { create } from "ipfs-http-client";


const client = create("https://ipfs.infura.io:5001/api/v0");


const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const defaultFormItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 12 },
  },
};

const CreateProduct = () => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState({
    id: "",
    companycode: "",
    name: "",
    price: 0,
    photohash: "",
  });

  const [fileUrl, updateFileUrl] = useState(``);
  const [hash, setHash] = useState("");

  const accounts = window.ethereum.request({ method: "eth_requestAccounts" });
  const { myAccount, balance } = useAccount();
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

  //submit
  async function handleFinish(values) {
    console.log(values);
    await setProduct({
      id: values.id,
      companycode: values.companycode,
      name: values.name,
      price: values.price,
      photohash: values.photohash,
    });

  }

    async function onChange(e) {
      const file = e.target.files[0];
      try {
        const added = await client.add(file);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        updateFileUrl(url);
        console.log(added.path);
        console.log(product.id);
        setHash(added.path);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }

    // function addPhoto(id, hash) {
    //   productContract.methods
    //     .addPhoto(id, hash)
    //     .send({ from: myAccount })
    //     .then(console.log);
    // }


    // createProduct(
    //   product.id,
    //   product.companycode,
    //   product.name,
    //   product.price,
    //   product.photohash
    // );
  

  // useEffect(() => {
  //   // Update the document title using the browser API

  //   if (firstUpdate.current) {
  //     firstUpdate.current = false;
  //     return;
  //   }
  //   else{
  //     createProduct(
  //       product.id,
  //       product.companycode,
  //       product.name,
  //       product.price,
  //       product.photohash
  //     );
  //   }
    
  // }, [handleFinish]);

  useDidMountEffect(() => {
    // react please run me if 'key' changes, but not on initial render
    createProduct(
        product.id,
        product.companycode,
        product.name,
        product.price,
        hash
      );
  }, [product]); 


  function createProduct(id, companycode, name, price, photohash) {
    console.log("myAccount: ", myAccount);
    console.log("id: ", id);
    console.log("companycode: ", companycode);
    console.log("name: ", name);
    console.log("price: ", price);
    console.log("photohash: ", photohash);



    productContract.methods
      .createProduct(id, companycode, name, price, photohash)
      .send({ from: myAccount })
      .then(console.log);
  }

  useEffect(() => {
    // Update the document title using the browser API
    connectToMetamask();
  }, []);



  return (
    <>
      <Navbar />
      <Card className="page-card">
        <div className="container">
          <Form form={form} {...defaultFormItemLayout} onFinish={handleFinish}>
            <Form.Item
              name="id"
              label="Product ID"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="companycode"
              label="Company Code"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="photo" label="Photo">
              <Input type="file" onChange={onChange} />
            </Form.Item>
            {fileUrl && (
              <img
                src={fileUrl}
                style={{ margin: "10px" }}
                width={120}
                height={120}
              />
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Product
              </Button>
            </Form.Item>
          </Form>

          {/* <Button onClick={connectToMetamask} type="primary" htmlType="submit">
            Metamsk
          </Button> */}
        </div>
      </Card>
    </>
  );
  };

export default CreateProduct;
