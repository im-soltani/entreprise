import React from "react";
import MySharedCVComponent from "./components/MySharedCVComponent";
import { Container, Row } from "reactstrap";

class MySharedCV extends React.PureComponent {
  render() {
    return (
      <Container className="dashboard">
        <Row>
          <MySharedCVComponent />
        </Row>
      </Container>
    );
  }
}

export default MySharedCV;
