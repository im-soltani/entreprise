import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody } from "reactstrap";

class ProfilCompetences extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.array.isRequired
  };

  render() {
    const { activity } = this.props;
    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody className="profile__card--calendar">
            <Row
              className="EntrepriseDetail-competences__row-header"
              style={{ textTransform: "uppercase" }}
            >
              Activités
            </Row>
            <Row className="EntrepriseDetail-competences__row">
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {activity.map((item, index) => {
                  return (
                    <label key={index} className="EntrepriseDetail-sticky">
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
