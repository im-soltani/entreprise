import React from "react";
import PropTypes from "prop-types";
import { Row } from "reactstrap";
import Parser from "html-react-parser";
class RGPDComponent extends React.PureComponent {
  static propTypes = {
    rgpd: PropTypes.string
  };

  render() {
    const { rgpd } = this.props;
    return (
      <div>
        <Row style={{ padding: "0rem 2rem" }}>
          <div>{Parser(rgpd)}</div>
        </Row>
      </div>
    );
  }
}

export default RGPDComponent;
