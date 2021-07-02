import React from "react";
import { Col, Container, Row } from "reactstrap";
import OfferInfosTop from "./components/OfferInfosTop";
import OfferInfosTopFormation from "./components/OfferInfosTopFormation";
import OfferCompetences from "./components/OfferCompetences";
import OfferTabs from "./components/OfferTabs";
import GraphQlResult from "../../shared/components/GraphQLResult";
import PropTypes from "prop-types";
import { GET_OFFER_BY_NUM } from "../../handler/queries";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import EditIcon from "mdi-react/EditIcon";
import { withRouter } from "react-router";

class Offer extends React.PureComponent {
	static propTypes = {
		loading: PropTypes.bool,
		error: PropTypes.object,
		getOfferByNum: PropTypes.object,
		history: PropTypes.object,
		location: PropTypes.object,
		match: PropTypes.object,
		refetch: PropTypes.func
	};

	static defaultProps = {
		loading: false,
		error: null,
		getOfferByNum: null
	};
	render() {
		const { loading, error, getOfferByNum, refetch } = this.props;
		console.log("**getOfferByNum**", getOfferByNum);
		return (
			<Container>
				<GraphQlResult error={error} loading={loading} emptyResult={!loading && !getOfferByNum}>
					{getOfferByNum && (
						<div className="profile">
							<Row>
								<Col md={12} lg={5} xl={4}>
									{getOfferByNum.offreType == "EDUCATION" ? (
										<Row>
											<OfferInfosTopFormation offer={getOfferByNum} />
											<OfferCompetences competences={getOfferByNum.competences} />
											{getOfferByNum.jobs.length > 0 && <OfferCompetences title={"Métiers"} competences={getOfferByNum.jobs} />}
											{getOfferByNum.job.length > 0 && <OfferCompetences title={"Métiers"} competences={getOfferByNum.job} />}

										</Row>
									) : (
											<Row>
												<OfferInfosTop offer={getOfferByNum} />{" "}
												<OfferCompetences competences={getOfferByNum.competences} />
												<OfferCompetences title={"Métiers"} competences={[getOfferByNum.job]} />
												<OfferCompetences title={"Softskills"} competences={getOfferByNum.softskills} />
											</Row>
										)}
								</Col>
								<OfferTabs offer={getOfferByNum} refetch={refetch} />
							</Row>
							{getOfferByNum.offreType != "EDUCATION" && (
								<div className="Button-add__div" title="Modifier">
									<Link
										className="Button-add__btn"
										to={{
											pathname: `/mon-offre/${getOfferByNum.num}`,
											state: {
												tab: "2",
											}
										}}
									>
										<EditIcon className="Button-add__btn-icon" />
									</Link>
								</div>
							)}
						</div>
					)}
				</GraphQlResult>
			</Container>
		);
	}
}

export default withRouter(
	graphql(GET_OFFER_BY_NUM, {
		options: props => ({
			variables: {
				num: props.match.params.num,
			},
			fetchPolicy: "cache-and-network"
		}),
		props: ({ data: { loading, error, getOfferByNum, refetch } }) => ({
			loading,
			error,
			getOfferByNum,
			refetch
		})
	})(Offer)
);
