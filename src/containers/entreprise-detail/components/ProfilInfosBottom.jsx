import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import Icon from "../../../shared/components/Icon";
class ProfilInfosBottom extends React.PureComponent {
	static propTypes = {
		entreprise: PropTypes.object.isRequired
	};
	render() {
		const { entreprise } = this.props;
		return (
			<Col md={12} lg={12} xl={12} style={{ height: 415 }}>
				<Card>
					<CardBody className="profile__card--calendar">
						<Row className="EntrepriseDetail-competences__row-header" style={{ textTransform: "uppercase" }}>
							Adresse
						</Row>
						<p className="EntrepriseDetail-info-label__cion">
							<Icon className="EntrepriseDetail-icon" name="cv-map" />

							<span className="EntrepriseDetail-info-label">{entreprise.address ? entreprise.address : "--"}</span>
						</p>
					</CardBody>
				</Card>
			</Col>
		);
	}
}
export default ProfilInfosBottom;
