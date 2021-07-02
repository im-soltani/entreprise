import React from "react";
import PropTypes from "prop-types";
import { Row } from "reactstrap";
import Parser from "html-react-parser";
class LegalComponent extends React.PureComponent {
  static propTypes = {
    legal: PropTypes.string
  };

  render() {
    const { legal } = this.props;
    return (
      <div>
        <Row style={{ padding: "0rem 2rem" }}>
          <div>{Parser(legal)}</div>
        </Row>
      </div>
    );
  }
}

export default LegalComponent;
