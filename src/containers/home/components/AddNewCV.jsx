import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  Row,
  FormGroup,
  FormFeedback,
  Input,
  Label
} from "reactstrap";
import PropTypes from "prop-types";
import PdfPreview from "../../../shared/components/PdfPreview";
import Checkbox from "../../../shared/components/Checkbox";
import { invalidEmail } from "../../../handler/errorMessages.json";
import { EMAIL_REGEX } from "../../../handler/utils/constants";
import Alert from "../../../handler/utils/Alert";
import { checkEmail } from "../../../handler/api/auth";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";

const defaultErrors = {
  last_name: null,
  first_name: null,
  email: null,
  sharedcv: null
};

class AddNewCV extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    toggle: PropTypes.func,
    mutate: PropTypes.func,
    modal: PropTypes.bool,
    file: PropTypes.object,
    getEntrepriseProfile: PropTypes.object.isRequired,
  };

  first_name = null;
  last_name = null;
  email = null;

  constructor(props) {
    super(props);
    this.state = {
      modal: props.modal,
      file: props.file,
      mycv: true,
      sharedcv: false,
      recieved: false,
      rating: 1,
      loading: false,
      errors: {
        ...defaultErrors
      }
    };

    this._toggle = this._toggle.bind(this);
  }
  static defaultProps = {
    loading: true,
    getEntrepriseProfile: {
      name: "Mon compte",
      ent_type: null
    }
  };
  setRef = ref => {
    if (ref) this[ref.name] = ref;
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.modal !== this.props.modal)
      this.setState({ modal: nextProps.modal });
    if (nextProps.file !== this.props.file)
      this.setState({ file: nextProps.file });
  }

  _toggle() {
    this.props.toggle();
  }
  getRating = rating => {
    this.setState({ rating });
  };

  handleChecked = (checked, name) => {
    this.setState({
      [name]: checked
    });
  };

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

  handleSubmit = async () => {
    if (!this.state.loading) {
      const first_name = this.first_name.value.trim();
      const last_name = this.last_name.value.trim();
      const email = this.email.value.trim();
      const mycv = this.state.mycv;
      const sharedcv = this.state.sharedcv;
      const recieved = this.state.recieved;
      const file = this.state.file;
      const rating = this.state.rating;
      let uid = null;
      let check = false;
      const errors = {
        ...defaultErrors
      };
      if (first_name.length < 1)
        errors.first_name =
          "Le prénom est obligatoire et doit comporter au moins un caractère";
      if (last_name.length < 1)
        errors.last_name =
          "Le nom est obligatoire et doit comporter au moins un caractère";
      if (!EMAIL_REGEX.test(email)) errors.email = invalidEmail;
      else
        await checkEmail({ email })
          .then(({ success, message, user }) => {
            if (!success) {
              console.log("user", user);
              if (!mycv || mycv && sharedcv || user && user.ref != "candidats") { errors.email = message }
              check = true;
              uid = user._id;
            } else check = false;
          })
          .catch(() => { });
      if (file === null) errors.file = "choisir un cv pdf";
      if (!mycv && !sharedcv)
        errors.sharedcv = "If faut choisir soit mes CV ou CV partagés";
      if (
        errors.first_name ||
        errors.last_name ||
        errors.email ||
        errors.file ||
        errors.sharedcv
      ) {
        this.setState({ errors: { ...errors } });
      } else {
        this.setState({ loading: true, errors });
        this.props
          .mutate({
            variables: {
              cv: file,
              email,
              mycv,
              sharedcv,
              recieved,
              rating,
              existmail: check,
              uid,
              input: {
                first_name,
                last_name
              }
            }
          })
          .then((data) => {
            this.onResponse(() => {
              console.log("dataaaa", data);
              Alert.success("Le candidat a été ajouté avec succès.");
              this._toggle();
              this.props.history.push("/rechercher-un-candidat");
            });
          })
          .catch(e => {
            this.onResponse(() => {
              if (e && e.graphQLErrors) {
                Alert.error("Ce cv est deja partie de votre CVthèque.");
                console.log(e)
              };
            });
          });
      }
    }
  };

  render() {
    const { modal, file, errors, loading } = this.state;
    const { ent_type } = this.props.getEntrepriseProfile;
    return (
      <Modal isOpen={modal} toggle={this._toggle} className="ModalCV">
        <ModalHeader
          toggle={this._toggle}
          style={{ textTransform: "uppercase" }}
        >
          Ajout DU CV
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6} xl={6} lg={6} xs={12} className="dashed">
              <FormGroup>
                <span style={{ color: "red" }}>{errors.file}</span>
                <PdfPreview file={file} fromPC={true} />
              </FormGroup>
            </Col>
            <Col
              md={6}
              xl={6}
              lg={6}
              xs={12}
              style={{ justifyContent: "center", marginTop: "3em" }}
            >
              <FormGroup className="ModalCV-group__form">
                <Label className="ModalCV-group__label" for="last_name">
                  Nom
                </Label>
                <Input
                  className="ModalCV-group__input"
                  innerRef={this.setRef}
                  type="text"
                  name="last_name"
                  invalid={!!errors.last_name}
                />
                <FormFeedback>{errors.last_name}</FormFeedback>
              </FormGroup>
              <FormGroup className="ModalCV-group__form">
                <Label className="ModalCV-group__label" for="first_name">
                  Prénom
                </Label>
                <Input
                  className="ModalCV-group__input"
                  innerRef={this.setRef}
                  type="text"
                  name="first_name"
                  invalid={!!errors.first_name}
                />
                <FormFeedback>{errors.first_name}</FormFeedback>
              </FormGroup>

              <FormGroup className="ModalCV-group__form">
                <Label className="ModalCV-group__label" for="email">
                  Email
                </Label>
                <Input
                  className="ModalCV-group__input"
                  innerRef={this.setRef}
                  type="text"
                  name="email"
                  invalid={!!errors.email}
                />
                <FormFeedback>{errors.email}</FormFeedback>
              </FormGroup>
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  margin: "auto"
                }}
              />
              <FormGroup
                check
                className="ModalCV-group__form"
                style={{
                  textAlign: "center",
                  marginTop: "2em"
                }}
              >
                <span
                  className="ModalCV-rating__label"
                  style={{ marginBottom: "0.4em" }}
                >
                  Sauvegarder dans :
                </span>
              </FormGroup>
              <FormGroup check className="ModalCV-group__form">
                <Checkbox
                  checked={this.state.mycv}
                  onCkeck={this.handleChecked}
                  name={"mycv"}
                  label={"Mes CV"}
                />
              </FormGroup>
              {ent_type == "entreprises" &&
                <FormGroup check className="ModalCV-group__form">
                  <Checkbox
                    checked={this.state.sharedcv}
                    onCkeck={this.handleChecked}
                    name={"sharedcv"}
                    label={"CV partagés"}
                  />
                </FormGroup>}
              <span style={{ color: "red" }}>{errors.sharedcv}</span>
              <FormGroup
                className="ModalCV-group__form"
                style={{
                  textAlign: "center",
                  marginTop: "3em",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Button
                  className="ModalCV-add__btn"
                  onClick={loading ? null : this.handleSubmit}
                >
                  {loading ? "En cours" : "Ajouter"}
                </Button>
                <Button
                  className="ModalCV-cancel__btn"
                  onClick={loading ? null : this._toggle}
                >
                  {loading ? "En cours" : "Annuler"}
                </Button>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }
}

const ADD_CANDIDAT_BY_ENTREPRISE = gql`
  mutation addCandidatByEntreprise(
    $cv: Upload
    $email: String
    $rating: Int
    $mycv: Boolean
    $sharedcv: Boolean
    $recieved: Boolean
    $existmail: Boolean
    $uid: String
    $input: CandidatEntrepriseInput!
  ) {
    addCandidatByEntreprise(
      cv: $cv
      email: $email
      rating: $rating
      mycv: $mycv
      sharedcv: $sharedcv
      recieved: $recieved
      existmail:$existmail
      uid:$uid
      input: $input
    ) {
      first_name
      last_name
    }
  }
`;
const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			ent_type
		}
	}
`;
export default withRouter(
  compose(
    graphql(ADD_CANDIDAT_BY_ENTREPRISE),
    graphql(GET_ENTRPRISE, {
      options: () => ({
        fetchPolicy: "cache-and-network"
      }),
      props: ({ data: { loading, error, getEntrepriseProfile, refetch } }) => ({
        loading,
        error,
        getEntrepriseProfile,
        refetch
      })
    })
  )(AddNewCV)
);