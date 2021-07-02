import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import * as moment from "moment";
import Pagination from "react-js-pagination";
import { Query } from "react-apollo";

import Panel from "../../../shared/components/Panel";
import { GET_ENTREPRISES_USERS } from "../../../handler/queries";

class DataListe extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		refetch: PropTypes.func,
		dataa: PropTypes.object,
		search: PropTypes.string
	};

	static defaultProps = {
		data: [],
		search: ""
	};

	state = {
		activePage: 1,
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
	render() {
		const { limit, activePage } = this.state;
		const { dataa, search } = this.props;
		console.log("dataa", dataa)
		return (
			<React.Fragment>
				<Query
					query={GET_ENTREPRISES_USERS}
					variables={{
						search: search,
						skip: (activePage - 1) * limit,
						limit: 999999,
						id: dataa.id
					}}
					fetchPolicy="no-cache"
				>
					{({ data, loading, error, refetch }) => {
						if (loading) return <div />;
						else if (error) return <p>ERROR</p>;
						return (
							<Panel xl={12} lg={12} md={12} title="LISTE DES UTILISATEURS" refetch={refetch}>
								<Row
									className="Application-tr_2"
									style={{ padding: "10px 0px", borderBottomColor: "ridge", borderBottomWidth: 1 }}
								>
									<Col xl={3} lg={3} md={6} sm={12} className="Application-td__name">
										Nom
								</Col>
									<Col xl={3} lg={3} md={6} sm={12} className="Application-td">
										Email
								</Col>
									<Col xl={2} lg={2} md={6} sm={12} className="Application-td" />
									<Col xl={3} lg={3} md={6} sm={12} className="Application-td__name">
										Date de création
								</Col>
									<Col xl={1} lg={1} md={6} sm={12} className="Application-td" />
								</Row>
								{data.getEntrepriseUsers &&
									data.getEntrepriseUsers.users &&
									data.getEntrepriseUsers.users.map(user => {
										return (
											<Row
												key={user.id}
												className="Application-tr_2"
												style={{ padding: "10px 0px", borderBottomColor: "ridge", borderBottomWidth: 1 }}
											>
												<Col xl={3} lg={3} md={6} sm={12} className="Application-td__name">
													{user.name ? (user.name + " " + user.prenom) : dataa.name}
												</Col>
												<Col xl={3} lg={3} md={6} sm={12} className="Application-td">
													{user.email}
												</Col>
												<Col xl={2} lg={2} md={6} sm={12} className="Application-td" />
												<Col xl={3} lg={3} md={6} sm={12} className="Application-td__name">
													{moment(user.createdAt).format("DD/MM/YYYY")}
												</Col>
												<Col xl={1} lg={1} md={6} sm={12} className="Application-td" />
											</Row>
										);
									})}
								<div style={{ textAlign: "center" }}>
									<Pagination
										prevPageText="Précédente"
										nextPageText="Suivante"
										firstPageText="Première"
										lastPageText="Dernière"
										activePage={activePage}
										itemsCountPerPage={limit}
										innerClass={"pagination"}
										totalItemsCount={data.getEntrepriseUsers ? data.getEntrepriseUsers.totalCount : 0}
										pageRangeDisplayed={limit}
										onChange={this.handlePageChange}
									/>
								</div>
							</Panel>
						);
					}}
				</Query>
			</React.Fragment>
		);
	}
}

export default DataListe;
