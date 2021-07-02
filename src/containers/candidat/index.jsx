import React from "react";
import { Col, Container, Row } from "reactstrap";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { graphql, compose } from "react-apollo";
import ProfileMain from "./components/ProfileMain";
import ProfilInfosTop from "./components/ProfilInfosTop";
import ProfilInfosBottom from "./components/ProfilInfosBottom";
import ProfilCompetences from "./components/ProfilCompetences";
import ProfileTabs from "./components/ProfileTabs";
import GraphQlResult from "../../shared/components/GraphQLResult";
import { GET_CANDIDAT_BY_NUM } from "../../handler/queries";

class CandidatProfil extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.object,
    getCandidatByNum: PropTypes.object,
    getEntrepriseProfile: PropTypes.object,
    refetch: PropTypes.func
  };

  static defaultProps = {
    loading: false,
    error: null,
    getCandidatByNum: null,
    getEntrepriseProfile: null
  };
  render() {
    const { loading, error, getCandidatByNum, getEntrepriseProfile, refetch } = this.props;
    return (
      <Container>
        <GraphQlResult
          error={error}
          loading={loading}
          emptyResult={!loading && !getCandidatByNum}>
          {getCandidatByNum && (
            <div className="profile">
              <Row>
                <Col md={12} lg={5} xl={4}>
                  <Row>
                    <ProfileMain
                      profile_pic_url={getCandidatByNum.profile_pic_url}
                      first_name={getCandidatByNum.first_name}
                      last_name={getCandidatByNum.last_name}
                      email={getCandidatByNum.profile.email}
                      createdAt={getCandidatByNum.createdAt}
                      is_blocked={getCandidatByNum.profile.is_blocked}
                      is_blocked_by_admin={getCandidatByNum.profile.is_blocked_by_admin}
                      id={getCandidatByNum.id}
                      num={getCandidatByNum.num}
                      entreprises={getCandidatByNum.entreprises}
                      sharedcv={getCandidatByNum.sharedcv}
                      sharedby={getCandidatByNum.sharedby}
                      refetch={refetch}
                      sexe={getCandidatByNum.sexe}
                    />
                    <ProfilInfosTop candidat={getCandidatByNum} />
                    <ProfilInfosBottom candidat={getCandidatByNum} />
                    <ProfilCompetences
                      competences={getCandidatByNum.competences} test={true}
                    />
                    {getCandidatByNum.softskills && <ProfilCompetences
                      competences={getCandidatByNum.softskills} test={false}
                    />}
                  </Row>
                </Col>
                <ProfileTabs candidat={getCandidatByNum} entreprise={getEntrepriseProfile} />
              </Row>
            </div>
          )}
        </GraphQlResult>
      </Container>
    );
  }
}

const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			id
		}
	}
`;

export default withRouter(compose(

  graphql(GET_CANDIDAT_BY_NUM, {
    options: props => ({
      variables: { num: props.match.params.num },
      fetchPolicy: "cache-and-network"
    }),
    props: ({ data: { loading, error, getCandidatByNum, refetch } }) => ({
      loading,
      error,
      getCandidatByNum,
      refetch
    })
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
  })
)(CandidatProfil)
);
