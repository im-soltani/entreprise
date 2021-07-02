import React from "react";
import PropTypes from "prop-types";
import {
  CardBody,
  ListGroup,
  Row,
  Col,
  Label,
  Input,
  FormGroup,
  FormFeedback,
} from "reactstrap";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import Button from "../../../shared/components/Button";
import EditorHtml from "../../../shared/components/Editor";
import AddressAutocomplete from "../../../shared/components/AddressAutocomplete";
import Autosuggestion from "../../../shared/components/Autosuggestion";
import AutosuggestionInput from "../../../shared/components/AutosuggestionInput";
import GraphQLResult from "../../../shared/components/GraphQLResult";
import StickyLabels from "../../../shared/components/StickyLabels";
import DatePicker from "../../../shared/components/DatePicker";
import ModalPreview from "../../../shared/components/ModalPreview";
import Select from "../../../shared/components/Select";
import { withRouter } from "react-router-dom";
import Alert from "../../../handler/utils/Alert";
import FilePreview from "./FilePreview";
import {
  GET_COMPETENCES,
  GET_JOBS,
  GET_OFFERS_BY_STATUS,
  GET_SOFTSKILLS,
} from "../../../handler/queries";

import {
  contratConst,
  etudeConst,
  experienceConst,
  work_timeConst,
} from "../../../handler/utils/constants";
//const logo = `${process.env.PUBLIC_URL}/img/images/banner.png`;

const defaultErrors = {
  name: null,
  job_id: null,
  contract: null,
  work_time: null,
  etude: null,
  experience: null,
  address: null,
  city: null,
  salarya: null,
  salaryb: null,
  suggestions: null,
  jobsuggestions: null,
  description_poste: null,
  SoftskillsError: null,
  dureeContract: null,
};

class OfferForm extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    handleChangeForm: PropTypes.func,
    refetch: PropTypes.func,
    className: PropTypes.string,
    title: PropTypes.string,
    error: PropTypes.string,
    handleChangeUpdate: PropTypes.func,
    getCompetences: PropTypes.object,
    getJobs: PropTypes.object,
    getSoftskills: PropTypes.object,
    addOffer: PropTypes.func,
    updateOffer: PropTypes.func,
    duplicateOffer: PropTypes.func,
    loading: PropTypes.bool,
    offer: PropTypes.object,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: "Profil",
    title: "",
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modal: false,
      selectedDay: props.offer
        ? new Date(props.offer.expiredAt)
        : new Date(new Date().setMonth(new Date().getMonth() + 1)),
      suggestions: props.offer ? props.offer.competences : [],
      jobsuggestions: props.offer ? props.offer.jobs : [],
      softskills_suggestion: props.offer ? props.offer.softskills : [],
      extra_file: props.offer ? props.offer.extra_file : null,
      banner: props.offer ? props.offer.banner : null,
      contract: props.offer ? props.offer.contract : null,
      experience: props.offer ? props.offer.experience : null,
      offer: {},
      name: props.offer ? props.offer.name : null,
      modalFile: false,
      etude: props.offer ? props.offer.etude : null,
      work_time: props.offer ? props.offer.work_time : null,
      job_id2: null,
      salary_type:
        props.offer && props.offer.salary_type
          ? props.offer.salary_type
          : "Selon l'expérience",
      job_id:
        props.type === "add" && props.getJobs && props.getJobs.jobs
          ? null
          : props.offer && props.offer.job
            ? props.offer.job.id
            : null,
      errors: {
        ...defaultErrors,
      },
    };
    this.toggleFile = this.toggleFile.bind(this);
  }

  salary = this.props.offer ? this.props.offer.salary : [0, 0];
  dureeContract = this.props.offer ? this.props.offer.dureeContract : null;

  banner = this.props.offer ? this.props.offer.banner : null;
  description = this.props.offer ? this.props.offer.description_poste : "";
  city = this.props.offer ? this.props.offer.city : null;
  address = this.props.offer ? this.props.offer.address : null;
  profileBanner = React.createRef();

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.offer !== this.props.offer) {
      this.setState({ job_id: nextProps.offer.job.id });
    }
  }
  setRef = (ref) => {
    if (ref) this[ref.name] = ref;
  };
  getValue = (value) => {
    this.setState({ name: value });
  };
  getValueS = (value) => {
    this.setState({ job: value });
  };
  pushSelectedJob = (suggestion) => {
    this.setState({ job_id: suggestion.id });
  };
  setDescriptionRef = (ref) => {
    if (ref) this.description = ref;
  };

  onSelect = (value, name) => {
    this.setState({ [name]: value });
  };

  onChangeSalary = (event) => {
    if (event.target.name === "salarya") {
      this.salary[0] = parseInt(event.target.value);
    }
    if (event.target.name === "salaryb") {
      this.salary[1] = parseInt(event.target.value);
    }
  };
  onChangeDureeContract = (event) => {
    this.dureeContract = parseInt(event.target.value);
  };
  updatePhoto = (e) => {
    if (e.target.files) {
      if (e.target.name === "banner") {
        const file = e.target.files[0];
        this.banner = e.target.files[0];
        this.setState({ banner: e.target.files[0] });
        this.profileBanner.current.src = `${URL.createObjectURL(file)}`;
      }
      if (e.target.name === "extra_file") {
        this.extra_file = e.target.files[0];
        this.setState({ extra_file: e.target.files[0] });
      }
    }
  };

  _handleChangeUpdate = () => {
    this.props.handleChangeUpdate();
  };

  pushSelectedSuggestion = (suggestion) => {
    if (this.state.suggestions.indexOf(suggestion) === -1) {
      let suggestions = this.state.suggestions;
      suggestions.push(suggestion);
      this.setState({ suggestions: suggestions });
    }
  };
  pushSelectedSuggestionJobs = (suggestion) => {
    this.setState({ job_id2: suggestion.id });
  };
  deleteJob = (index) => {
    let hamza = this.state.jobsuggestions;
    hamza.splice(index, 1);
    this.setState({ jobsuggestions: hamza });
  };
  delete = (index) => {
    let hamza = this.state.suggestions;
    hamza.splice(index, 1);
    this.setState({ suggestions: hamza });
  };
  pushSoftskills = (suggestion) => {
    if (this.state.softskills_suggestion.indexOf(suggestion) === -1) {
      let softskills_suggestion = this.state.softskills_suggestion;
      softskills_suggestion.push(suggestion);
      this.setState({ softskills_suggestion });
    }
  };
  deleteSoftskills = (index) => {
    let hamza = this.state.softskills_suggestion;
    hamza.splice(index, 1);
    this.setState({ softskills_suggestion: hamza });
  };
  onResponse = (cb) => {
    this.setState(
      {
        loading: false,
      },
      () => {
        cb();
      }
    );
  };

  setAddress = (object) => {
    if (object) {
      this.address = object.address;
      this.city = object.city;
    }
  };

  getDate = (selectedDay) => {
    this.setState({ selectedDay });
  };

  _handleSubmit = () => {
    if (this.props.type === "add") {
      this._handleAdd();
    }
    if (this.props.type === "update") {
      this._handleUpdate();
    }
  };
  _handlePreview = () => {
    if (!this.state.loading) {
      const name = this.state.name ? this.state.name.trim() : null;
      let file = this.state.banner;
      const job_id = this.state.job_id ? this.state.job_id.trim() : null;
      let competences_ids = [];
      if (this.state.suggestions.length !== 0) {
        this.state.suggestions.map((item) => {
          competences_ids.push(item.id);
        });
      }
      const job_name = job_id
        ? this.props.getJobs.jobs.filter(
            (job) => job.id.toString() === job_id.toString()
          )[0].name
        : "";
      let softskills_ids = [];
      if (this.state.softskills_suggestion.length !== 0) {
        this.state.softskills_suggestion.map((item) => {
          softskills_ids.push(item.id);
        });
      }
      const salary = this.salary;
      const salary_type = this.state.salary_type;
      const address = this.address ? this.address : "";
      const city = this.city ? this.city : "";
      const expiredAt = this.state.selectedDay;
      const description_poste = this.description.trim();
      const { contract, experience, etude, work_time } = this.state;
      const errors = {
        ...defaultErrors,
      };
      if (this.state.salary_type === "Précisez le salaire (en KE)") {
        if (salary[0] === 0)
          errors.salarya =
            "Le salaire minimum doit être renseigné et supérieur ou égal à 0. ";
        if (salary[1] === 0)
          errors.salaryb =
            "Le salaire maximum doit être renseigné et supérieur ou égal à 0. ";
        if (salary[0] > salary[1])
          errors.salarya =
            "Le salaire minimum doit être inferieur au salaire maximum.";
      }
      if (name && name.length < 5)
        errors.name =
          "Le titre est obligatoire et doit comporter au moins 5 caractères";
      if (!contract) errors.contract = "Le contrat est obligatoire";
      if (!experience) errors.experience = "L'expérience est obligatoire";
      if (!work_time) errors.work_time = "Le temps de travail est obligatoire";
      if (!etude) errors.etude = "Le niveau d'étude est obligatoire";
      if (address.length < 5)
        errors.address =
          "L'adresse est obligatoire et doit comporter au moins 5 caractères";

      if (this.state.suggestions.length === 0)
        errors.suggestions = "Vous devez renseigner au moins 1 compétence";
      if (!job_id) errors.jobsuggestions = "Vous devez renseigner une métier";
      if (this.state.job != job_name)
        errors.jobsuggestions = "Vous devez renseigner une métier valide";
      if (this.state.softskills_suggestion.length === 0)
        errors.SoftskillsError = "Vous devez renseigner au moins une softskill";
      if (
        errors.name ||
        errors.contract ||
        errors.work_time ||
        errors.experience ||
        errors.etude ||
        errors.address ||
        errors.city ||
        errors.salarya ||
        errors.salaryb ||
        errors.suggestions ||
        errors.description_poste ||
        errors.jobsuggestions ||
        errors.SoftskillsError
      ) {
        this.setState({ errors: { ...errors } });
        Alert.warning(
          "Merci de corriger les problèmes identifiés dans le formulaire"
        );
      } else {
        this.setState({ errors });
        this.setState({
          modal: true,
          offer: {
            file,
            suggestions: this.state.suggestions,
            competences_ids,
            softskills_ids,
            job_id,
            name,
            job_name,
            salary,
            salary_type,
            address,
            contract,
            expiredAt: new Date(expiredAt).getTime(),
            city,
            etude,
            work_time,
            experience,
            description_poste,
          },
        });
      }
    }
  };
  _handleAdd = () => {
    if (!this.state.loading) {
      const name = this.state.name ? this.state.name.trim() : null;
      let file = this.state.banner;
      let competences_ids = [];
      if (this.state.suggestions.length !== 0) {
        this.state.suggestions.map((item) => {
          competences_ids.push(item.id);
        });
      }
      const { job_id } = this.state;
      const job_name = job_id
        ? this.props.getJobs.jobs.filter(
            (job) => job.id.toString() === job_id.toString()
          )[0].name
        : "";
      let softskills_ids = [];
      if (this.state.softskills_suggestion.length !== 0) {
        this.state.softskills_suggestion.map((item) => {
          softskills_ids.push(item.id);
        });
      }
      const salary = this.salary;
      const dureeContract = this.dureeContract;
      const address = this.address ? this.address : "";
      const city = this.city ? this.city : "";
      const description_poste = this.description.trim();
      const expiredAt = this.state.selectedDay;

      const {
        contract,
        experience,
        etude,
        work_time,
        salary_type,
      } = this.state;
      const errors = {
        ...defaultErrors,
      };
      if (this.state.salary_type === "Précisez le salaire (en KE)") {
        if (salary[0] === 0)
          errors.salarya =
            "Le salaire minimum doit être renseigné et supérieur ou égal à 0. ";
        if (salary[1] === 0)
          errors.salaryb =
            "Le salaire maximum doit être renseigné et supérieur ou égal à 0. ";
        if (salary[0] > salary[1])
          errors.salarya =
            "Le salaire minimum doit être inferieur au salaire maximum.";
      }
      if (!name || name.length < 5)
        errors.name =
          "Le titre est obligatoire et doit comporter au moins 5 caractères";
      if (!contract) errors.contract = "Le contrat est obligatoire";
      if (!experience) errors.experience = "L'expérience est obligatoire";
      if (!work_time) errors.work_time = "Le temps de travail est obligatoire";
      if (!etude) errors.etude = "Le niveau d'étude est obligatoire";
      if (address.length < 5)
        errors.address =
          "L'adresse est obligatoire et doit comporter au moins 5 caractères";
      if (contract && contract != "CDD" && !typeof dureeContract == "number") {
        errors.dureeContract =
          "La Durée du Contract est obligatoire si le contrat n'est pas CDD";
      }
      if (!job_id) errors.jobsuggestions = "Vous devez renseigner une métier";
      if (!job_name)
        errors.jobsuggestions = "Vous devez renseigner une métier valide";
      if (
        errors.name ||
        errors.contract ||
        errors.work_time ||
        errors.experience ||
        errors.etude ||
        errors.address ||
        errors.city ||
        errors.salarya ||
        errors.salaryb ||
        errors.suggestions ||
        errors.description_poste ||
        errors.jobsuggestions ||
        errors.SoftskillsError ||
        errors.dureeContract
      ) {
        this.setState({ errors: { ...errors } });
        Alert.warning(
          "Merci de corriger les problèmes identifiés dans le formulaire"
        );
      } else {
        this.setState({ loading: true, errors });
        this.props
          .addOffer({
            variables: {
              file,
              extra_file: this.state.extra_file,
              competences_ids,
              softskills_ids,
              job_id,
              input: {
                offreType: "JOB",
                name,
                salary,
                salary_type,
                address,
                contract,
                expiredAt: new Date(expiredAt).getTime(),
                city,
                etude,
                work_time,
                experience,
                description_poste,
                dureeContract,
              },
            },
            refetchQueries: [
              {
                query: GET_OFFERS_BY_STATUS,
                variables: {
                  state: "DRAFT",
                  search: "",
                  skip: 0,
                  limit: 4,
                  field: "name",
                  direction: 1,
                  ent_type: "entreprise",
                },
              },
            ],
          })
          .then(() => {
            this.props.history.push({
              pathname: "/mes-offres",
              state: { status: "DRAFT" },
            });
          })
          .catch((e) => {
            this.onResponse(() => {
              console.log(e);
            });
          });
      }
    }
  };
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      offer: {},
    });
  };
  _handleUpdate = () => {
    if (!this.state.loading) {
      const name = this.state.name
        ? this.state.name.trim()
        : this.props.offer && this.props.offer.name
          ? this.props.offer.name
          : null;
      let file = this.state.banner;
      let competences_ids = [];
      if (this.state.suggestions.length !== 0) {
        this.state.suggestions.map((item) => {
          competences_ids.push(item.id);
        });
      }
      const { job_id } = this.state;
      const job_name = job_id
        ? this.props.getJobs.jobs.filter(
            (job) => job.id.toString() === job_id.toString()
          )[0].name
        : "";
      let softskills_ids = [];
      if (this.state.softskills_suggestion.length !== 0) {
        this.state.softskills_suggestion.map((item) => {
          softskills_ids.push(item.id);
        });
      }
      const salary = this.salary;
      const dureeContract = this.dureeContract;
      const address = this.address ? this.address : "";
      const city = this.city ? this.city : "";
      const expiredAt = this.state.selectedDay;
      const description_poste = this.description.trim();
      const {
        contract,
        experience,
        etude,
        work_time,
        salary_type,
      } = this.state;
      const errors = {
        ...defaultErrors,
      };

      if (this.state.salary_type === "Précisez le salaire (en KE)") {
        if (salary[0] === 0)
          errors.salarya =
            "Le salaire minimum doit être renseigné et supérieur ou égal à 0. ";
        if (salary[1] === 0)
          errors.salaryb =
            "Le salaire maximum doit être renseigné et supérieur ou égal à 0. ";
        if (salary[0] > salary[1])
          errors.salarya =
            "Le salaire minimum doit être inferieur au salaire maximum.";
      }
      if (!name || name.length < 5)
        errors.name =
          "Le titre est obligatoire et doit comporter au moins 5 caractères";
      if (!contract) errors.contract = "Le contrat est obligatoire";
      if (!experience) errors.experience = "L'expérience est obligatoire";
      if (!work_time) errors.work_time = "Le temps de travail est obligatoire";
      if (!etude) errors.etude = "Le niveau d'étude est obligatoire";
      if (address.length < 5)
        errors.address =
          "L'adresse est obligatoire et doit comporter au moins 5 caractères";

      if (this.state.suggestions.length === 0)
        errors.suggestions = "Vous devez renseigner au moins 1 compétence";
      if (!job_id) errors.jobsuggestions = "Vous devez renseigner une métier";
      if (!job_name)
        errors.jobsuggestions = "Vous devez renseigner une métier valide";
      if (
        contract &&
        contract != "CDI" &&
        (!dureeContract || typeof dureeContract != "number")
      ) {
        errors.dureeContract =
          "La Durée du Contract est obligatoire si le contrat n'est pas CDI";
      }
      if (
        errors.name ||
        errors.contract ||
        errors.work_time ||
        errors.experience ||
        errors.etude ||
        errors.address ||
        errors.city ||
        errors.salarya ||
        errors.salaryb ||
        errors.suggestions ||
        errors.description_poste ||
        errors.jobsuggestions ||
        errors.SoftskillsError ||
        errors.dureeContract
      ) {
        this.setState({ errors: { ...errors } });
        Alert.warning(
          "Merci de corriger les problèmes identifiés dans le formulaire"
        );
      } else {
        this.setState({ loading: true, errors });
        this.props
          .updateOffer({
            variables: {
              id: this.props.offer.id,
              file,
              extra_file: this.state.extra_file,
              competences_ids,
              softskills_ids,
              job_id,
              input: {
                name,
                salary,
                address,
                contract,
                salary_type,
                expiredAt: new Date(expiredAt).getTime(),
                city,
                etude,
                work_time,
                experience,
                description_poste,
                dureeContract,
              },
            },
            refetchQueries: [
              {
                query: GET_OFFERS_BY_STATUS,
                variables: {
                  state: "DRAFT",
                  search: "",
                  skip: 0,
                  limit: 4,
                  field: "name",
                  direction: 1,
                  ent_type: "entreprise",
                },
              },
            ],
          })
          .then(() => {
            this.setState({ loading: false, errors: defaultErrors });
            this.props.refetch();
            Alert.success("L'offre est modifiée avec succès");
            this.props.history.push({
              pathname: "/offre/" + this.props.offer.num,
              state: { ent_type: "entreprise" },
            });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  };

  _handleDuplicate = () => {
    if (!this.state.loading) {
      this.setState({ loading: true });

      this.props
        .duplicateOffer({
          variables: {
            id: this.props.offer.id,
          },
          refetchQueries: [
            {
              query: GET_OFFERS_BY_STATUS,
              variables: {
                state: "DRAFT",
                search: "",
                skip: 0,
                limit: 4,
                field: "name",
                direction: 1,
                ent_type: "entreprise",
              },
            },
          ],
        })
        .then(() => {
          this.setState({ loading: false });
          this.props.refetch();
          this.props.history.push({
            pathname: "/mes-offres",
            state: { status: "DRAFT" },
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  onOpenModal = () => {
    this.setState({ modalFile: !this.state.modalFile });
  };

  toggleFile() {
    this.setState({
      modalFile: !this.state.modalFile,
    });
  }
  render() {
    const {
      errors,
      suggestions,
      salary_type,
      modal,
      offer,
      modalFile,
      softskills_suggestion,
      contract,
    } = this.state;
    const {
      error,
      getCompetences,
      loading,
      getJobs,
      getSoftskills,
      type,
    } = this.props;
    return (
      <GraphQLResult
        loading={loading}
        error={error}
        emptyResult={
          !loading &&
          getCompetences &&
          getCompetences.totalcount === 0 &&
          getJobs &&
          getJobs.totalcount === 0
        }>
        <ModalPreview modal={modal} offer={offer} toggleModal={this.toggle} />
        <FilePreview
          file={this.state.extra_file}
          modal={modalFile}
          toggle={this.toggleFile}
        />
        <CardBody>
          {this.props.type === "update" && (
            <div className="btn_dup">
              <Button
                onClick={this._handleDuplicate}
                className="Profil-btn__duplicate"
                size="lg"
                text="DUPLIQUER"
                color="primary"
                loading={this.state.loading}
              />
            </div>
          )}

          <ListGroup
            tag="div"
            className="Profil-group n"
            style={{ marginTop: this.props.type === "update" && "4em" }}>
            <Row style={{ marginBottom: 6 }}>
              <Col xs={12} md={12} lg={12} xl={12}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Titre de l'offre d'emploi
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <AutosuggestionInput
                    items={getJobs && getJobs.jobs ? getJobs.jobs : []}
                    oldValue={this.props.offer && this.props.offer.name}
                    pushSelectedSuggestion={this.pushSelectedSuggestionJobs}
                    getValue={this.getValue}
                  />
                  {errors.name && (
                    <span className="span-error">{errors.name}</span>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col xs={12} md={12} lg={12} xl={12}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Métier recherché{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <AutosuggestionInput
                    items={getJobs && getJobs.jobs ? getJobs.jobs : []}
                    oldValue={this.props.offer && this.props.offer.job.name}
                    pushSelectedSuggestion={this.pushSelectedJob}
                    getValue={this.getValueS}
                  />
                  {errors.jobsuggestions && (
                    <span className="span-error">{errors.jobsuggestions}</span>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Compétences recherchées{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <Autosuggestion
                    items={
                      getCompetences && getCompetences.competences
                        ? getCompetences.competences
                        : []
                    }
                    pushSelectedSuggestion={this.pushSelectedSuggestion}
                  />
                  <FormFeedback>{errors.competences}</FormFeedback>
                </FormGroup>
              </Col>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label
                    className="Profil-group__label"
                    for="name"
                    style={{ color: "white" }}>
                    SONT
                  </Label>
                  <StickyLabels
                    items={suggestions}
                    delete={this.delete}
                    enableDelete={true}
                    className="sticky-labes"
                  />
                  {errors.suggestions && (
                    <span className="span-error">{errors.suggestions}</span>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Softskills recherchées{" "}
                  </Label>
                  <Autosuggestion
                    items={
                      getSoftskills && getSoftskills.softskills
                        ? getSoftskills.softskills
                        : []
                    }
                    placeholderr={"Softskills recherchées..."}
                    pushSelectedSuggestion={this.pushSoftskills}
                  />
                  <FormFeedback>{errors.SoftskillsError}</FormFeedback>
                </FormGroup>
              </Col>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label
                    className="Profil-group__label"
                    for="name"
                    style={{ color: "white" }}>
                    SONT
                  </Label>
                  <StickyLabels
                    items={softskills_suggestion}
                    delete={this.deleteSoftskills}
                    enableDelete={true}
                    className="sticky-labes"
                  />
                  {errors.softskills && (
                    <span className="span-error">{errors.SoftskillsError}</span>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Contrat{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <Select
                    className="Profil-group__input"
                    onSelect={this.onSelect}
                    optionLabelDisabled={false}
                    defaultValue={this.props.offer && this.props.offer.contract}
                    name={"contract"}
                    items={contratConst}
                    error={errors.contract}
                  />

                  <FormFeedback>{errors.contract}</FormFeedback>
                </FormGroup>
              </Col>
              {contract != "CDI" &&
                contract != null && (
                  <Col xs={12} md={6} lg={6} xl={6}>
                    <FormGroup>
                      <Label className="Profil-group__label" for="name">
                        Durée du contrat{" "}
                        {this.props.type === "add" && (
                          <span style={{ marginLeft: 5, color: "red" }}>*</span>
                        )}
                      </Label>
                      <Input
                        className="Profil-group__input"
                        onChange={this.onChangeDureeContract}
                        defaultValue={
                          this.props.offer && this.props.offer.dureeContract
                        }
                        type="number"
                        name="dureeContract"
                        placeholder="Durée du contrat (mois)"
                        invalid={!!errors.dureeContract}
                      />
                      <FormFeedback>{errors.dureeContract}</FormFeedback>
                    </FormGroup>
                  </Col>
                )}
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Niveau d'étude{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <Select
                    className="Profil-group__input"
                    onSelect={this.onSelect}
                    defaultValue={this.props.offer && this.props.offer.etude}
                    name={"etude"}
                    optionLabelDisabled={false}
                    items={etudeConst}
                    error={errors.etude}
                  />

                  <FormFeedback>{errors.etude}</FormFeedback>
                </FormGroup>
              </Col>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Expérience demandée{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <Select
                    className="Profil-group__input"
                    onSelect={this.onSelect}
                    defaultValue={
                      this.props.offer && this.props.offer.experience
                    }
                    optionLabelDisabled={false}
                    name={"experience"}
                    items={experienceConst}
                    error={errors.experience}
                  />

                  <FormFeedback>{errors.experience}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Lieu de travail{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <AddressAutocomplete
                    addressEntreprise={
                      this.props.offer
                        ? {
                            address: this.props.offer.address,
                            city: this.props.offer.city,
                          }
                        : {}
                    }
                    setAddress={this.setAddress}
                    deafultAddress={this.address}
                  />

                  {errors.address && (
                    <span className="span-error">{errors.address}</span>
                  )}
                </FormGroup>
              </Col>
              <Col xs={12} md={6} lg={6} xl={6}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Temps de travail{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <Select
                    className="Profil-group__input"
                    onSelect={this.onSelect}
                    defaultValue={
                      this.props.offer && this.props.offer.work_time
                    }
                    optionLabelDisabled={false}
                    name={"work_time"}
                    items={work_timeConst}
                    error={errors.work_time}
                  />

                  <FormFeedback>{errors.work_time}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col
                xs={12}
                md={salary_type === "Précisez le salaire (en KE)" ? 6 : 12}
                lg={salary_type === "Précisez le salaire (en KE)" ? 6 : 12}
                xl={salary_type === "Précisez le salaire (en KE)" ? 6 : 12}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Salaire
                  </Label>
                  <Select
                    className="Profil-group__input"
                    onSelect={this.onSelect}
                    defaultValue={salary_type}
                    name={"salary_type"}
                    items={[
                      {
                        label: "Précisez le salaire (en KE)",
                        value: "Précisez le salaire (en KE)",
                      },
                      { label: "À négocier", value: "À négocier" },
                      {
                        label: "Selon l'expérience",
                        value: "Selon l'expérience",
                      },
                    ]}
                  />
                </FormGroup>
              </Col>
              {salary_type === "Précisez le salaire (en KE)" && (
                <Col xs={12} md={3} lg={3} xl={3}>
                  <FormGroup>
                    <Label className="Profil-group__label" for="name">
                      Min
                    </Label>
                    <Input
                      className="Profil-group__input"
                      onChange={this.onChangeSalary}
                      defaultValue={
                        this.props.offer && this.props.offer.salary[0]
                      }
                      type="number"
                      name="salarya"
                      placeholder="min"
                      invalid={!!errors.salarya}
                    />
                    <FormFeedback>{errors.salarya}</FormFeedback>
                  </FormGroup>
                </Col>
              )}
              {salary_type === "Précisez le salaire (en KE)" && (
                <Col xs={12} md={3} lg={3} xl={3}>
                  <FormGroup>
                    <Label className="Profil-group__label" for="name">
                      Max
                    </Label>
                    <Input
                      className="Profil-group__input"
                      onChange={this.onChangeSalary}
                      defaultValue={
                        this.props.offer && this.props.offer.salary[1]
                      }
                      type="number"
                      name="salaryb"
                      placeholder="max"
                      invalid={!!errors.salaryb}
                    />
                    <FormFeedback>{errors.salaryb}</FormFeedback>
                  </FormGroup>
                </Col>
              )}
            </Row>
            <Row style={{ marginBottom: 6 }}>
              <Col xs={12} md={12} lg={12} xl={12}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Description du poste{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <EditorHtml
                    description={this.description}
                    placeholder={"Saisissez la description de votre poste..."}
                    setDescriptionRef={this.setDescriptionRef}
                  />
                  {errors.description_poste && (
                    <span className="span-error">
                      {errors.description_poste}
                    </span>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row className="justify-content-center" style={{ marginBottom: 6 }}>
              <Col
                xs={12}
                md={12}
                lg={6}
                xl={6}
                className="Profil-logo__upload">
                {/* <Label className="Profil-group__label" for="name">
                  Bannière de l'offre
                </Label>
                <img
                  className="img-banner"
                  ref={this.profileBanner}
                  src={this.props.offer ? this.props.offer.banner : logo}
                  alt={"logo"}
                />
                <Input
                  style={{ visibility: "hidden" }}
                  id="banner"
                  name="banner"
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={this.updatePhoto}
                  invalid={!!this.banner}
                  innerRef={this.setRef}
                />
                <Label
                  htmlFor="banner"
                  className="btn Profil-logo__btn__upload font-size-medium medium-padding text-white"
                >
                  <i className="fa fa-camera" style={{ marginRight: 6 }} />
                  MODIFIER
                </Label>
                <div style={{ marginTop: "-2em" }}>
                  <span style={{ color: "gray", fontSize: "1.3em" }}>
                    * Cette bannière sera affichée sur votre offre (taille
                    optimale : 1920x300)
                  </span>
                </div> */}
                <Label className="Profil-group__label" for="name">
                  Pièce jointe
                </Label>
                <div className="CVControl-col-right">
                  <div
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Input
                      style={{ display: "none" }}
                      id="extra_file"
                      name="extra_file"
                      type="file"
                      accept="application/pdf"
                      onChange={this.updatePhoto}
                      invalid={!!this.extra_file}
                      innerRef={this.setRef}
                    />
                    <Label
                      htmlFor="extra_file"
                      className="btn btn-warning btn-lg round medium-padding text-white uploadTar"
                      style={{ marginBottom: "20 !important" }}>
                      {this.state.extra_file
                        ? " Remplacer le document complémentaire à votre offre"
                        : " Téléverser un document complémentaire à l'offre"}
                    </Label>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={12} lg={6} xl={6}>
                <FormGroup>
                  <Label className="Profil-group__label" for="name">
                    Date d'expiration de l'offre{" "}
                    {this.props.type === "add" && (
                      <span style={{ marginLeft: 5, color: "red" }}>*</span>
                    )}
                  </Label>
                  <DatePicker
                    local={"fr"}
                    className={"hamza"}
                    defaultValue={
                      this.props.offer
                        ? this.props.offer.expiredAt
                        : this.state.selectedDay
                    }
                    getDate={this.getDate}
                  />
                  <FormFeedback>{errors.expiredAt}</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={6} xl={6}>
                {this.state.extra_file && (
                  <Button
                    className="btn btn-warning btn-lg round medium-padding text-white FilePreview"
                    size="lg"
                    text="Aperçu du document complémentaire"
                    color="primary"
                    onClick={() => this.onOpenModal()}
                  />
                )}
              </Col>
              <Col xs={12} md={12} lg={6} xl={6} />
            </Row>
          </ListGroup>

          <div className="Profil-btns">
            <Button
              onClick={() => this.props.history.goBack()}
              className="Profil-btn__cancel"
              size="lg"
              text="Annuler"
              color="secondary"
              loading={this.state.loading}
            />
            <Button
              onClick={this._handlePreview}
              className="Profil-btn__preview"
              size="lg"
              text={"prévisualiser"}
              loading={this.state.loading}
            />
            <Button
              onClick={this._handleSubmit}
              className="Profil-btn__success"
              size="lg"
              text={"SAUVEGARDER"}
              color="primary"
              loading={this.state.loading}
            />
          </div>
          <div
            style={{
              justifyContent: "center",
              textAlign: "center",
              marginTop: 15,
            }}>
            {type === "add" && (
              <span
                style={{
                  color: "gray",
                  fontSize: "1.1em",
                }}>
                * Après avoir sauvegardé cette offre, vous pourrez la retrouver
                dans la liste des offres au statut « Brouillon »
              </span>
            )}
          </div>
        </CardBody>
      </GraphQLResult>
    );
  }
}
const ADD_OFFER = gql`
  mutation addOffer(
    $file: Upload
    $extra_file: Upload
    $competences_ids: [ID!]
    $softskills_ids: [ID!]
    $job_id: ID
    $input: OfferInput!
  ) {
    addOffer(
      file: $file
      extra_file: $extra_file
      job_id: $job_id
      softskills_ids: $softskills_ids
      competences_ids: $competences_ids
      input: $input
    ) {
      name
    }
  }
`;

const UPDATE_OFFER = gql`
  mutation updateOffer(
    $file: Upload
    $extra_file: Upload
    $competences_ids: [ID!]
    $softskills_ids: [ID!]
    $job_id: ID
    $id: ID!
    $input: OfferInput!
  ) {
    updateOffer(
      file: $file
      extra_file: $extra_file
      job_id: $job_id
      softskills_ids: $softskills_ids
      id: $id
      competences_ids: $competences_ids
      input: $input
    ) {
      name
    }
  }
`;
const DUPLICATE_OFFER = gql`
  mutation duplicateOffer($id: ID!) {
    duplicateOffer(id: $id) {
      name
      id
    }
  }
`;
export default withRouter(
  compose(
    graphql(ADD_OFFER, {
      name: "addOffer",
    }),
    graphql(UPDATE_OFFER, {
      name: "updateOffer",
    }),
    graphql(DUPLICATE_OFFER, {
      name: "duplicateOffer",
    }),
    graphql(GET_COMPETENCES, {
      options: () => ({
        variables: {
          search: "",
          skip: 0,
          limit: 0,
        },
      }),
      props: ({ data: { loading, error, getCompetences } }) => ({
        loading,
        error,
        getCompetences,
      }),
    }),
    graphql(GET_JOBS, {
      options: () => ({
        variables: {
          search: "",
          skip: 0,
          limit: 0,
        },
      }),
      props: ({ data: { loading, error, getJobs } }) => ({
        loading,
        error,
        getJobs,
      }),
    }),
    graphql(GET_SOFTSKILLS, {
      options: () => ({
        variables: {
          search: "",
          skip: 0,
          limit: 0,
        },
      }),
      props: ({ data: { loading, error, getSoftskills } }) => ({
        loading,
        error,
        getSoftskills,
      }),
    })
  )(OfferForm)
);
