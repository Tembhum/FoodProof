import React, { useState } from "react";
import { Form, Input, Button, Divider, Card, Row, Col } from "antd";
import Navbar from "../components/Navbar";
import abis from "../abi/abis";
import addresses from "../abi/addresses";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";
import axios from "axios";

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

///////Register Producer start///////////
const RegisterProducer = () => {
  const [form] = Form.useForm();
  const [producer, setProducer] = useState({
    id: "",
    companycode: "",
    name: "",
  });

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
    await setProducer({
      id: values.id,
      companycode: values.companycode,
      name: values.companycode,
    });

    RegisterProducer(producer.id, producer.companycode, producer.name);
  }

  function RegisterProducer(_id, _companycode, _name) {
    axios.post(
      "https://ft7tus13s4.execute-api.ap-southeast-1.amazonaws.com/default/authenfunction",
      {id: _id, comapanycode: _companycode, name: _name}
    ).then(console.log);
  }

  
  return (
    <>
      <Navbar />
      <Card className="page-card">
        <div className="container">
          <Form form={form} {...defaultFormItemLayout} onFinish={handleFinish}>
            <Form.Item
              name="id"
              label="Producer ID"
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
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Register Producer
              </Button>
            </Form.Item>
          </Form>
          <Button onClick={connectToMetamask} type="primary" htmlType="submit">
            Metamsk
          </Button>
        </div>
      </Card>
    </>
  );
};

export default RegisterProducer;
