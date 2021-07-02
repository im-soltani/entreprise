import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Container } from "reactstrap";
import { graphql } from "react-apollo";
import GraphQlResult from "../../shared/components/GraphQLResult";
import EntrepriseInfo from "./components/EntrepriseInfo";
import EntrepriseInfoUpdate from "./components/EntrepriseInfoUpdate";

class EntrepriseDetails extends React.PureComponent {
	static propTypes = {
		loading: PropTypes.bool,
		refetch: PropTypes.func,
		error: PropTypes.object,
		getEntrepriseProfile: PropTypes.object
	};

	static defaultProps = {
		loading: false,
		error: null,
		getEntrepriseProfile: null
	};

	state = { upodate: false };

	handleChangeUpdate = () => {
		this.setState({ update: !this.state.update });
		this.props.refetch();
	};
	render() {
		const { loading, error, refetch, getEntrepriseProfile } = this.props;
		return (
			<Container className="dashboard">
				<GraphQlResult error={error} loading={loading} emptyResult={!loading && !getEntrepriseProfile}>
					{getEntrepriseProfile &&
						(!this.state.update && (
							<EntrepriseInfo
								user={getEntrepriseProfile}
								handleChangeUpdate={this.handleChangeUpdate}
								loading={loading}
							/>
						))}
					{getEntrepriseProfile &&
						(this.state.update && (
							<EntrepriseInfoUpdate
								user={getEntrepriseProfile}
								handleChangeUpdate={this.handleChangeUpdate}
								loading={loading}
								refetch={refetch}
							/>
						))}
				</GraphQlResult>
			</Container>
		);
	}
}

const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			id
			num
			profile_pic_url
			name
			profile {
				id
				email
				is_verified
				name
				prenom
				isleader
			}
			leaderProfile {
				id
				email
				is_verified
				name
				prenom
				isleader
			}
			ent_type
			name_of_in_charge
			email_of_in_charge
			tel
			application_email
			member_number
			banner
			description
			effective
			website
			activity
			zip_code
			country
			city
			address
			address_2
			zip_code_2
			country_2
			city_2
			youtubeLink
			linkedinLink
		}
	}
`;

export default graphql(GET_ENTRPRISE, {
	options: () => ({
		fetchPolicy: "network-only"
	}),
	props: ({ data: { loading, error, getEntrepriseProfile, refetch } }) => ({
		loading,
		error,
		getEntrepriseProfile,
		refetch
	})
})(EntrepriseDetails);
