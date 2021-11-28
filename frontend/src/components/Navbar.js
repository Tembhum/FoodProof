import React from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";

//navigation bar
export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card className="nav-card">
        <nav>
          <li className="link-list">
            <Link to="/">Home</Link>
            <br></br>
            <Link to="/newproduct">Create New Product</Link>
            <br></br>
            <Link to="/registerproducer">Register New Producer</Link>
            <br></br>
            <Link to="/verifier">Verifier</Link>
          </li>
        </nav>
      </Card>
    );
  }
}
