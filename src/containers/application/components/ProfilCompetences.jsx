import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody } from "reactstrap";

class ProfilCompetences extends React.PureComponent {
  static propTypes = {
    competences: PropTypes.array.isRequired
  };

  render() {
    const { competences } = this.props;
    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody
            className="profile__card--calendar"
            style={{ boxShadow: "2px 2px 10px #e6e6e6" }}>
            <Row
              className="Candidat-competences__row-header"
              style={{ textTransform: "uppercase" }}>
              Compétences
            </Row>
            <Row
              className="Candidat-competences__row"
              style={{ height: "auto", padding: "unset" }}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {competences.map((item, index) => {
                  return (
                    <label key={index} className="Candidat-sticky">
                      {item}
                    </label>
                  );
                })}
              </div>
            </Row>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default ProfilCompetences;
