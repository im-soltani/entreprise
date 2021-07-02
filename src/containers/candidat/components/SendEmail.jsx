import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  Input,
  Row,
  FormGroup,
  Label
} from "reactstrap";
import PropTypes from "prop-types";
import axios from "axios";
import Alert from "../../../handler/utils/Alert";
import { BASE_URL } from "../../../handler/utils/constants";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import EditorHtml from "../../../shared/components/Editor";

class SendEmail extends React.Component {
  static propTypes = {
    toggle: PropTypes.func,
    modal: PropTypes.bool,
    id: PropTypes.string,
    error: PropTypes.object,
    getEntrepriseProfile: PropTypes.object,
    getEmails: PropTypes.array,
    refus: PropTypes.bool,
    offer_name: PropTypes.string,
    offer_num: PropTypes.number,
    num: PropTypes.number
  };

  static defaultProps = {
    error: null,
    getEntrepriseProfile: null,
    getEmails: null
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: props.modal,
      email:
        props.getEntrepriseProfile &&
          props.getEntrepriseProfile.application_email
          ? props.getEntrepriseProfile.application_email
          : null,
      message: null,
      subject: null,
      loading: false
    };

    this._toggle = this._toggle.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.getEntrepriseProfile &&
      nextProps.getEntrepriseProfile.application_email &&
      nextProps.getEntrepriseProfile.application_email !== this.state.email
    )
      this.setState({
        email: nextProps.getEntrepriseProfile.application_email
      });
    if (nextProps.modal !== this.props.modal)
      this.setState({ modal: nextProps.modal });
    if (
      nextProps.refus &&
      nextProps.getEmails &&
      nextProps.getEmails.length > 0
    )
      this.setState({
        message: nextProps.getEmails[0].template,
        subject: nextProps.getEmails[0].subject
      });
  }

  _toggle() {
    this.props.toggle();
  }

  onResponse = cb => {
    this.setState(
      {
        loading: false
      },
      () => {
        cb();
      }
    );
  };
  setTemplateRef = ref => {
    if (ref) this.setState({ message: ref });
  };

  onChangeSubject = e => this.setState({ subject: e.target.value });
  onChangeEmail = e => this.setState({ email: e.target.value });

  handleSubmit = () => {
    if (!this.state.loading) {
      if (this.state.subject && this.state.message) {
        this.setState({ loading: true });
        const token = localStorage.getItem("token");
        axios.defaults.headers.authorization = token;
        axios
          .post(BASE_URL + "/mailer", {
            subject: this.state.subject,
            body: this.state.message,
            id: this.props.id,
            email: this.state.email,
            refus: this.props.refus,
            offer_name: this.props.offer_name,
            offer_num: this.props.offer_num,
            num: this.props.num
          })
          .then(() => {
            Alert.success("Votre email a été envoyé avec succès.");
            this.setState({ loading: null, message: null, subject: null });
            this._toggle();
          });
      } else {
        Alert.success("Veuillez remplir tous les champs");
      }
    }
  };

  render() {
    const { modal, loading } = this.state;
    return (
      <div>
        <Modal
          isOpen={modal}
          toggle={this._toggle}
          className="ModalSahreCV"
          style={{ marginTop: "4%", width: "100%", maxWidth: "45% " }}
        >
          <ModalHeader
            toggle={this._toggle}
            style={{ textTransform: "uppercase" }}
          >
            {this.props.refus
              ? "Email de refus personalisé"
              : "Contacter le candidat"}
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col style={{ justifyContent: "center", marginTop: "1em" }}>
                <FormGroup className="ModalCV-group__form">
                  <Label className="ModalCV-group__label" for="last_name">
                    Sujet
                  </Label>
                  <Input
                    className="ModalCV-group__input"
                    placeholder="Sujet..."
                    type="text"
                    style={{ minHeight: 50 }}
                    value={this.state.subject}
                    onChange={this.onChangeSubject}
                  />
                </FormGroup>
                <FormGroup className="ModalCV-group__form">
                  <Label className="ModalCV-group__label" for="last_name">
                    Email d'envoi
                  </Label>
                  <Input
                    className="ModalCV-group__input"
                    placeholder="Email d'envoi"
                    type="text"
                    style={{ minHeight: 50 }}
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                  />
                </FormGroup>
                <FormGroup className="ModalCV-group__form">
                  <Label className="ModalCV-group__label" for="first_name">
                    Message
                  </Label>
                  <EditorHtml
                    description={this.state.message}
                    placeholder={"Saisissez votre message..."}
                    setDescriptionRef={this.setTemplateRef}
                  />
                </FormGroup>
                <FormGroup
                  className="ModalCV-group__form mail_css"
                >
                  <Button
                    className="ModalCV-cancel__btn bnt"
                    style={{ height: "unset", width: "40%" }}
                    onClick={loading ? null : this._toggle}
                  >
                    {loading ? "En cours" : "Annuler"}
                  </Button>
                  <Button
                    className="ModalCV-add__btn bnt"
                    style={{ width: "40%" }}
                    onClick={loading ? null : this.handleSubmit}
                  >
                    {loading ? "En cours" : "Envoyer"}
                  </Button>
                </FormGroup>
                <span
                  style={{
                    color: "gray",
                    fontSize: "1em",
                    padding: "12px 14px",
                    display: "contents",
                    textAlign: "justify"
                  }}
                >
                  NB: L'adresse utilisée pour l'envoi et la réception des emails
                  est celle que vous avez renseigné dans votre compte pour la
                  gestion des candidatures (
                  {this.props.getEntrepriseProfile &&
                    this.props.getEntrepriseProfile.application_email}
                  )
                  {this.props.refus && (
                    <span>
                      <br />
                      *Les champs entre {"{{}}"} seront remplis automatiquement
                      lors de l'envoi:
                      <br />
                      {"*{{prenom}}"} : le prénom du candidat
                      <br />
                      {"*{{nom}}"} : le nom du candidat
                      <br />
                      {"*{{nom_offre}}"} : le nom de l'offre
                      <br />
                      {"*{{num_offre}}"} : le numéro de l'offre
                      <br />
                    </span>
                  )}
                </span>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const GET_ENTRPRISE = gql`
  query getEntrepriseProfile {
    getEntrepriseProfile {
      application_email
    }
  }
`;
const GET_EMAILS = gql`
  query getEmails {
    getEmails {
      id
      name
      template
      subject
    }
  }
`;

export default compose(
  graphql(GET_ENTRPRISE, {
    options: () => ({
      fetchPolicy: "cache-and-network"
    }),
    props: ({ data: { loading, error, getEntrepriseProfile } }) => ({
      loading,
      error,
      getEntrepriseProfile
    })
  }),
  graphql(GET_EMAILS, {
    options: () => ({
      fetchPolicy: "cache-and-network"
    }),
    props: ({ data: { loading, error, getEmails } }) => ({
      loading,
      error,
      getEmails
    })
  })
)(SendEmail);
