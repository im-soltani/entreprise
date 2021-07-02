import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, InputGroup, InputGroupAddon } from "reactstrap";
import SearchIcon from "mdi-react/SearchIcon";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import GraphQlResult from "../../shared/components/GraphQLResult";
import AddUserModal from "./components/AddUserModal";
import DataListe from "./components/dataliste";
class UsersList extends React.PureComponent {
	static propTypes = {
		getUsers: PropTypes.array,
		loading: PropTypes.bool,
		refetch: PropTypes.func,
		error: PropTypes.object,
		getEntrepriseProfile: PropTypes.object
	};

	static defaultProps = {
		getUsers: []
	};

	state = {
		activePage: 1,
		search: "",
		skip: 0,
		limit: 8,
		modal: false
	};

	handlePageChange = pageNumber => {
		this.setState({
			activePage: pageNumber,
			skip: pageNumber * 2
		});
	};

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};
	toggle = () => {
		this.setState({
			modal: !this.state.modal
		});
	};
	render() {
		const { modal, search } = this.state;
		const { loading, error, getEntrepriseProfile, refetch } = this.props;
		return (
			<React.Fragment>
				<AddUserModal modal={modal} toggleModal={this.toggle} refetch={refetch} />
				<Row className="Add-row">
					<Col xl={8} lg={8} md={8} sm={12}>
						<InputGroup>
							<InputGroupAddon
								addonType="prepend"
								style={{
									backgroundColor: "#e8e8e8",
									width: "3em",
									borderRadius: "24px 0px 0px 24px",
									border: "1px solid #ced4da"
								}}>
								<SearchIcon
									style={{
										margin: "auto",
										borderRadius: "24px 0px 0px 24px",
										color: "#6b6b6b",
										fontSize: "1.3em"
									}}
								/>
							</InputGroupAddon>
							<Input
								className="Profil-group__input"
								placeholder="Rechercher..."
								type="text"
								name="search"

								value={this.state.search}
								onChange={this.onChange}
							/>
						</InputGroup>
					</Col>
					<Col xl={4} lg={4} md={4} sm={12}>
						<div className="button-Open-modal" onClick={() => this.setState({ modal: true })}>
							Ajouter un utilisateur
						</div>
					</Col>
				</Row>
				<GraphQlResult error={error} loading={loading} emptyResult={!loading && !getEntrepriseProfile}>
					{getEntrepriseProfile && <DataListe dataa={this.props.getEntrepriseProfile} search={search} />}
				</GraphQlResult>
			</React.Fragment>
		);
	}
}
const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			id
			name
			company_id
		}
	}
`;

export default graphql(GET_ENTRPRISE, {
	options: () => ({
		fetchPolicy: "cache-and-network"
	}),
	props: ({ data: { loading, error, getEntrepriseProfile, refetch } }) => ({
		loading,
		error,
		getEntrepriseProfile,
		refetch
	})
})(UsersList);
