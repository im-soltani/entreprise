import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col, Row } from "reactstrap";
import Icon from "../../../shared/components/Icon";
import * as moment from "moment";
import { contratConst } from "../../../handler/utils/constants";
import { Link } from "react-router-dom";
import { SET_KEYVALUE } from "../../../handler/mutations.local";
import { graphql } from "react-apollo";

class OfferInfosTop extends React.PureComponent {
  static propTypes = {
    offer: PropTypes.object.isRequired,
    candidat: PropTypes.object,
    setKeyName: PropTypes.func,
    show: PropTypes.bool,
    fromApp: PropTypes.bool
  };
  static defaultProps = {
    show: true,
    candidat: {},
    fromApp: false,
    offer: {}
  };
  render() {
    const { offer, show, fromApp, candidat } = this.props;
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
              style={fromApp ? { boxShadow: "2px 2px 10px #e6e6e6" } : {}}>
              <Row>
                <Link to={`/mon-offre/${offer.num}`} style={{ marginLeft: 20 }}>
                  <span
                    className="EntrepriseDetail-competences__row-header"
                    style={{ textTransform: "uppercase" }}>
                    {offer.name}
                    <br />
                    <span
                      className="EntrepriseDetail-competences__row-header"
                      style={{
                        textTransform: "uppercase",
                        marginRight: 10,
                        color: "#adadad",
                        fontSize: "0.9rem"
                      }}>
                      {"Offre n°" + offer.num}
                    </span>{" "}
                  </span>
                </Link>
              </Row>
            </CardBody>
          </Card>
        </Col>
        {show && (
          <Col md={12} lg={12} xl={12}>
            <Card>
              <CardBody className="profile__card--calendar">
                <Row
                  className="EntrepriseDetail-competences__row-header"
                  style={{ textTransform: "uppercase" }}>
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
                    {offer.all_application_number
                      ? offer.all_application_number
                      : "0"}
                  </span>
                </p>
                <Link
                  className="profile-btn__cnd"
                  to={{
                    pathname: `/mon-offre/${offer.num}`,
                    state: {
                      ent_type: "entreprise"
                    }
                  }}>
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
              style={fromApp ? { boxShadow: "2px 2px 10px #e6e6e6" } : {}}>
              <Row
                className="EntrepriseDetail-competences__row-header"
                style={{ textTransform: "uppercase" }}>
                Informations
              </Row>
              <p className="EntrepriseDetail-info-label__cion">
                {offer.state == "PUBLISHED" ? <div>
                  <Icon className="EntrepriseDetail-icon" name="candidat-time" />
                Date de publication:{" "}
                  <span className="EntrepriseDetail-info-label">
                    {moment(offer.publishedAt).format("DD/MM/YYYY")}
                  </span>
                </div> : <div>
                    <Icon className="EntrepriseDetail-icon" name="candidat-time" />
                  Date de création:{" "}
                    <span className="EntrepriseDetail-info-label">
                      {moment(offer.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </div>}
              </p>
              <p className="EntrepriseDetail-info-label__cion">
                <Icon className="EntrepriseDetail-icon" name="candidat-time" />
                Date d'expiration:{" "}
                <span className="EntrepriseDetail-info-label">
                  {moment(offer.expiredAt).format("DD/MM/YYYY")}
                </span>
              </p>
              <p className="EntrepriseDetail-info-label__cion">
                <Icon className="EntrepriseDetail-icon" name="cv-map" />
                Adresse:{" "}
                <span className="EntrepriseDetail-info-label">
                  {offer.address
                    ? offer.address
                    : offer.entreprise && offer.entreprise.address
                      ? offer.entreprise.address
                      : "--"}
                </span>
              </p>

              <p className="EntrepriseDetail-info-label__cion">
                <Icon
                  className="EntrepriseDetail-icon"
                  name="candidat-contract"
                />
                Contrat:{" "}
                <span className="EntrepriseDetail-info-label">
                  {offer.contract
                    ? contratConst.filter(
                      exp => exp.value === offer.contract
                    )[0].label
                    : "--"}
                </span>
              </p>

              {offer.dureeContract &&
                <p className="EntrepriseDetail-info-label__cion">
                  <Icon
                    className="EntrepriseDetail-icon"
                    name="candidat-contract"
                  />
                  Durée du contrat:{" "}
                  <span className="EntrepriseDetail-info-label">
                    {offer.dureeContract} Mois
                  </span>
                </p>}

              <p className="EntrepriseDetail-info-label__cion">
                <Icon className="EntrepriseDetail-icon" name="offer-salary" />
                Salaire:{" "}
                <span className="EntrepriseDetail-info-label">
                  {offer.salary_type === "Précisez le salaire (en KE)"
                    ? "Entre " +
                    offer.salary[0] +
                    " (KE) et " +
                    offer.salary[1] +
                    " (KE)"
                    : offer.salary_type}
                </span>
              </p>
            </CardBody>
          </Card>
        </Col>
      </React.Fragment>
    );
  }
}

export default graphql(SET_KEYVALUE, {
  name: "setKeyName"
})(OfferInfosTop);
