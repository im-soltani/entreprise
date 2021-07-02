import React from "react";
import { Container } from "reactstrap";
import gql from "graphql-tag";
import { Query, graphql } from "react-apollo";
import Pagination from "react-js-pagination";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import CandidatItem from "../candidat/components/CandidatItem";
import { SET_KEYVALUE } from "../../handler/mutations.local";
const image = `${process.env.PUBLIC_URL}/img/images/not-found.png`;

class AssociatedCandidate extends React.PureComponent {
	static propTypes = {
		match: PropTypes.object,
		location: PropTypes.string,
		setKeyName: PropTypes.func,
	};

	static defaultProps = {};
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1
		};
	}
	handlePageChange = pageNumber => {
		this.setState({
			activePage: pageNumber,
			skip: pageNumber * 2
		});
	};
	render() {
		const { activePage } = this.state;
		this.props
			.setKeyName({
				variables: {
					KeyValue: this.props.location.state.title
				}
			})
			.then(() => { });
		return (
			<Container>
				<Query
					query={GET_ASSOCIATED_APPLICATIONS}
					variables={{
						num: this.props.match.params.num,
						skip: (activePage - 1) * 5,
						limit: 5
					}}
					fetchPolicy="network-only"
				>
					{({ data, loading, error }) => {
						if (loading) return <div />;
						else if (error) return <p>ERROR</p>;
						return (
							<React.Fragment>
								{data.getAssociatedApplication &&
									data.getAssociatedApplication.applications &&
									data.getAssociatedApplication.applications.length > 0 ? (
										data.getAssociatedApplication.applications.map(applications => {
											return (
												<CandidatItem candidat={applications.candidat} key={applications._id} shared={false} ass={true} elastic={false} />
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
										itemsCountPerPage={5}
										innerClass={"pagination"}
										totalItemsCount={data.getAssociatedApplication ? data.getAssociatedApplication.totalCount : 0}
										pageRangeDisplayed={5}
										onChange={this.handlePageChange}
									/>
								</div>
							</React.Fragment>
						);
					}}
				</Query>
			</Container>
		);
	}
}

const GET_ASSOCIATED_APPLICATIONS = gql`
	query getAssociatedApplication($num: Int!, $skip: Int, $limit: Int) {
		getAssociatedApplication(num: $num, skip: $skip, limit: $limit) {
			totalCount
			applications {
				id
				candidat {
					id
					last_name
					first_name
					jobs
					num
					competences
					note
					address
					letter
					sharedby
					sharedcv
					contract
					twitter
					siteweb
					linkedin
					experience
					disponibility
					entreprises {
						isFavoris
						id
					}
					tel
					etude
					profile_pic_url
					address
					cv
					cv_eng
					profile {
						id
						email
						is_blocked
					}
					createdAt
				}
			}
		}
	}
`;
export default withRouter(
	graphql(SET_KEYVALUE, {
		name: "setKeyName"
	})(AssociatedCandidate)
);
