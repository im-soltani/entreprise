import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody } from "reactstrap";

class OfferCompetences extends React.PureComponent {
  static propTypes = {
    competences: PropTypes.array.isRequired,
    fromApp: PropTypes.bool,
    title:PropTypes.string.isRequired
  };
  static defaultProps = {
    fromApp: false,
    title:"Compétences"
  };
  render() {
    const { competences, fromApp,title } = this.props;
    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody
            className="profile__card--calendar"
            style={fromApp ? { boxShadow: "2px 2px 10px #e6e6e6" } : {}}>
            <Row
              className="EntrepriseDetail-competences__row-header"
              style={{ textTransform: "uppercase" }}>
              {title}
            </Row>
            <Row className="EntrepriseDetail-competences__row">
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {competences.map(item => {
                  return (
                    <label key={item.id} className="EntrepriseDetail-sticky">
                      {item.name}
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

export default OfferCompetences;
