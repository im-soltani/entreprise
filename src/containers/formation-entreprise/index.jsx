import React from "react";
import PropTypes from "prop-types";
import { Container } from "reactstrap";
import ListeFormations from "./components/listeFormations";
import { withRouter } from "react-router-dom";
class liste_formations extends React.PureComponent {
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
      <Container className="dashboard">
        <ListeFormations
          status={"PUBLISHED"}
        />
      </Container>
    );
  }
}
export default withRouter(liste_formations);
