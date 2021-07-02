import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, Col } from "reactstrap";
import { experienceConst, etudeConst } from "../../../handler/utils/constants";
import Icon from "../../../shared/components/Icon";
import Twitter from "mdi-react/TwitterIcon";
import SiteWeb from "mdi-react/LinkIcon";
import LinkedIn from "mdi-react/LinkedinIcon";
import * as moment from "moment";
import "moment/locale/fr";

class ProfilInfosTop extends React.PureComponent {
  static propTypes = {
    candidat: PropTypes.object.isRequired
  };
  render() {
    const { candidat } = this.props;
    return (
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody
            className="profile__card--calendar"
            style={{ boxShadow: "2px 2px 10px #e6e6e6" }}>
            <p className="Candidat-info-label__cion">
              <Icon className="Candidat-icon" name="candidat-test" />
              Expérience:{" "}
              <span className="Candidat-info-label">
                {candidat &&
                candidat.experience &&
                candidat.experience.length > 0
                  ? experienceConst.filter(
                      exp => exp.value === candidat.experience
                    )[0].label
                  : "--"}
              </span>
            </p>
            <p className="Candidat-info-label__cion">
              <Icon className="Candidat-icon" name="candidat-brief" />
              Métier:{" "}
              <span className="Candidat-info-label">
                {candidat.jobs && candidat.jobs.length > 0
                  ? candidat.jobs[0]
                  : "--"}
              </span>
            </p>

            {candidat && candidat.siteweb && (
              <p className="Candidat-info-label__cion">
                <SiteWeb
                  style={{ marginRight: "1rem", width: 18, height: 24 }}
                />
                Site web personel:{" "}
                <span className="Candidat-info-label">
                  <a target="blank" href={candidat.siteweb}>
                    {candidat.siteweb}
                  </a>
                </span>
              </p>
            )}
            {candidat && candidat.linkedin && (
              <p className="Candidat-info-label__cion">
                <LinkedIn
                  style={{ marginRight: "1rem", width: 18, height: 24 }}
                />
                LinkedIn:{" "}
                <span className="Candidat-info-label">
                  <a target="blank" href={candidat.linkedin}>
                    {candidat.linkedin}
                  </a>
                </span>
              </p>
            )}
            {candidat && candidat.twitter && (
              <p className="Candidat-info-label__cion">
                <Twitter
                  style={{ marginRight: "1rem", width: 18, height: 24 }}
                />
                Twitter:{" "}
                <span className="Candidat-info-label">
                  <a target="blank" href={candidat.twitter}>
                    {candidat.twitter}
                  </a>
                </span>
              </p>
            )}
            <p className="Candidat-info-label__cion">
              <Icon className="Candidat-icon" name="candidat-tel" />
              Téléphone:{" "}
              <span className="Candidat-info-label">
                {candidat.tel ? candidat.tel : "--"}
              </span>
            </p>
            <p className="Candidat-info-label__cion">
              <Icon className="Candidat-icon" name="candidat-time" />
              Disponibilité:{" "}
              <span className="Candidat-info-label">
                {candidat.disponibility
                  ? moment(candidat.disponibility)
                      .startOf("day")
                      .diff(moment().startOf("day"), "days") > 0
                    ? " Dans " +
                      moment(candidat.disponibility)
                        .startOf("day")
                        .diff(moment().startOf("day"), "days") +
                      " jours"
                    : " Immédiate"
                  : " --"}
              </span>
            </p>
            <p className="Candidat-info-label__cion">
              <Icon className="Candidat-icon" name="candidat-etude" />
              Niveau d'étude:{" "}
              <span className="Candidat-info-label">
                {candidat && candidat.etude && candidat.etude.length > 0
                  ? etudeConst.filter(exp => exp.value === candidat.etude)[0]
                      .label
                  : " --"}
              </span>
            </p>
            <p className="Candidat-info-label__cion">
              <Icon className="Candidat-icon" name="cv-map" />
              Adresse:{" "}
              <span className="Candidat-info-label">
                {candidat.address ? candidat.address : "--"}
              </span>
            </p>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default ProfilInfosTop;
