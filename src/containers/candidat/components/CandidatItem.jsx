import HeartIcon from "mdi-react/HeartOutlineIcon";
import PlusIcon from "mdi-react/PlusIcon";
import * as moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import Alert from "../../../handler/utils/Alert";
import { BASE_URL, experienceConst } from "../../../handler/utils/constants";
import Button from "../../../shared/components//Button";
import Icon from "../../../shared/components//Icon";
import AssociateCandidat from "./AssociateCandidat";
import CVPreview from "./CVPreview";
import DownloadCandidat from "./DownloadCandidat";
import SendEmail from "./SendEmail";
import ShareCandidat from "./ShareCandidat";
const logo = `${process.env.PUBLIC_URL}/img/images/logo-placeholder.jpeg`;

class CandidatItem extends React.PureComponent {
  static propTypes = {
    candidat: PropTypes.object,
    shared: PropTypes.bool,
    ass: PropTypes.bool,
    elastic: PropTypes.bool,
  };

  static defaultProps = {
    candidat: {},
    shared: false,
    ass: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      modalShare: false,
      modalDownload: false,
      modalAssociate: false,
      modalCV: false,
      src:
        props.elastic == false
          ? props.candidat.profile_pic_url
          : BASE_URL + props.candidat.profile_pic_url,
    };
    this.toggleAssociate = this.toggleAssociate.bind(this);
    this.toggleShare = this.toggleShare.bind(this);
    this.toggleDownload = this.toggleDownload.bind(this);
    this.toggleCV = this.toggleCV.bind(this);
    this.toggleSend = this.toggleSend.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
  }

  toggleAssociate() {
    this.setState({
      modalAssociate: !this.state.modalAssociate,
    });
  }

  toggleShare() {
    this.setState({
      modalShare: !this.state.modalShare,
    });
  }
  toggleDownload() {
    this.setState({
      modalDownload: !this.state.modalDownload,
    });
  }

  toggleCV() {
    this.setState({
      modalCV: !this.state.modalCV,
    });
  }

  toggleSend() {
    this.setState({
      modalSend: !this.state.modalSend,
    });
  }
  onOpenModal = (action) => {
    if (action === "share") {
      if (this.props.candidat.sharedcv) {
        Alert.warning("Vous avez déjà partagé ce candidat.");
      } else this.setState({ modalShare: !this.state.modalShare });
    }
    if (action === "download") {
      let get = false;
      this.props.candidat.entreprises.map((entreprise) => {
        if (entreprise.id === localStorage.getItem("id")) {
          get = true;
          Alert.warning("Vous avez déjà ce candidat dans vos cv.");
        }
      });
      if (get === false) {
        this.setState({ modalDownload: !this.state.modalDownload });
      }
    }
    if (action === "associate") {
      this.setState({ modalAssociate: !this.state.modalAssociate });
    }
    if (action === "cv") {
      this.setState({ modalCV: !this.state.modalCV });
    }
  };
  message = () => {
    Alert.warning("Le système d'envoi d'emails n'est pas encore fonctionnel.");
  };
  getNote = (entreprises) => {
    let rating = 0;
    if (entreprises) {
      entreprises.map((ele) => {
        rating = ele.rating + rating;
      });

      return Math.trunc(rating / entreprises.length);
    } else return rating;
  };
  getRecived = (candidat) => {
    let recieved = false;
    if (candidat && candidat.entreprises) {
      candidat.entreprises.map((ele) => {
        if (ele.id.toString() === localStorage.getItem("id")) {
          recieved = ele.recieved;
        }
      });

      return recieved;
    } else return recieved;
  };
  getFavoris = (candidat) => {
    let isFavoris = false;
    if (candidat && candidat.entreprises) {
      candidat.entreprises.map((ele) => {
        if (ele.id.toString() === localStorage.getItem("id")) {
          isFavoris = ele.isFavoris;
        }
      });

      return isFavoris;
    } else return isFavoris;
  };
  render() {
    const { candidat, ass, elastic } = this.props;
    const {
      modalAssociate,
      modalShare,
      modalCV,
      modalDownload,
      modalSend,
      src,
    } = this.state;
    const id = candidat._id ? candidat._id : candidat.id;
    return (
      <Container key={id} className="MyCV">
        <ShareCandidat
          modal={modalShare}
          toggle={this.toggleShare}
          id={id}
          recieved={this.getRecived(candidat)}
        />
        <DownloadCandidat
          modal={modalDownload}
          toggle={this.toggleDownload}
          id={id}
        />
        <CVPreview
          file={elastic == false ? candidat.cv : BASE_URL + candidat.cv}
          modal={modalCV}
          toggle={this.toggleCV}
        />
        <AssociateCandidat
          modal={modalAssociate}
          toggle={this.toggleAssociate}
          id={id}
        />
        <SendEmail modal={modalSend} toggle={this.toggleSend} id={id} />
        <Row>
          <Col md={6} lg={6} xl={5} sx={12} style={{ display: "flex" }}>
            <Col md={3} lg={3} xl={3} sx={12} className="MyCV-div__profile">
              {this.getFavoris(candidat) && (
                <div
                  className={
                    candidat.profile_pic_url &&
                    candidat.profile_pic_url !== "undefined"
                      ? "heart2"
                      : "heart"
                  }>
                  <HeartIcon
                    style={{
                      color: "white",
                      width: 19,
                    }}
                  />
                </div>
              )}
              {candidat.profile_pic_url &&
              candidat.profile_pic_url !== "undefined" ? (
                <img
                  className={"MyCV-profile"}
                  src={src}
                  onError={() => {
                    this.setState({ src: logo });
                  }}
                  alt={`${candidat.last_name}`}
                />
              ) : (
                <div className={"MyCV-letters-div"}>
                  <div className="MyCV-letters">
                    {`${`${candidat.last_name.charAt(
                      0
                    )}${candidat.first_name.charAt(0)}`}`.toUpperCase()}
                  </div>
                </div>
              )}
            </Col>
            <Col md={9} lg={9} xl={9} sx={12} className="MyCV-middle">
              <span className="MyCV-label__name">
                <Link to={`/candidat/${candidat.num}`}>
                  <span>{candidat.last_name + " " + candidat.first_name}</span>
                </Link>
              </span>
              {candidat.jobs && candidat.jobs.length > 0 && <br />}
              {candidat.jobs &&
                candidat.jobs.length > 0 && (
                  <span className="MyCV-label" style={{ color: "#426cc1" }}>
                    {candidat.jobs[0]}
                  </span>
                )}
              {candidat &&
                candidat.experience &&
                candidat.experience.length > 0 && <br />}
              {candidat &&
                candidat.experience &&
                candidat.experience.length > 0 && (
                  <span className="MyCV-label">
                    Expérience :{" "}
                    <span className="MyCV-label" style={{ color: "#426cc1" }}>
                      {
                        experienceConst.filter(
                          (exp) => exp.value === candidat.experience
                        )[0].label
                      }
                    </span>
                  </span>
                )}
              {candidat.disponibility && <br />}
              {candidat.disponibility && (
                <span className="MyCV-label">
                  Disponibilité :{" "}
                  <span className="MyCV-label" style={{ color: "#426cc1" }}>
                    {moment(candidat.disponibility)
                      .startOf("day")
                      .diff(moment().startOf("day"), "days") > 0
                      ? " Dans " +
                        moment(candidat.disponibility)
                          .startOf("day")
                          .diff(moment().startOf("day"), "days") +
                        " jours"
                      : " Immédiate"}
                  </span>
                </span>
              )}
              <br />
              {candidat.city && (
                <span className="MyCV-label__city">
                  <Icon className="MyCV-map" name="cv-map" />
                  {candidat.city}
                </span>
              )}
            </Col>
          </Col>
          <Col md={6} lg={6} xl={4} sx={12}>
            <Row md={2} style={{ marginBottom: "1rem" }}>
              {candidat.is_blocked_by_admin && (
                <span className="blocked">Suspendu par DL</span>
              )}
              {candidat.is_blocked && (
                <span className="blocked">Pas à l'écoute du marché</span>
              )}
            </Row>
            <Row md={12}>
              {candidat.competences && candidat.competences.length > 0 ? (
                <div
                  style={{ display: "flex", flexWrap: "wrap" }}
                  className="MyCV-marginTopButtom">
                  {candidat.competences &&
                    candidat.competences.map((item, index) => {
                      return (
                        <label key={index} className="MyCV-sticky">
                          {item}
                        </label>
                      );
                    })}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "0.85rem",
                    textAlign: "center",
                    backgroundColor: "#f1f1f1",
                    padding: "5px 0px",
                    color: "#a2a2a2",
                    borderRadius: 24,
                    width: "fit-content",
                    padding: " 8px 12px ",
                  }}
                  className="MyCV-marginTopButtom">
                  Aucune compétence ajoutée
                </div>
              )}
            </Row>
          </Col>
          <Col
            md={9}
            lg={9}
            xl={2}
            sx={12}
            className="btnR"
            style={{
              flexDirection: "column",
              margin: "auto",
              textAlign: "center",
              alignItems: "center",
              padding: "0px 6px",
              fontSize: "14px",
              display: "flex",
            }}>
            <Button
              className="MyCV-btn__cv"
              size="lg"
              text="Aperçu du CV"
              color="primary"
              style={{ padding: 10, margin: 0 }}
              onClick={() => this.onOpenModal("cv")}
            />
            {candidat.sharedcv && candidat.sharedby
              ? candidat.sharedby === "Diffusés par l'équipe DL"
                ? "Diffusé par DL"
                : candidat.sharedby === "Partagés par les adhérents"
                  ? "Partagé par les adhérents"
                  : "Candidature spontanée"
              : ""}
            <br />
            {candidat.sharedcv &&
              candidat.sharedAt && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    marginTop: 5,
                    color: "#295ebe",
                    fontWeight: 500,
                  }}>
                  Partagé le {moment(candidat.sharedAt).format("DD/MM/YYYY")}
                </span>
              )}
          </Col>

          <Col md={3} lg={3} xl={1} sx={12} className="MyCV-buttons">
            {!candidat.is_blocked &&
              !candidat.is_blocked_by_admin && (
                <div style={{ display: "contents" }}>
                  {candidat.sharedcv ? (
                    <button
                      title="Ajouter à mes cv"
                      className="MyCV-btn__top"
                      onClick={() => this.onOpenModal("download")}>
                      <PlusIcon style={{ color: "white" }} />
                    </button>
                  ) : (
                    <button
                      title="Partager"
                      className="MyCV-btn__top"
                      onClick={() => this.onOpenModal("share")}>
                      <PlusIcon style={{ color: "white" }} />
                    </button>
                  )}
                  <button
                    title="Contacter"
                    className="MyCV-btn__middle"
                    onClick={() => this.toggleSend()}>
                    <Icon className="MyCV-envelope" name="cv-envelope" />
                  </button>
                  {ass == false && (
                    <button
                      title="Associer à une offre"
                      className="MyCV-btn__bottom"
                      onClick={() => this.onOpenModal("associate")}>
                      <Icon className="MyCV-link" name="cv-link" />
                    </button>
                  )}
                </div>
              )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CandidatItem;
