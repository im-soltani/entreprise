import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import Icon from "../../../shared/components/Icon";

class ProfilInfosTop extends React.PureComponent {
  static propTypes = {
    entreprise: PropTypes.object.isRequired
  };
  render() {
    const { entreprise } = this.props;
    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody className="profile__card--calendar">
            <Row
              className="EntrepriseDetail-competences__row-header"
              style={{ textTransform: "uppercase" }}
            >
              Contact
            </Row>
            <p className="EntrepriseDetail-info-label__cion">
              <Icon className="EntrepriseDetail-icon" name="cv-envelope" />
              Email:{" "}
              <span className="EntrepriseDetail-info-label">
                {entreprise.application_email
                  ? entreprise.application_email
                  : entreprise.profile.email}
              </span>
            </p>
            <p className="EntrepriseDetail-info-label__cion">
              <Icon className="EntrepriseDetail-icon" name="candidat-tel" />
              Téléphone:{" "}
              <span className="EntrepriseDetail-info-label">
                {entreprise.tel ? entreprise.tel : "--"}
              </span>
            </p>
            <p className="EntrepriseDetail-info-label__cion">
              <Icon className="EntrepriseDetail-icon" name="cv-link" />
              Site web:{" "}
              <span className="EntrepriseDetail-info-label">
                {entreprise.website ? entreprise.website : "--"}
              </span>
            </p>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default ProfilInfosTop;
