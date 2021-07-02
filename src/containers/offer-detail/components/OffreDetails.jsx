import React, { Fragment } from "react";
import { Label } from "reactstrap";
import { withRouter } from "react-router";
import { Query, graphql } from "react-apollo";
import * as moment from "moment";
import OfferDetailTabs from "./OfferDetailTabs";
import PropTypes from "prop-types";
import { GET_OFFER_BY_NUM } from "../../../handler/queries";
import { SET_KEYVALUE } from "../../../handler/mutations.local";

class OffreDetails extends React.Component {
	static propTypes = {
		history: PropTypes.object,
		location: PropTypes.object,
		match: PropTypes.object,
		setKeyName: PropTypes.func,
		num: PropTypes.string
	};
	render() {
		return (
			<Query query={GET_OFFER_BY_NUM} variables={{ num: this.props.num }}>
				{({ data, loading, error, refetch }) => {
					if (loading) return <div />;
					else if (error) return <p>ERROR</p>;
					else if (data && data.getOfferByNum) {
						data.getOfferByNum &&
							data.getOfferByNum.name &&
							this.props
								.setKeyName({
									variables: {
										KeyValue: data.getOfferByNum.name
									}
								})
								.then(() => {});
						return (
							<Fragment>
								<div>
									<span className="OfferDetail-title">{data.getOfferByNum.name}</span>
									<div className="OfferDetail-div__date">
										<Label className="OfferItem-label">
											<span className="OfferDetail-span__date">Créée le :</span>
											{moment(data.getOfferByNum.createdAt).format("DD/MM/YYYY")}
										</Label>
										{data.getOfferByNum.offreType == "JOB" && (
											<Label className="OfferItem-label" style={{ marginLeft: "2em" }}>
												<span className="OfferDetail-span__date">Expire le :</span>
												{moment(data.getOfferByNum.expiredAt).format("DD/MM/YYYY")}
											</Label>
										)}
									</div>
								</div>
								<div style={{ marginBottom: "4rem" }}>
									<OfferDetailTabs
										refetch={refetch}
										offer={data.getOfferByNum}
										activeTab={this.props.location && this.props.location.state ? this.props.location.state.tab : "1"}
									/>
								</div>
							</Fragment>
						);
					}
				}}
			</Query>
		);
	}
}

export default withRouter(
	graphql(SET_KEYVALUE, {
		name: "setKeyName"
	})(OffreDetails)
);
