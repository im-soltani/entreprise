import React from "react";
import MyCVComponent from "./components/MyCVComponent";
import { Container, Row } from "reactstrap";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class MyCV extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.match.params.type ? props.match.params.type : "deposes"
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.type !== this.state.type)
      this.setState({
        type: nextProps.match.params.type
      });
  }
  render() {
    const { type } = this.state;
    return (
      <Container className="dashboard">
        <Row>
          <MyCVComponent type={type} />
        </Row>
      </Container>
    );
  }
}

export default withRouter(MyCV);
