import React from "react";
import PropTypes from "prop-types";
import { Container, Label, Button, Row, Col } from "reactstrap";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import StickyLabels from "../../../shared/components/StickyLabels";
import Icon from "../../../shared/components/Icon";
import * as moment from "moment";
import { GET_OFFERS_BY_STATUS } from "../../../handler/queries";
import { withRouter, Link } from "react-router-dom";
import Alert from "../../../handler/utils/Alert";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
class FomrationItem extends React.PureComponent {
	static propTypes = {
		history: PropTypes.object,
		location: PropTypes.object,
		match: PropTypes.object,
		offer: PropTypes.object,
		state: PropTypes.string,
		search: PropTypes.string,
		ent_type: PropTypes.string,
		skip: PropTypes.number,
		limit: PropTypes.number,
		updateOfferState: PropTypes.func,
		duplicateOffer: PropTypes.func,
		onUpdateted: PropTypes.func,
		refetch: PropTypes.func
	};

	static defaultProps = {
		offer: {},
		status: "DRAFT",
		sort: "recent",
		skip: 0,
		limit: 10,
		search: "",
		ent_type: ""
	};

	onUpdate = state => {
		const { ent_type } = this.props;
		this.props
			.updateOfferState({
				variables: {
					id: this.props.offer.id,
					state: state
				},
				refetchQueries: [
					{
						query: GET_OFFERS_BY_STATUS,
						variables: {
							state: this.props.state,
							search: this.props.search,
							skip: this.props.skip,
							limit: this.props.limit,
							field: "name",
							direction: 1,
							ent_type: ent_type
						}
					},
					{
						query: GET_OFFERS_BY_STATUS,
						variables: {
							state: state,
							search: this.props.search,
							skip: this.props.skip,
							limit: this.props.limit,
							field: "name",
							direction: 1
						}
					},
					{
						query: GET_OFFERS_BY_STATUS,
						variables: {
							state: this.props.offer.state,
							search: this.props.search,
							skip: this.props.skip,
							limit: this.props.limit,
							field: "name",
							direction: 1
						}
					}
				]
			})
			.then(() => {
				this.props.refetch();
				Alert.success("Etat changé avec succès");
			});
	};

	_handleDuplicate = () => {
		const { ent_type } = this.props;
		this.props
			.duplicateOffer({
				variables: {
					id: this.props.offer.id
				},
				refetchQueries: [
					{
						query: GET_OFFERS_BY_STATUS,
						variables: {
							state: "DRAFT",
							search: "",
							skip: 0,
							limit: 10,
							field: "name",
							direction: 1,
							ent_type: ent_type
						}
					}
				]
			})
			.then(res => {
				Alert.success("Offre dupliquée avec succès");
				this.props.refetch();
				console.log("res", res);
			})
			.catch(e => {
				console.log(e);
			});
	};

	render() {
		const { offer, ent_type } = this.props;
		return (
			<Container key={offer.num} className="OfferItem">
				<Row>
					<Col xs={12} md={5} lg={5} xl={5}>
						{offer.state !== "DRAFT" &&
						offer.application_number > 0 && (
							<div id="talkbubble" style={{ cursor: "pointer" }} title="Nouvelles candidatures">
								<Link
									to={{
										pathname: `/mon-offre/${offer.num}`,
										state: {
											ent_type: ent_type
										}
									}}
								>
									{offer.application_number}
								</Link>
							</div>
						)}
						<div style={{ marginLeft: 25 }} className="bloc_t">
							<Label className="OfferItem-name">
								<Link
									to={{
										pathname: `/offre/${offer.num}`,
										state: {
											ent_type: ent_type
										}
									}}
								>
									{offer.name}
								</Link>
							</Label>

							<Label
								className="OfferItem-label"
								style={{
									color: "#828181"
								}}
							>
								{offer.typeFormation}

								<br />
							</Label>
							<Label
								className="OfferItem-label"
								style={{
									color: "#828181"
								}}
							>
								Formation: Du  {moment(offer.startEducation).format("DD/MM/YYYY")}  au {" "}
								{moment(offer.endEducation).format("DD/MM/YYYY")}
								<br />
							</Label>

							<Label
								className="OfferItem-label"
								style={{
									color: "#828181"
								}}
							>
								Condidature: Du  {moment(offer.startApply).format("DD/MM/YYYY")}  au {" "}
								{moment(offer.endApply).format("DD/MM/YYYY")}
								<br />
							</Label>

							{offer.state !== "DRAFT" && (
								<div style={{ cursor: "pointer" }} title="Candidatures au total">
									<Label className="OfferItem-label" style={{ cursor: "pointer" }}>
										<Link
											to={{
												pathname: `/mon-offre/${offer.num}`,
												state: {
													ent_type: ent_type
												}
											}}
										>
											Nb. candidatures :
											<span style={{ color: "#1e43c3", fontWeight: 600 }}>{" " + offer.all_application_number}</span>
										</Link>
									</Label>
								</div>
							)}
						</div>
					</Col>

					<Col xs={12} md={3} lg={4} xl={4} className="bloc_marg">
						<StickyLabels items={offer.competences} className="OfferItem-sticky" />
					</Col>
					<Col xs={12} md={2} lg={1} xl={1} style={{ alignItems: "center", alignSelf: "center" }}>
						{offer.state === "DRAFT" && (
							<Button className="OfferItem-btn__draft" onClick={() => this.onUpdate("PUBLISHED")}>
								Publier
							</Button>
						)}
					</Col>
					<Col xs={12} md={2} lg={2} xl={2} style={{ alignItems: "center", alignSelf: "center" }}>
						<Row
							style={{
								display: "flex",
								flexDirection: "row-reverse"
							}}
							className="Row-up rou"
						>
							<div
								className="rouR"
								title="Supprimer"
								onClick={() =>
									confirmAlert({
										title: "Suppression d'une offre",
										message: "Êtes-vous sûr de vouloir supprimer cette offre ?",
										buttons: [
											{
												label: "Oui",
												onClick: () => this.onUpdate("DELETED")
											},

											{
												label: "Non",
												onClick: () => {}
											}
										]
									})}
								style={{ cursor: "pointer" }}
							>
								<Icon className="OfferItem__remove-offer" name="remove-offer" />
							</div>
							{(offer.state === "ACTIF" ||
								offer.state === "PUBLISHED" ||
								offer.state === "ON_HOLD" ||
								offer.state === "ON_HOLD_BY_ADMIN") && (
								<div
									className="rouR"
									title="Archiver"
									onClick={() => this.onUpdate("ARCHIVED")}
									style={{ cursor: "pointer" }}
								>
									<Icon className="OfferItem__archive-offer" name="archive-offer" />
								</div>
							)}

							{offer.state !== "ARCHIVED" && (
								<div className="rouR" style={{ cursor: "pointer" }} title="Modifier">
									<Link
										to={{
											pathname: `/mon-offre/${offer.num}`,
											state: {
												ent_type: ent_type
											}
										}}
									>
										<Icon className="OfferItem__edit-offer" name="edit-offer" />
									</Link>
								</div>
							)}
							<div className="rouR" style={{ cursor: "pointer" }} onClick={this._handleDuplicate} title="Dupliquer">
								<Icon className="OfferItem__dup-offer" name="offer-dup" />
							</div>
							{/* <div
                style={{ cursor: "pointer" }}
                className="rouR"
                title="Aperçu">
                <Link to={`/offre/${offer.num}`}>
                  <Icon className="OfferItem__see-offer" name="see-offer" />
                </Link>
              </div> */}
						</Row>
					</Col>
				</Row>
			</Container>
		);
	}
}
const UPDATE_OFFER_STATE = gql`
	mutation updateOfferState($id: ID!, $state: String!) {
		updateOfferState(id: $id, state: $state) {
			name
		}
	}
`;
const DUPLICATE_OFFER = gql`
	mutation duplicateOffer($id: ID!) {
		duplicateOffer(id: $id) {
			name
			num
			id
		}
	}
`;
export default withRouter(
	compose(
		graphql(UPDATE_OFFER_STATE, {
			name: "updateOfferState"
		}),
		graphql(DUPLICATE_OFFER, {
			name: "duplicateOffer"
		})
	)(FomrationItem)
);
