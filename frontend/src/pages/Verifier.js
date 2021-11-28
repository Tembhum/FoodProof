import React, { useState } from "react";
import { Form, Input, Button, Divider, Card, Row, Col } from "antd";
import Navbar from "../components/Navbar";
import abis from "../abi/abis";
import addresses from "../abi/addresses";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";
import { useParams } from "react-router";

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

const Verifier = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [photoOld, setPhotoOld] = useState([]);
  const [photoNew, setPhotoNew] = useState([]);
  const [productId, setProductId] = useState("");
  const [verify, setVerify] = useState(false);

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
    console.log(myAccount);
    setProductId(values.id);
    await productContract.methods
      .getPhotoToVerify(values.id)
      .call({ from: myAccount })
      .then((res) => {
        setPhotoOld(res[0]);
        setPhotoNew(res[1]);
      });
  }

  function handleFinish2(values) {
    productContract.methods
      .verifyProduct(productId, verify, values.comment)
      .send({ from: myAccount })
      .then(console.log);
  }

  function approve(_comment) {
    productContract.methods
      .verifyProduct(productId, true, _comment)
      .send({ from: myAccount })
      .then(setVerify(true));
  }

  function reject(_comment) {
    productContract.methods
      .verifyProduct(productId, false, _comment)
      .send({ from: myAccount })
      .then(console.log);
  }

  return (
    <>
      <Navbar />
      <Card className="page-card">
        <div className="container">
          <Form form={form} {...defaultFormItemLayout} onFinish={handleFinish}>
            <Form.Item
              name="id"
              label="Product id"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Get photo to verify
              </Button>
            </Form.Item>
          </Form>
          <h2>
            {" "}
            Sender:{" "}
            {photoOld.map((url) => {
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
          <h2>
            {" "}
            Receiver:{" "}
            {photoNew.map((url) => {
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
        </div>

        <div>
          <Form form={form2} {...defaultFormItemLayout} onFinish={handleFinish2}>
            <Form.Item
              name="comment"
              label="Comment"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button onClick={approve} type="primary" htmlType="submit">
                {" "}
                Approve
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={reject} type="primary" htmlType="submit">
                {" "}
                Reject
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </>
  );
};

export default Verifier;
