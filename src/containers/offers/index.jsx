import React from "react";
import PropTypes from "prop-types";
import { Container, Button } from "reactstrap";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import ListeOffers from "./components/ListeOffers";
import { withRouter } from "react-router-dom";
import AddIcon from "mdi-react/BriefcaseAddOutlineIcon";
import Icon from "../../shared/components/Icon";

class MyOffers extends React.PureComponent {
	static propTypes = {
		history: PropTypes.object,
		location: PropTypes.object,
		match: PropTypes.object,
		loading: PropTypes.bool,
		error: PropTypes.object,
		getEmail: PropTypes.object,
		refetch: PropTypes.func,
		getEntrepriseProfile: PropTypes.object.isRequired
	};

	static defaultProps = {
		loading: false,
		error: null,
		getEmail: {},
		getEntrepriseProfile: {
			name: "Mon compte",
			ent_type: null
		}
	};

	render() {
		const { ent_type } = this.props.getEntrepriseProfile;
		return (
			<Container className="dashboard">
				<ListeOffers
					status={
						this.props.location && this.props.location.state && this.props.location.state.status ? (
							this.props.location.state.status
						) : (
							"PUBLISHED"
						)
					}
				/>
				{ent_type == "ecole" ? (
					<div className="Button-add__div" title="Créer une formation">
						<Button className="Button-add__btn" onClick={() => this.props.history.push("/creation-une-offre")}>
							<Icon className="Button-add__btn-icon" name="add-formation" />
						</Button>
					</div>
				) : (
					<div className="Button-add__div" title="Créer une offre">
						<Button className="Button-add__btn" onClick={() => this.props.history.push("/creation-une-offre")}>
							<AddIcon className="Button-add__btn-icon" />
						</Button>
					</div>
				)}
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
})(withRouter(MyOffers));
