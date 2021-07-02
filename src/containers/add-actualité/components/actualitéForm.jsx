/* eslint-disable react/jsx-no-bind */
import React from "react";
import PropTypes from "prop-types";
import { CardBody, ListGroup, Row, Col, Label, Input, FormGroup, FormFeedback } from "reactstrap";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import * as moment from "moment";
import { withRouter } from "react-router-dom";
import Checkbox from "../../../shared/components/Checkbox";
import Button from "../../../shared/components/Button";
import GraphQLResult from "../../../shared/components/GraphQLResult";
import DatePicker from "../../../shared/components/DatePicker";
import Alert from "../../../handler/utils/Alert";
import { GET_ACTUALITIES } from "../../../handler/queries";

//const logo = `${process.env.PUBLIC_URL}/img/images/banner.png`;

const defaultErrors = {
	title: null,
	description: null,
	auteur: null,
	lien: null,
	startPublication: null,
	endPublication: null,
	eventDate: null
};

class ActualitéForm extends React.Component {
	static propTypes = {
		history: PropTypes.object,
		refetch: PropTypes.func,
		className: PropTypes.string,
		title: PropTypes.string,
		error: PropTypes.string,
		handleChangeUpdate: PropTypes.func,
		addActualite: PropTypes.func,
		updateActualite: PropTypes.func,
		duplicateOffer: PropTypes.func,
		loading: PropTypes.bool,
		data: PropTypes.object.isRequired,
		actualite: PropTypes.object,
		getEntrepriseProfile: PropTypes.object
	};

	static defaultProps = {
		className: "Profil",
		title: ""
	};

	constructor(props) {
		super(props);
		const actualite = props.data.location.state ? props.data.location.state.actualite : null;
		const type = props.data.location.state ? props.data.location.state.type : "add";
		this.state = {
			loading: false,
			typeState: type,
			visibleToCandidat: actualite != null && actualite.visibleToCandidat != null ? actualite.visibleToCandidat : true,
			visibleToAdherent: actualite != null && actualite.visibleToAdherent != null ? actualite.visibleToAdherent : true,
			actualiteState: actualite,
			eventDate: actualite != null && actualite.eventDate != null ? new Date(actualite.eventDate) : "",
			startPublication:
				actualite != null && actualite.startPublication != null ? new Date(actualite.startPublication) : new Date(),
			endPublication:
				actualite != null && actualite.endPublication != null
					? new Date(actualite.endPublication)
					: new Date(new Date().setMonth(new Date().getMonth() + 1)),
			title: actualite != null ? actualite.title : "",
			errors: {
				...defaultErrors
			}
		};
	}
	title = this.props.data.location.state ? this.props.data.location.state.actualite.title : "";
	lien = this.props.data.location.state ? this.props.data.location.state.actualite.lien : "";
	description = this.props.data.location.state ? this.props.data.location.state.actualite.description : "";

	onChangeLien = event => {
		this.lien = event.target.value;
	};
	onChangeTitle = event => {
		this.title = event.target.value;
	};
	onChangeDescription = event => {
		this.description = event.target.value;
	};
	onChangeAuteur = event => {
		this.auteur = event.target.value;
	};

	_handleChangeUpdate = () => {
		this.props.handleChangeUpdate();
	};
	handleChecked = (checked, name) => {
		this.setState({
			[name]: checked
		});
	};
	delete = index => {
		let hamza = this.state.suggestions;
		hamza.splice(index, 1);
		this.setState({ suggestions: hamza });
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

	setAddress = object => {
		if (object) {
			this.address = object.address;
			this.city = object.city;
		}
	};

	getstartPublicationDate = selectedDay => {
		this.setState({ startPublication: selectedDay });
	};
	getPDate = selectedDay => {
		this.setState({ eventDate: selectedDay });
	};
	getendPublicationDate = selectedDay => {
		this.setState({ endPublication: selectedDay });
	};

	_handleSubmit = () => {
		if (this.state.typeState === "update") {
			this._handleUpdate();
		} else this._handleAdd();
	};
	onChange(name, type) {
		this.setState({ [name]: type });
	}
	_handleAdd = () => {
		if (!this.state.loading) {
			const { visibleToAdherent, visibleToCandidat } = this.state;
			const title = this.title;
			const lien = this.lien;
			const endPublication = this.state.endPublication;
			const startPublication =
				this.state.startPublication == "Invalid Date" ? moment().format("YYYY-MM-DD") : this.state.startPublication;
			const eventDate = this.state.eventDate;
			const description = this.description;
			const errors = {
				...defaultErrors
			};
			if (!title || title.length < 5) errors.title = "Le titre est obligatoire et doit comporter au moins 5 caractères";
			if (endPublication == "Invalid Date") errors.endPublication = "Veuillez renseigner une date de fin";
			else if (
				moment(moment(startPublication).format("YYYY-MM-DD")).isAfter(moment(endPublication).format("YYYY-MM-DD"))
			)
				errors.endPublication = "La fin de publication doit être après la date de début";
			if (errors.title || errors.endPublication || errors.startPublication || errors.eventDate) {
				this.setState({ errors: { ...errors } });
				Alert.warning("Merci de corriger les problèmes identifiés dans le formulaire");
			} else {
				this.setState({ loading: true, errors });
				console.log("errors", errors);

				this.props
					.addActualite({
						variables: {
							input: {
								title,
								description,
								lien,
								startPublication,
								endPublication,
								eventDate,
								visibleToCandidat,
								visibleToAdherent
							}
						},
						refetchQueries: [
							{
								query: GET_ACTUALITIES,
								variables: {
									state: "TOUT",
									search: "",
									skip: 0,
									limit: 10,
									field: "name",
									direction: 1
								}
							}
						]
					})
					.then(Response => {
						console.log("Response", Response);
						this.setState({ loading: false, errors: defaultErrors });
						this.props.refetch();
						this.props.history.push({
							pathname: "/mes-actualités",
							state: { status: "Actif" }
						});
					})
					.catch(e => {
						this.onResponse(() => {
							console.log(e);
						});
					});
			}
		}
	};
	_handleUpdate = () => {
		if (!this.state.loading) {
			const { visibleToAdherent, visibleToCandidat } = this.state;
			const title = this.title;
			const lien = this.lien;
			const entreprise_id = this.props.getEntrepriseProfile.id;
			const startPublication = this.state.startPublication;
			const endPublication = this.state.endPublication;
			const eventDate = this.state.eventDate;
			const description = this.description.trim();
			const errors = {
				...defaultErrors
			};
			if (!title || title.length < 5) errors.title = "Le titre est obligatoire et doit comporter au moins 5 caractères";
			if (moment(startPublication).isAfter(moment(endPublication)))
				errors.endPublication = "La fin de publication doit être après la date de début";

			if (errors.title || errors.auteur || errors.endPublication || errors.startPublication || errors.eventDate) {
				this.setState({ errors: { ...errors } });
				Alert.warning("Merci de corriger les problèmes identifiés dans le formulaire");
			} else {
				this.setState({ loading: true, errors });
				this.props
					.updateActualite({
						variables: {
							id: this.state.actualiteState._id,
							input: {
								title,
								description,
								entreprise_id,
								lien,
								startPublication,
								endPublication,
								eventDate,
								visibleToCandidat,
								visibleToAdherent
							}
						},
						refetchQueries: () => [
							{
								query: GET_ACTUALITIES,
								variables: {
									state: "TOUT",
									search: "",
									skip: 0,
									limit: 10,
									field: "name",
									direction: 1
								}
							}
						]
					})
					.then(() => {
						this.setState({ loading: false, errors: defaultErrors });
						this.props.refetch();
						Alert.success("L'offre est modifiée avec succès");
						this.props.history.push({
							pathname: "/mes-actualités",
							state: { status: "TOUT" }
						});
					})
					.catch(e => {
						console.log(e);
					});
			}
		}
	};
	render() {
		const { errors, typeState, actualiteState, visibleToAdherent, visibleToCandidat } = this.state;
		const { error, loading } = this.props;
		return (
			<GraphQLResult loading={loading} error={error}>
				<CardBody>
					<ListGroup tag="div" className="Profil-group n" style={{ marginTop: typeState === "update" && "4em" }}>
						<Row style={{ marginBottom: 6 }}>
							<Col xs={12} md={12} lg={12} xl={12}>
								<FormGroup>
									<Label className="Profil-group__label" for="title">
										Titre de l'Actu RH
										{typeState === "add" && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
									</Label>
									<Input
										className="Profil-group__input"
										onChange={this.onChangeTitle}
										defaultValue={this.title}
										name="title"
										type="text"
										placeholder="Saisie le titre de l'Actu RH"
										invalid={!!errors.title}
									/>
									{errors.title && <span className="span-error">{errors.title}</span>}
								</FormGroup>
							</Col>
						</Row>
						<Row style={{ marginBottom: 6 }}>
							<Col xs={12} md={6} lg={6} xl={6}>
								<FormGroup>
									<Label className="Profil-group__label" for="name">
										Date de début de publication{" "}
										{typeState === "add" && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
									</Label>
									<DatePicker
										local={"fr"}
										className={"hamza"}
										defaultValue={
											actualiteState && actualiteState.startPublication ? (
												actualiteState.startPublication
											) : (
													this.state.startPublication
												)
										}
										getDate={this.getstartPublicationDate}
									/>
									<FormFeedback>{errors.startPublication}</FormFeedback>
								</FormGroup>
							</Col>
							<Col xs={12} md={6} lg={6} xl={6}>
								<FormGroup>
									<Label className="Profil-group__label" for="name">
										Date de fin de publication{" "}
										{typeState === "add" && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
									</Label>
									<DatePicker
										local={"fr"}
										className={"hamza"}
										defaultValue={
											actualiteState && actualiteState.endPublication ? (
												actualiteState.endPublication
											) : (
													this.state.endPublication
												)
										}
										getDate={this.getendPublicationDate}
									/>
									<FormFeedback style={{ display: "flex" }}>{errors.endPublication}</FormFeedback>
								</FormGroup>
							</Col>
						</Row>
						<Row style={{ marginBottom: 6 }}>
							<Col xs={12} md={12} lg={12} xl={12}>
								<FormGroup>
									<Label className="Profil-group__label" for="name">
										Description de l'Actu RH{" "}
										{typeState === "add" && <span style={{ marginLeft: 5, color: "red" }}>*</span>}
									</Label>
									<Input
										className="Profil-group__input"
										style={{ height: "7rem" }}
										type="textarea"
										name="description"
										id="description"
										defaultValue={this.description}
										placeholder={"Saisissez la description de votre Actu RH..."}
										invalid={!!errors.description}
										onChange={this.onChangeDescription}
									/>
									{errors.description && <span className="span-error">{errors.description}</span>}
								</FormGroup>
							</Col>
						</Row>
						<Row className="justify-content-center" style={{ marginBottom: 6 }}>
							<Col xs={12} md={12} lg={6} xl={6}>
								<Label className="Profil-group__label" for="name">
									Lien URL
								</Label>
								<Input
									className="Profil-group__input"
									onChange={this.onChangeLien}
									defaultValue={this.lien}
									name="Lien"
									type="text"
									placeholder="Lien externe relatif à votre actualité"
									invalid={!!errors.lien}
								/>
							</Col>
							<Col xs={12} md={12} lg={6} xl={6}>
								<FormGroup>
									<Label className="Profil-group__label" for="name">
										Date de l'évènement{" "}
									</Label>
									<DatePicker
										local={"fr"}
										className={"hamza"}
										defaultValue={
											actualiteState && actualiteState.eventDate ? actualiteState.eventDate : this.state.eventDate
										}
										getDate={this.getPDate}
										show={this.state.eventDate == "Invalid Date" || this.state.eventDate == "" ? true : false}
									/>
								</FormGroup>
								<FormFeedback>{errors.eventDate}</FormFeedback>
							</Col>
						</Row>
						<Row xs={12} md={12} lg={12} xl={12} style={{ marginBottom: 6, marginLeft: 5, flexDirection: "row", display: "flex", alignItems: "baseline" }}>
							<Label for="ActuVisibilité" className="Profil-group__label">Actualité visible pour:</Label>
							<div style={{ marginLeft: "1rem" , width: "15%"}}>
								<Checkbox
									checked={visibleToAdherent}
									onCkeck={this.handleChecked}
									name={"visibleToAdherent"}
									label={"Les adhérents"}
								/></div>
							<div style={{ marginLeft: "1rem" , width: "15%"}}>
								<Checkbox
									checked={visibleToCandidat}
									onCkeck={this.handleChecked}
									name={"visibleToCandidat"}
									label={"Les candidats"}
									style={{ marginLeft: 10 }}
								/></div>
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
							onClick={this._handleSubmit}
							className="Profil-btn__success"
							size="lg"
							text={typeState == "update" ? "MISE À JOUR" : "SAUVEGARDER"}
							color="primary"
							loading={this.state.loading}
						/>
					</div>
				</CardBody>
			</GraphQLResult>
		);
	}
}
const ADD_ACTUALITE = gql`
	mutation addActualite($input: ActualiteInput!) {
		addActualite(input: $input) {
			title
		}
	}
`;
const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			id
			name
		}
	}
`;
const UPDATE_ACTUALITE = gql`
	mutation updateActualite($id: ID!, $input: ActualiteInput!) {
		updateActualite(id: $id, input: $input) {
			title
		}
	}
`;
export default withRouter(
	compose(
		graphql(ADD_ACTUALITE, {
			name: "addActualite"
		}),
		graphql(UPDATE_ACTUALITE, {
			name: "updateActualite"
		}),
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
	)(ActualitéForm)
);
