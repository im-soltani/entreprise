import React from "react";
import { Container, Row } from "reactstrap";
import { graphql, compose, Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import StatisticsCard from "./components/StatisticsCard";
import ApplicationsByWeek from "./components/ApplicationsByWeek";
import CreateCandidat from "./components/CreateCandidat";
import {
  GET_APPLICATIONS_PENDING,
  GET_OFFERS_ACTIVE_STATS,
  GET_MYCV_STATS
} from "../../handler/queries";

class DefaultDashboard extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    getOffersActiveStatEnterprise: PropTypes.number,
    getMyCVSatat: PropTypes.number,
    getPendingApplication: PropTypes.number,
    exportOffer: PropTypes.func,
    getEntrepriseProfile: PropTypes.object
  };

  static defaultProps = {
    getOffersActiveStatEnterprise: 0,
    getMyCVSatat: 0,
    getPendingApplication: 0,
    getEntrepriseProfile: {
      id: null,
      name: "Mon compte",
      ent_type: null
    }
  };

  render() {
    const { getOffersActiveStatEnterprise, getPendingApplication, getEntrepriseProfile } = this.props;
    return (
      <Container className="dashboard">
        <Row>
          <CreateCandidat />
        </Row>

        <Row className="row-revers">
          <Query
            query={GET_MYCV_STATS}
            variables={{
              ent_type: getEntrepriseProfile.ent_type,
              uid: getEntrepriseProfile.id
            }}
            fetchPolicy="cache-and-network"
          >
            {({ data, loading, error }) => {
              if (loading) return <div />;
              else if (error) return <p>ERROR</p>;
              console.log("getMyCVSatat***", data);
              return (
                <div style={{ flexDirection: "row", display: "contents" }}>
                  <StatisticsCard
                    icon="files"
                    value={data.getMyCVSatat}
                    label="voir mes offres"
                    link="/mes-offres"
                    iconContainerClassName="border-primary"
                    iconClassName="fill-primary"
                    valueClassName="text-warning"
                  />
                  <StatisticsCard
                    icon="cvs"
                    value={data.getMyCVSatat}
                    to="/rechercher-un-candidat"
                    label={getEntrepriseProfile.ent_type == "ecole" ? "CV dans ma cvthèque" : "CV dans la cvthèque"}
                    iconContainerClassName="border-warning"
                    iconClassName="fill-warning"
                    valueClassName="text-warning"
                  />
                </div>)
            }}
          </Query>

          <StatisticsCard
            icon="offers-active"
            value={getOffersActiveStatEnterprise}
            label="Offres actives"
            to="/mes-offres"
            iconContainerClassName="border-danger"
            iconClassName="fill-danger"
            valueClassName="text-danger"
          />
          <StatisticsCard
            icon="selected-cv"
            value={getPendingApplication}
            label="Candidatures non lues"
            to="/mes-offres"
            iconContainerClassName="border-files"
            iconClassName="fill-files"
            valueClassName="text-files"
          />
        </Row>
        <Row>
          <ApplicationsByWeek />
        </Row>
      </Container>
    );
  }
}
const EXPORT_OFFERS = gql`
	mutation exportOffer($state: String!) {
		exportOffer(state: $state) {
			URL
		}
	}
`;
const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			id
			name
			ent_type
		}
	}
`;
export default compose(
  graphql(GET_OFFERS_ACTIVE_STATS, {
    options: () => ({
      fetchPolicy: "cache-and-network"
    }),
    props: ({ data: { getOffersActiveStatEnterprise } }) => ({
      getOffersActiveStatEnterprise
    })
  }),
  graphql(GET_APPLICATIONS_PENDING, {
    options: () => ({
      fetchPolicy: "cache-and-network"
    }),
    props: ({ data: { getPendingApplication } }) => ({
      getPendingApplication
    })
  }),
  graphql(EXPORT_OFFERS, {
    name: "exportOffer"
  }),
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
  }),
)(DefaultDashboard);
