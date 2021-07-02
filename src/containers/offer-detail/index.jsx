import React from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import OffreDetails from "./components/OffreDetails";
import { withRouter } from "react-router-dom";

class MyOffer extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.object,
    getEmail: PropTypes.object,
    refetch: PropTypes.func
  };

  static defaultProps = {
    loading: false,
    error: null,
    getEmail: {}
  };
  render() {
    return (
      <Container className="dashboard offerwhite">
        <OffreDetails num={this.props.match.params.num} />
      </Container>
    );
  }
}
export default withRouter(MyOffer);
