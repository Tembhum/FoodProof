import React, { useState } from "react";
import { Form, Input, Button, Divider, Card, Row, Col } from "antd";
import Navbar from "../components/Navbar";
import abis from "../abi/abis";
import addresses from "../abi/addresses";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";
import { useParams } from "react-router";
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

const Transfer = (props) => {
  const [form] = Form.useForm();
  let {id} = useParams();

  

  const [product, setProduct] = useState({
    id: id
  });

  const [hash, setHash] = useState("");
  const [fileUrl, updateFileUrl] = useState(``);

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
    

    transferOwner(
      product.id,
      values.newOwner,
      hash
    );
  }

  function transferOwner(id, newOwner, photoHash) {
    console.log('photoHash: ', photoHash);
    console.log('newOwner: ', newOwner);
    console.log('id: ', id);
  
    productContract.methods
      .transferOwner(id, newOwner, photoHash)
      .send({ from: myAccount })
      .then(console.log);
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      updateFileUrl(url);
      setHash(added.path);
      console.log(added.path);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <>
      <Navbar />
      <Card className="page-card">
        <div className="container">
          <h2> id: {product.id}</h2>
          <Form form={form} {...defaultFormItemLayout} onFinish={handleFinish}>
            <Form.Item
              name="newOwner"
              label="New Owner Address"
              rules={[{ required: true }]}
            >
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
                Transfer Owner
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </>
  );
};

export default Transfer;
