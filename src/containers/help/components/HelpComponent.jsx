import React from "react";
import PropTypes from "prop-types";
import { Row } from "reactstrap";
import Parser from "html-react-parser";
class HelpComponent extends React.PureComponent {
  static propTypes = {
    tutoriel: PropTypes.string
  };

  render() {
    const { tutoriel } = this.props;
    return (
      <div>
        <Row style={{ padding: "0rem 2rem" }}>
          <div>{Parser(tutoriel)}</div>
        </Row>
      </div>
    );
  }
}

export default HelpComponent;
