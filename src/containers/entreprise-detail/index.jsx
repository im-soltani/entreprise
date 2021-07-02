import React from "react";
import { Col, Container, Row } from "reactstrap";
import ProfileMain from "./components/ProfileMain";
import ProfilInfosTop from "./components/ProfilInfosTop";
import ProfilInfosBottom from "./components/ProfilInfosBottom";
import ProfilCompetences from "./components/ProfilCompetences";
import ProfileTabs from "./components/ProfileTabs";
import GraphQlResult from "../../shared/components/GraphQLResult";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import { withRouter } from "react-router";

class EntrepriseDetails extends React.PureComponent {
	static propTypes = {
		loading: PropTypes.bool,
		error: PropTypes.object,
		getEntrepriseByNum: PropTypes.object,
		history: PropTypes.object,
		location: PropTypes.object,
		match: PropTypes.object
	};

	static defaultProps = {
		loading: false,
		error: null,
		getEntrepriseByNum: null
	};
	render() {
		const { loading, error, getEntrepriseByNum } = this.props;
		return (
			<Container style={{ marginTop: "2rem" }}>
				<GraphQlResult error={error} loading={loading} emptyResult={!loading && !getEntrepriseByNum}>
					{getEntrepriseByNum && (
						<div className="profile" style={{ paddingTop: 40 }}>
							<Row>
								<Col md={12} lg={5} xl={4}>
									<Row>
										<ProfileMain entreprise={getEntrepriseByNum} />
										<ProfilInfosTop entreprise={getEntrepriseByNum} />
										<ProfilCompetences activity={getEntrepriseByNum.activity} />
										<ProfilInfosBottom entreprise={getEntrepriseByNum} />
									</Row>
								</Col>
								<ProfileTabs entreprise={getEntrepriseByNum} />
							</Row>
						</div>
					)}
				</GraphQlResult>
			</Container>
		);
	}
}

const GET_ENTREPRISE_BY_NUM = gql`
	query getEntrepriseByNum($num: Int!) {
		getEntrepriseByNum(num: $num) {
			id
			num
			activity
			name
			banner
			address
			description
			application_email
			name_of_in_charge
			website
			tel
      ent_type
			location {
				latitude
				longitude
			}
			profile_pic_url
			profile {
				email
			}
			youtubeLink
		}
	}
`;

export default withRouter(
	graphql(GET_ENTREPRISE_BY_NUM, {
		options: props => ({
			variables: { num: props.match.params.num },
			fetchPolicy: "network-only"
		}),
		props: ({ data: { loading, error, getEntrepriseByNum } }) => ({
			loading,
			error,
			getEntrepriseByNum
		})
	})(EntrepriseDetails)
);
