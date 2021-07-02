import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import Icon from "../../../shared/components/Icon";
import * as moment from "moment";
import { Link } from "react-router-dom";
import { SET_KEYVALUE } from "../../../handler/mutations.local";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { dureeFormation } from "../../../handler/utils/constants";
class OfferInfosTopFormation extends React.PureComponent {
	static propTypes = {
		offer: PropTypes.object.isRequired,
		candidat: PropTypes.object,
		setKeyName: PropTypes.func,
		fromApp: PropTypes.bool,
		getEntrepriseProfile: PropTypes.object.isRequired,
	};
	static defaultProps = {
		candidat: {},
		fromApp: false,
		offer: {},
		loading: true,
		getEntrepriseProfile: {
			ent_type: null
		}
	};
	render() {
		const { offer, fromApp, candidat } = this.props;
		const { ent_type } = this.props.getEntrepriseProfile;
		candidat && candidat.last_name
			? offer &&
			offer.name &&
			this.props
				.setKeyName({
					variables: {
						KeyValue:
							`<a href='#/offre/${offer.num} '>${offer.name}</a> ` +
							`/ <a href='#/mon-offre/${offer.num} '>Candidatures</a> ` +
							`/ ${candidat.last_name + " " + candidat.first_name}`
					}
				})
				.then(() => { })
			: offer &&
			offer.name &&
			this.props
				.setKeyName({
					variables: {
						KeyValue: offer.name
					}
				})
				.then(() => { });
		return (
			<React.Fragment>
				<Col md={12} lg={12} xl={12}>
					<Card>
						<CardBody
							className="profile__card--calendar"
							style={fromApp ? { boxShadow: "2px 2px 10px #e6e6e6" } : {}}
						>
							<Row>
								{ent_type == "entreprises" ? (
									<span className="EntrepriseDetail-competences__row-header" style={{ textTransform: "uppercase", marginLeft: 20 }}>
										{offer.name}
										<br />
										<span
											className="EntrepriseDetail-competences__row-header"
											style={{
												textTransform: "uppercase",
												marginRight: 10,
												color: "#adadad",
												fontSize: "0.9rem"
											}}
										>
											{"Offre n°" + offer.num}
										</span>{" "}
										<span style={{ color: "rgb(173, 173, 173)", fontWeight: "bold", fontSize: "small" }}>{"formation " + offer.typeFormation}</span> <br />
										<Link
											to={{
												pathname: `/associatedCanadidate/${offer.num}`,
												state: {
													offer_id: offer.id
												}
											}}
											style={{ display: "grid", marginTop: "1rem", justifyItems: "center" }}
											className="EntrepriseDetail-sticky"> Voir les CV</Link>
									</span>
								) : (
										<Link
											to={{
												pathname: `/mon-offre/${offer.num}`,
												state: {
													ent_type: "ecole"
												}
											}}
											style={{ marginLeft: 20 }}
										>
											<span className="EntrepriseDetail-competences__row-header" style={{ textTransform: "uppercase" }}>
												{offer.name}
												<br />
												<span
													className="EntrepriseDetail-competences__row-header"
													style={{
														textTransform: "uppercase",
														marginRight: 10,
														color: "#adadad",
														fontSize: "0.9rem"
													}}
												>
													{"Offre n°" + offer.num}
												</span>{" "}
												<span style={{ color: "rgb(173, 173, 173)", fontWeight: "bold", fontSize: "small" }}>{"formation " + offer.typeFormation}</span>
											</span>
										</Link>
									)}
							</Row>
						</CardBody>
					</Card>
				</Col>
				{ent_type == "ecole" && (
					<Col md={12} lg={12} xl={12}>
						<Card>
							<CardBody className="profile__card--calendar">
								<Row className="EntrepriseDetail-competences__row-header" style={{ textTransform: "uppercase" }}>
									Candidatures
								</Row>
								<p className="EntrepriseDetail-info-label__cion">
									<Icon
										className="EntrepriseDetail-icon"
										style={{ width: " 1.3rem", height: "1.3rem" }}
										name="offer-num-app-pending"
									/>
									Candidatures non traitées:{" "}
									<span className="EntrepriseDetail-info-label">
										{offer.application_number ? offer.application_number : "0"}
									</span>
								</p>
								<p className="EntrepriseDetail-info-label__cion">
									<Icon
										className="EntrepriseDetail-icon"
										style={{ width: " 1.3rem", height: "1.3rem" }}
										name="offer-num-app"
									/>
									Candidatures au total:{" "}
									<span className="EntrepriseDetail-info-label">
										{offer.all_application_number ? offer.all_application_number : "0"}
									</span>
								</p>
								<Link
									className="profile-btn__cnd"
									to={{
										pathname: `/mon-offre/${offer.num}`,
										state: {
											ent_type: "ecole"
										}
									}}
								>
									VOIR LES CANDIDATURES
								</Link>
							</CardBody>
						</Card>
					</Col>
				)}

				<Col md={12} lg={12} xl={12}>
					<Card>
						<CardBody
							className="profile__card--calendar"
							style={fromApp ? { boxShadow: "2px 2px 10px #e6e6e6" } : {}}
						>
							<Row className="EntrepriseDetail-competences__row-header" style={{ textTransform: "uppercase" }}>
								Informations
							</Row>
							<p className="EntrepriseDetail-info-label__cion">
								{offer.state == "PUBLISHED" ? (
									<div>
										<Icon className="EntrepriseDetail-icon" name="candidat-time" />
										Publication:{" "}
										<span className="EntrepriseDetail-info-label">
											{moment(offer.publishedAt).format("DD/MM/YYYY")}
										</span>
									</div>
								) : (
										<div>
											<Icon className="EntrepriseDetail-icon" name="candidat-time" />
										Création:{" "}
											<span className="EntrepriseDetail-info-label">{moment(offer.createdAt).format("DD/MM/YYYY")}</span>
										</div>
									)}
							</p>
							<p className="EntrepriseDetail-info-label__cion">
								<Icon className="EntrepriseDetail-icon" name="candidat-time" />
								Formation: Du{" "}
								<span className="EntrepriseDetail-info-label">
									{moment(offer.startEducation).format("DD/MM/YYYY")}{" "}
								</span>
								au{" "}
								<span className="EntrepriseDetail-info-label">{moment(offer.endEducation).format("DD/MM/YYYY")} </span>
							</p>
							<p className="EntrepriseDetail-info-label__cion">
								<Icon className="EntrepriseDetail-icon" name="candidat-time" />
								Période en entreprise : Du {" "}
								<span className="EntrepriseDetail-info-label">
									{moment(offer.startInternship).format("DD/MM/YYYY")}{" "}
								</span>
								au{" "}
								<span className="EntrepriseDetail-info-label">{moment(offer.endInternship).format("DD/MM/YYYY")} </span>
							</p>
							<p className="EntrepriseDetail-info-label__cion">
								<Icon className="EntrepriseDetail-icon" name="candidat-time" />
								Candidature: Du {" "}
								<span className="EntrepriseDetail-info-label">{moment(offer.startApply).format("DD/MM/YYYY")} </span>
								au <span className="EntrepriseDetail-info-label">{moment(offer.endApply).format("DD/MM/YYYY")}</span>
							</p>
							<p className="EntrepriseDetail-info-label__cion">
								<Icon className="EntrepriseDetail-icon" name="candidat-time" />
								Niveau d'étude: {" "}
								<span className="EntrepriseDetail-info-label">{offer.dureeFormation ? dureeFormation.filter(exp => exp.value === offer.dureeFormation)[0].label : "--"} </span>
							</p>
						</CardBody>
					</Card>
				</Col>
				{ent_type == "entreprises" && (
					<Col md={12} lg={12} xl={12}>
						<Card>
							<CardBody className="profile__card--calendar">
								<Row className="EntrepriseDetail-competences__row-header" style={{ textTransform: "uppercase" }}>
									information de l'école
								</Row>
								<Link
									to={{
										pathname: `/ecole/${offer.entreprise.num}`,
										state: {
											entreprise_name: offer.entreprise.name
										}
									}}
								>
									<p className="EntrepriseDetail-info-label__cion">
										<Icon
											className="EntrepriseDetail-icon"
											style={{ width: " 1.3rem", height: "1.3rem" }}
											name="offer-num-app-pending"
										/>
									Nom : <span className="EntrepriseDetail-info-label">{offer.entreprise.name}</span>
									</p>
								</Link>
								<p className="EntrepriseDetail-info-label__cion">
									<Icon
										className="EntrepriseDetail-icon"
										style={{ width: " 1.3rem", height: "1.3rem" }}
										name="offer-num-app"
									/>
									Email : <span className="EntrepriseDetail-info-label">{offer.entreprise.application_email}</span>
								</p>

								<p className="EntrepriseDetail-info-label__cion">
									<Icon
										className="EntrepriseDetail-icon"
										style={{ width: " 1.3rem", height: "1.3rem" }}
										name="offer-num-app"
									/>
									Adresse principal: <span className="EntrepriseDetail-info-label">{offer.entreprise.address}</span>
								</p>
							</CardBody>
						</Card>
					</Col>
				)}
			</React.Fragment>
		);
	}
}
const GET_ENTRPRISE = gql`
  query getEntrepriseProfile {
    getEntrepriseProfile {
      ent_type
    }
	}`
export default compose(
	graphql(SET_KEYVALUE, {
		name: "setKeyName"
	}),
	graphql(GET_ENTRPRISE, {
		options: () => ({
			fetchPolicy: "network-only"
		}),
		props: ({ data: { getEntrepriseProfile } }) => ({
			getEntrepriseProfile
		})
	})
)(OfferInfosTopFormation);
