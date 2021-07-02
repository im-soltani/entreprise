import React from "react";
import SearchCVComponent from "./components/SearchCVComponent";
import MyCVComponentSchool from "./components/searchCVComponentSchool";
import { Container, Row } from "reactstrap";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class SearchCV extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    getEntrepriseProfile: PropTypes.object.isRequired
  };
  static defaultProps = {
    getEntrepriseProfile: {
      ent_type: null
    }
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
    const { ent_type } = this.props.getEntrepriseProfile;
    return (
      <Container className="dashboard">
        <Row>
          {ent_type == "ecole" ?
            <MyCVComponentSchool type={type} />
            : <SearchCVComponent type={type} />
          }
        </Row>
      </Container>
    );
  }
}
const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			ent_type
		}
	}
`;
export default withRouter(
  compose(
    graphql(GET_ENTRPRISE, {
      options: () => ({
        fetchPolicy: "cache-and-network"
      }),
      props: ({ data: { loading, error, getEntrepriseProfile, refetch } }) => ({
        loading,
        error,
        getEntrepriseProfile,
        refetch
      })
    })
  )(SearchCV)
);