import Heart from "mdi-react/HeartIcon";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";
import { Col, Row } from "reactstrap";

const dl = `${process.env.PUBLIC_URL}/img/images/DL.png`;

class Footer extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    let { pathname } = props.location;
    this.state = {
      padding: pathname === "/" || pathname === "/accueil" ? false : true,
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.location &&
      nextProps.location.pathname &&
      (nextProps.location.pathname === "/" ||
        nextProps.location.pathname === "/accueil")
    )
      this.setState({ padding: false });
    else this.setState({ padding: true });
  }
  render() {
    return (
      <div className="Footer" style={{ paddingLeft: "5%" }}>
        <Row className="Footer-row">
          <Col
            xs={12}
            md={3}
            lg={3}
            xl={3}
            className="Footer-col__left"
            style={{ display: "flex", flexDirection: "column" }}>
            <img src={dl} className="Footer-logo" />

            <div />
          </Col>

          <Col xs={12} md={6} lg={6} xl={6} className="Footer-col__middle" />
          <Col xs={12} md={3} lg={3} xl={3} className="Footer-col__right">
            <span className="Footer-href__bottom2">
              Made with <Heart className="Footer-heart" /> by{" "}
              <a
                target="blank"
                href="https://toolynk.com"
                className="Footer-href__bottom">
                TOOLYNK
              </a>
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(Footer);
