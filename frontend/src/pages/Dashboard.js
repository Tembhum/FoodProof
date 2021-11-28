import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Divider,
  Card,
  Row,
  Col,
  Table,
  Modal,
  Image,
} from "antd";
import Navbar from "../components/Navbar";
import abis from "../abi/abis";
import addresses from "../abi/addresses";
import useContract from "../hooks/useContract";
import useAccount from "../hooks/useAccount";
import { Navigate, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import metamask from "../images/meta.png";
import CreateProduct from "./CreateProduct";

const ButtonGroup = Button.Group;
const url = `https://ipfs.infura.io/ipfs/`;

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

//{Init, Shipped, Owned, Verifying, Destroyed}
const status = {
  Init: "0",
  Shipped: "1",
  Owned: "2",
  Verifying: "3",
  Destroyed: "4",
};
const Dashboard = () => {
  const [form] = Form.useForm();

  const [createProductButton, setCreateProductButton] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [list, setList] = useState([]);
  const [product, setProduct] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [currentId, setCurrentId] = useState("");
  const [currentImageTag, setCurrentImageTag] = useState("");

  const accounts =
    window.ethereum &&
    window.ethereum.request({ method: "eth_requestAccounts" });
  const { myAccount, balance } = useAccount();
  const producerContract = useContract(addresses.producer, abis.producer);
  const productContract = useContract(
    addresses.productManager,
    abis.productManager
  );

  const columns = [
    {
      title: "ID",
      key: "id",
      fixed: "left",
      render: (item) => <a href={`/productdetail/${item.id}`}>{item.id}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Producer",
      dataIndex: "producer",
      key: "producer",
    },
    {
      title: "Transfer Owner",
      key: "transfer_owner",
      render: (item) => (
        <Button
          style={{ background: "#7aafff", color: "white", fontWeight: "500" }}
          disabled={
            item.status === "Verifying" || item.status === "Shipped"
              ? true
              : false
          }
        >
          <a href={`/transfer/${item.id}`}> Transfer Owner </a>
        </Button>
      ),
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "isVerified",
      dataIndex: "verify",
      key: "verify",
    },
    {
      title: "comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Accept / Reject",
      key: "action",
      fixed: "right",
      render: (item) => (
        <div>
          {item.status !== status.Shipped ? ( // CHANGE TO === status.Shipped
            <Button onClick={() => handleClickModal(true, item.id, item.image)}>
              {" "}
              Action{" "}
            </Button>
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  const navigate = useNavigate();

  async function connectToMetamask() {
    console.log("Connect to metamask!");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
  }

  function accept(id, photoHash) {
    productContract.methods
      .receiveProduct(id, photoHash)
      .send({ from: myAccount })
      .then(console.log);
  }

  function reject(id, photoHash) {
    console.log(myAccount);
    productContract.methods
      .returnProduct(id)
      .send({ from: myAccount })
      .then(console.log);
  }

  function convertStatusNum(num) {
    switch (num) {
      case "0":
        return "Init";
      case "1":
        return "Shipped";

      case "2":
        return "Owned";
      case "3":
        return "Verifying";
      case "4":
        return "Destroyed";

      default:
        return "-";
    }
  }
  //submit
  function handleFinish(values) {
    console.log("Handle Finish");
    // productManager.methods.
  }

  useEffect(() => {
    if (myAccount) {
      getProductList(myAccount);
    }
  }, [myAccount]);

  useEffect(() => {
    console.log("list", list);
    setProductArray();
  }, [list]);

  async function getProductList(_address) {
    await productContract.methods
      .getProductList(_address)
      .call()
      .then(async (res) => {
        console.log(res);
        setList(res);
      });
  }

  async function setProductArray() {
    console.log("list", list);
    let temp = product;
    for (let x = 0; x < list.length; x++) {
      console.log("x: ", x);

      await productContract.methods
        .getProductById(list[x])
        .call()
        .then((res2) => {
          console.log("res2: ", res2);
          temp.push(res2);
          setProduct(temp);
        });
    }
    console.log("product ------- end: ", product);
    const tableData = [...dataSource];
    const formattedJsonArr = product.map((item, index) => {
      return {
        id: list[index],
        name: item.name,
        status: convertStatusNum(item.productStatus),
        producer: item.origin,
        image:
          item.oldOwnerPhoto.length > 0
            ? item.oldOwnerPhoto[item.oldOwnerPhoto.length - 1]
            : "",
        verify: item.verify ? "verified" : "not verified",
        comment: item.comment,
      };
    });
    console.log("table json ------- end: ", formattedJsonArr);
    setDataSource(formattedJsonArr);
  }

  if (createProductButton) {
    return <Navigate to="/newproduct"></Navigate>;
  }

  const handleClickModal = (value, id, image) => {
    setShowModal(value);
    setCurrentId(id);
    setCurrentImageTag(image);
  };

  function toVerify(_id) {
    productContract.methods.toVerify(_id).send({ from: myAccount });
  }
  return (
    <>
      <Navbar />
      <Card className="page-card">
        <Button
          onClick={() => navigate("/newproduct")}
          type="primary"
          htmlType="submit"
        >
          {" "}
          Create Product{" "}
        </Button>
        <div className="container">
          <Button
            style={{
              background: "#f0c400",
              color: "white",
              fontWeight: "500",
              fontSize: "15px",
            }}
            onClick={connectToMetamask}
            type="warning"
            htmlType="submit"
          >
            <img width={21} height={21} src={metamask} alt={metamask} />{" "}
            Metamask
          </Button>
        </div>
        <div style={{ marginTop: "20px" }}>
          {console.log(dataSource)}
          <Table
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: "max-content" }}
          />
          ,
        </div>
      </Card>
      <Modal
        visible={showModal}
        closable={false}
        title="Confirm Transaction"
        footer={[
          <Button
            onClick={() => {
              accept(currentId, "");
            }}
            style={{
              background: "#a7db79",
              color: "white",
              fontWeight: "500",
            }}
            key="back"
          >
            Accept
          </Button>,
          <Button
            onClick={() => {
              reject(currentId, "");
            }}
            style={{
              background: "#fa6c61",
              color: "white",
              fontWeight: "500",
            }}
            key="submit"
            type="primary"
          >
            Reject
          </Button>,
          <Button onClick={() => setShowModal(false)} key="submit" type="light">
            Cancel
          </Button>,
        ]}
      >
        <Image src={url + currentImageTag} />
        <Button onClick={() => {toVerify(currentId)}} type="primary">
          Verify
        </Button>
      </Modal>
    </>
  );
};

export default Dashboard;
