import React from "react";
import { Container, Row } from "reactstrap";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import OfferForm from "./components/OfferForm";
import OfferFormationForm from "../add-formation/components/FormationForm"
class AddOffer extends React.Component {
  static propTypes = {
    getEntrepriseProfile: PropTypes.object.isRequired,
  };
  static defaultProps = {
    loading: true,
    getEntrepriseProfile: {
      name: "Mon compte",
      ent_type: null
    }
  };
  render() {
    const { ent_type } = this.props.getEntrepriseProfile;
    return (
      <Container className="dashboard">
        <Row>
          {ent_type == "ecole" ? <OfferFormationForm type={"add"} /> : <OfferForm type={"add"} />}
        </Row>
      </Container>
    );
  }
}
const GET_ENTRPRISE = gql`
  query getEntrepriseProfile {
    getEntrepriseProfile {
      name
      ent_type
    }
  }
`;
export default graphql(GET_ENTRPRISE, {
  options: () => ({
    fetchPolicy: "cache-and-network"
  }),
  props: ({ data: { loading, error, getEntrepriseProfile } }) => ({
    loading,
    error,
    getEntrepriseProfile
  })
})(AddOffer);
