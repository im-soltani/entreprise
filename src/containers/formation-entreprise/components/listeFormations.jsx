import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Pagination from "react-js-pagination";
import { CardBody } from "reactstrap";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import HeaderlisteFormations from "./HeaderlisteFormations";
import FormationItem from "./formationItem";
import { GET_FORMATION_BY_ENTREPRISE } from "../../../handler/queries";
const image = `${process.env.PUBLIC_URL}/img/images/not-found.png`;

class ListeFormations extends React.Component {
	static propTypes = {
		loading: PropTypes.bool,
		error: PropTypes.object,
		status: PropTypes.string,
		data: PropTypes.object,
		getFormationByEntreprise: PropTypes.func,
		exportOffer: PropTypes.func
	};

	static defaultProps = {
		loading: true,
		error: null,
		data: {}
	};

	constructor(props) {
		super(props);

		this.state = {
			status: props.status,
			sort: "recent",
			field: "name",
			field2: "all",
			field3: "all",
			direction: 1,
			direction2: 1,
			direction3: 1,
			activePage: 1,
			search: "",
			url: ""
		};
	}
	onResponse = cb => {
		this.setState(
			{
				loading: false
			},
			() => {
				cb();
			}
		);
	};
	handlePageChange = pageNumber => {
		this.setState({
			activePage: pageNumber,
			skip: pageNumber * 2
		});
	};
	getStatus = value => {
		this.setState({ status: value });
	};
	getSort = (field, direction) => {
		this.setState({ field, direction });
	};
	getSort2 = (field2, direction2) => {
		this.setState({ field2, direction2 });
	};
	getSort3 = (field3, direction3) => {
		this.setState({ field3, direction3 });
	};
	onChangeSearch = value => {
		this.setState({ search: value });
	};
	render() {
		const { activePage, status, search, field, direction, field2, direction2, field3, direction3 } = this.state;
		return (
			<CardBody>
				<HeaderlisteFormations
					getSort={this.getSort}
					getSort2={this.getSort2}
					getSort3={this.getSort3}
					getStatus={this.getStatus}
					onChangeSearch={this.onChangeSearch}
					status={status}
					field={field}
					direction={direction}
					field2={field2}
					direction2={direction2}
					field3={field3}
					direction3={direction3}
					search={search}
				/>
				<Query
					query={GET_FORMATION_BY_ENTREPRISE}
					variables={{
						search: search,
						skip: (activePage - 1) * 10,
						limit: 10,
						field,
						direction,
						field2,
						direction2,
						field3,
						direction3
					}}
					fetchPolicy={"no-cache"}
				>
					{({ data, loading, error, refetch }) => {
						if (loading) return <div />;
						else if (error) {
							console.log(error);
							return <p>ERROR</p>;
						}
						return (
							<Fragment>
								{data.getFormationByEntreprise &&
									data.getFormationByEntreprise.offers &&
									data.getFormationByEntreprise.offers.length > 0 ? (
										data.getFormationByEntreprise.offers.map(offer => {
											return (
												<FormationItem
													key={offer.num}
													offer={offer}
													state={status}
													search={search}
													skip={(activePage - 1) * 4}
													limit={4}
													refetch={refetch}
													ent_type={"ecole"}
												/>
											);
										})
									) : (
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												textAlign: "center",
												alignSelf: "center",
												alignItems: "center"
											}}
										>
											<img src={image} style={{ minWidth: 300, width: "25%" }} />
										</div>
									)}
								<div style={{ textAlign: "center" }}>
									<Pagination
										prevPageText="Précédente"
										nextPageText="Suivante"
										firstPageText="Première"
										lastPageText="Dernière"
										activePage={activePage}
										itemsCountPerPage={10}
										innerClass={"pagination"}
										totalItemsCount={data.getFormationByEntreprise ? data.getFormationByEntreprise.totalCount : 0}
										pageRangeDisplayed={10}
										onChange={this.handlePageChange}
									/>
								</div>
							</Fragment>
						);
					}}
				</Query>
			</CardBody>
		);
	}
}
export default withRouter(ListeFormations);
