import React from "react";
import PropTypes from "prop-types";
import { Container, Label, Row, Col } from "reactstrap";
import * as moment from "moment";
import { Link } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import StickyLabels from "../../../shared/components/StickyLabels";
class FormationItem extends React.PureComponent {
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
		search: ""
	};

	render() {
		const { offer } = this.props;
		return (
			<Container key={offer.num} className="OfferItem">
				<Row>
					<Col xs={12} md={5} lg={5} xl={5}>
						<div style={{ marginLeft: 25 }} className="bloc_t">
							<Label className="OfferItem-name">
								<Link
									to={{
										pathname: `/formation/${offer.num}`,
										state: {
											ent_type: "ecole",
										}
									}}
								>
									{offer.name}
								</Link>
							</Label>
							<Label
								className="OfferItem-label"
								style={{
									color: "black",
									fontWeight: "bold"
								}}
							>
								{offer.entreprise.name} - <span style={{ color: "#828181" }}>{offer.typeFormation}</span>
							</Label>
							<Label
								className="OfferItem-label"
								style={{
									color: "#828181"
								}}
							>
								Formation : Du {moment(offer.startEducation).format("DD/MM/YYYY")} Au{" "}
								{moment(offer.endEducation).format("DD/MM/YYYY")}
								<br />
							</Label>

							<Label
								className="OfferItem-label"
								style={{
									color: "#828181"
								}}
							>
								Période en entreprise: <span style={{ fontWeight: "bold" }}>Du {moment(offer.startInternship).format("DD/MM/YYYY")} Au{" "}
									{moment(offer.endInternship).format("DD/MM/YYYY")}</span>
								<br />
							</Label>
						</div>
					</Col>
					<Col xs={12} md={5} lg={4} xl={4} style={{ alignItems: "center", alignSelf: "center" }}>
						<StickyLabels items={offer.competences} className="OfferItem-sticky" />
					</Col>
					<Col xs={12} md={1} lg={1} xl={1} className={"d-flex align-items-center"} />

					<Col xs={12} md={2} lg={2} xl={2} className={"d-flex align-items-center"}>
						<Link
							to={{
								pathname: `/associatedCanadidate/${offer.num}`,
								state: {
									offer_id: offer.id,
									title: offer.name
								}
							}}
							className="OfferItem-sticky"
							style={{ marginTop: 20 }}
						>
							Voir les CV
						</Link>
					</Col>
				</Row>
			</Container>
		);
	}
}
export default FormationItem;