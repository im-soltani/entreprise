import React from "react";
import PropTypes from "prop-types";
import { Card, CardBody, ListGroup, Row, Col, Label, Input, FormGroup, FormFeedback } from "reactstrap";
import { graphql, compose } from "react-apollo";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import gql from "graphql-tag";
import ReactPlayer from "react-player"
import EyeIcon from "mdi-react/AddIcon";
import ActivityLabels from "../../../shared/components/ActivityLabels";
import Button from "../../../shared/components/Button";
import EditorHtml from "../../../shared/components/Editor";
import Alert from "../../../handler/utils/Alert";
import AddressAutocomplete from "../../../shared/components/AddressAutocomplete";
import { invalidEmail } from "../../../handler/errorMessages.json";
import { EMAIL_REGEX, REGEX_WEBSITE, REGEX_MOBILE } from "../../../handler/utils/constants";
import { checkEmail } from "../../../handler/api/auth";

const defaultErrors = {
	name: null,
	profileName: null,
	profilePrenom: null,
	profileEmail: null,
	email: null,
	profile_pic_url: null,
	tel: null,
	application_email: null,
	banner: null,
	website: null,
	description: null,
	activity: null,
	zip_code: null,
	country: null,
	city: null,
	effective: null,
	address: null,
	youtubeLink: null,
	linkedinLink: null
};

class EntrepriseInfoUpdate extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string,
		user: PropTypes.object.isRequired,
		handleChangeUpdate: PropTypes.func,
		updateEntrepriseLogo: PropTypes.func,
		updateEntrepriseBanner: PropTypes.func,
		removeUserAvatar: PropTypes.func,
		updateEntreprise: PropTypes.func,
		updateEntrepriseUser: PropTypes.func,
		refetch: PropTypes.func,
		loading: PropTypes.bool.isRequired
	};

	static defaultProps = {
		className: "Profil",
		user: null,
		title: ""
	};

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			activity: props.user.activity,
			youtubeLink: props.user.youtubeLink,
			linkedinLink: props.user.linkedinLink ? props.user.linkedinLink : null,
			errors: {
				...defaultErrors
			}
		};
	}

	name = null;
	email = null;

	profile_pic_url = null;
	tel = null;
	application_email = null;
	banner = null;
	website = null;
	description = null;
	zip_code = null;
	country = null;
	activity = null;
	city = null;
	zip_code_2 = null;
	country_2 = null;
	city_2 = null;
	effective = null;
	address = null;
	address_2 = null;
	profilePicture = React.createRef();
	profileBanner = React.createRef();
	profileName = null;
	profilePrenom = null;
	profileEmail = null;
	setRef = ref => {
		if (ref) this[ref.name] = ref;
	};

	setDescriptionRef = ref => {
		if (ref) this.description = ref;
	};

	updatePhoto = e => {
		if (e.target.files) {
			if (e.target.name === "profile_pic_url") {
				const file = e.target.files[0];
				confirmAlert({
					title: "Confirmation",
					message: "Voulez vous changer votre logo?\nCette action es irréversible",
					buttons: [
						{
							label: "Oui",
							onClick: () =>
								this.props
									.updateEntrepriseLogo({
										variables: {
											file,
											id: this.props.user.id
										}
									})
									.then(() => {
										setTimeout(() => {
											this.onResponse(() => {
												this.profilePicture.current.src = `${URL.createObjectURL(file)}`;
											});
										}, 4000);
									})
									.catch(e => {
										this.onResponse(() => {
											if (e && e.graphQLErrors) console.log(e);
										});
									})
						},
						{
							label: "Non",
							onClick: () => { }
						}
					]
				});
			} else if (e.target.name === "banner") {
				const file = e.target.files[0];
				confirmAlert({
					title: "Confirmation",
					message: "Voulez vous changer votre logo?\nCette action es irréversible",
					buttons: [
						{
							label: "Oui",
							onClick: () =>
								this.props
									.updateEntrepriseBanner({
										variables: {
											file,
											id: this.props.user.id
										}
									})
									.then(() => {
										setTimeout(() => {
											this.onResponse(() => {
												this.profileBanner.current.src = `${URL.createObjectURL(file)}`;
											}, 4000);
										});
									})
									.catch(e => {
										this.onResponse(() => {
											if (e && e.graphQLErrors) console.log(e);
										});
									})
						},
						{
							label: "Non",
							onClick: () => { }
						}
					]
				});
			}
		}
	};

	_handleChangeUpdate = () => {
		this.props.handleChangeUpdate();
	};
	onLinkchange = e => {
		this.setState({ youtubeLink: e.target.value });
	};
	onLink2change = e => {
		this.setState({ linkedinLink: e.target.value });
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

	delete = index => {
		let hamza = this.state.activity;
		hamza.splice(index, 1);
		this.setState({ activity: hamza });
	};

	setAddress = object => {
		if (object) {
			this.address = object.address;
			this.zip_code = object.zip_code;
			this.city = object.city;
			this.country = object.country;
		}
	};
	onChangeTitle = event => {
		this.setState({ name: event.target.value });
	};
	setAddress_2 = object => {
		if (object) {
			this.address_2 = object.address;
			this.zip_code_2 = object.zip_code;
			this.city_2 = object.city;
			this.country_2 = object.country;
		}
	};

	_handleRemoveAvatar = () => {
		this.setState({ loading: true });
		this.props
			.removeUserAvatar({
				variables: {}
			})
			.then(res => {
				if (res && res.data && res.data.removeUserAvatar) Alert.success("Photo de profil supprimée avec succès");

				this.props.refetch();
				this.setState({ loading: false });
			});
	};

	setActivity = e => {
		if (e.key === "Enter") {
			if (this.activity && this.activity.value && this.activity.value.trim() && this.activity.value.trim().length > 0) {
				let hamza = this.state.activity;
				let index = hamza.indexOf(
					this.activity.value.trim().charAt(0).toUpperCase() + this.activity.value.trim().slice(1)
				);
				if (index === -1 && this.activity.value.trim() && hamza.length < 3) {
					hamza.push(this.activity.value.trim().charAt(0).toUpperCase() + this.activity.value.trim().slice(1));
					this.setState({ activity: hamza });
					this.activity.value = "";
				} else if (hamza.length === 3) Alert.warning("Vous pouvez ajouter 3 activités au maximum");
				else Alert.warning("Cette activité existe déjà");
			} else Alert.warning("Il faut saisir une activité");
		}
	};
	setActivityRef = () => {
		if (this.activity && this.activity.value && this.activity.value.trim() && this.activity.value.trim().length > 0) {
			let hamza = this.state.activity;
			let index = hamza.indexOf(
				this.activity.value.trim().charAt(0).toUpperCase() + this.activity.value.trim().slice(1)
			);
			if (index === -1 && this.activity.value.trim() && hamza.length < 3) {
				hamza.push(this.activity.value.trim().charAt(0).toUpperCase() + this.activity.value.trim().slice(1));
				this.setState({ activity: hamza });
				this.activity.value = "";
			} else if (hamza.length === 3) Alert.warning("Vous pouvez ajouter 3 activités au maximum");
			else Alert.warning("Cette activité existe déjà");
		} else Alert.warning("Il faut saisir une activité");
	};
	_handleSubmit = async () => {
		if (!this.state.loading) {
			const name = this.name.value.trim();
			const ent_type = this.props.user.ent_type;
			const name_of_in_charge = this.name_of_in_charge.value.trim();
			const address = this.address ? this.address : this.props.user.address;
			const address_2 = this.address_2 ? this.address_2 : this.props.user.address_2;
			const email = this.email.value.trim();
			const tel = this.tel.value.trim();
			const application_email = this.application_email.value.trim();

			const website = this.website.value.trim();
			const description = this.description ? this.description : this.props.user.description;
			const activity = this.state.activity;
			const zip_code = this.zip_code ? this.zip_code : this.props.user.zip_code;
			const country = this.country ? this.country : this.props.user.country;
			const city = this.city ? this.city : this.props.user.city;
			const zip_code_2 = this.zip_code_2 ? this.zip_code_2 : this.props.user.zip_code_2;
			const country_2 = this.country_2 ? this.country_2 : this.props.user.country_2;
			const city_2 = this.city_2 ? this.city_2 : this.props.user.city_2;
			const effective = this.effective.value.trim();
			const youtubeLink = this.state.youtubeLink;
			const linkedinLink = this.state.linkedinLink;

			const errors = {
				...defaultErrors
			};
			if (name.length < 2) errors.name = "Le nom est obligatoire et doit comporter au moins 3 caractères";
			if (name_of_in_charge.length < 2)
				errors.name_of_in_charge = "Le nom du responsable est obligatoire et doit comporter au moins 3 caractères";
			if (address.length < 2) errors.address = "L'adresse est obligatoire et doit comporter au moins 3 caractères";
			if (!EMAIL_REGEX.test(application_email)) errors.application_email = invalidEmail;
			if (!REGEX_MOBILE.test(tel))
				errors.tel = "Le numéro de téléphone est obligatoire et doit comporter 10 caractères";
			if (!EMAIL_REGEX.test(email)) errors.email = invalidEmail;
			else if (email !== this.props.user.profile.email && email !== this.props.user.leaderProfile.email)
				await checkEmail({ email })
					.then(({ success, message }) => {
						if (!success) {
							errors.email = message;
						}
					})
					.catch(() => { });
			if (!REGEX_WEBSITE.test(website)) errors.website = "Le site web est obligatoire et doit être valide";
			if (activity.length <= 0)
				errors.activity = "Les activités sont obligatoires et doit comporter au moins une activité";
			if (description && description.length < 100)
				errors.description = "La description est obligatoire et doit comporter au moins 100 caractères";
			if (description && description.length > 2000)
				errors.description =
					"La description est obligatoire et doit comporter au maximum 2000 caractères";
			if (!description)
				errors.description =
					"La description est obligatoire et doit comporter au maximum 2000 caractères et au moins 100 caractères";
			if (isNaN(effective) || effective < 1)
				errors.effective = "L'effectif est obligatoire et doit être un nombre positif";
			if (youtubeLink.length > 0 && !ReactPlayer.canPlay(youtubeLink)) errors.youtubeLink = "Le lien de vidéo youtube n'est obligatoire mais doit être valide";

			if (
				errors.name ||
				errors.name_of_in_charge ||
				errors.email ||
				errors.tel ||
				errors.application_email ||
				errors.website ||
				errors.activity ||
				errors.description ||
				errors.effective ||
				errors.youtubeLink
			) {
				this.setState({ errors: { ...errors } });
				Alert.warning("Merci de corriger les problèmes identifiés dans le formulaire");
			} else {
				this.setState({ loading: true, errors });
				if (this.props.user)
					this.props
						.updateEntreprise({
							variables: {
								id: this.props.user.id,
								input: {
									application_email,
									name_of_in_charge,
									activity,
									email,
									effective,
									description,
									name,
									tel,
									website,
									address_2,
									zip_code_2,
									country_2,
									city_2,
									address,
									country,
									city,
									zip_code,
									youtubeLink,
									linkedinLink,
									ent_type
								}
							}
						})
						.then(() => {
							this.onResponse(() => {
								Alert.success("Le profil a été mis à jour avec succès");
								this.props.handleChangeUpdate();
							});
						})
						.catch(e => {
							console.log("ddd", e);
							this.onResponse(() => {
								if (e && e.graphQLErrors) Alert.error(e.graphQLErrors[0].message);
							});
						});
			}
		}
	};
	_updateProfile = async () => {
		if (!this.state.loading) {
			const profileName = this.profileName.value.trim();
			const profilePrenom = this.profilePrenom.value.trim();
			const profileEmail = this.profileEmail.value.trim();

			const errors = {
				...defaultErrors
			};
			if (profileName.length < 4) errors.profileName = "Le nom est obligatoire et doit comporter au moins 5 caractères";
			if (profilePrenom.length < 4)
				errors.profilePrenom = "Le prenom est obligatoire et doit comporter au moins 5 caractères";

			if (!EMAIL_REGEX.test(profileEmail)) errors.profileEmail = invalidEmail;
			else if (profileEmail !== this.props.user.profile.email)
				await checkEmail({ profileEmail })
					.then(({ success, message }) => {
						if (!success) {
							errors.email = message;
						}
					})
					.catch(() => { });
			if (errors.profileName || errors.profilePrenom || errors.profileEmail) {
				this.setState({ errors: { ...errors } });
				Alert.warning("Merci de corriger les problèmes identifiés dans le formulaire");
			} else {
				this.setState({ loading: true, errors });
				if (this.props.user)
					this.props
						.updateEntrepriseUser({
							variables: {
								id: this.props.user.profile.id,
								input: {
									profileName,
									profilePrenom,
									profileEmail
								}
							}
						})
						.then(() => {
							this.onResponse(() => {
								Alert.success("Le profil a été mis à jour avec succès");
							});
						})
						.catch(e => {
							this.onResponse(() => {
								console.log("e.graphQLErrors[0]", e.graphQLErrors);
								if (e && e.graphQLErrors) Alert.error(e.graphQLErrors[0].message);
							});
						});
				Alert.warning("Merci de corriger les problèmes identifiés dans le formulaire");
			}
		}
	};

	render() {
		const { errors, activity, youtubeLink, linkedinLink } = this.state;
		const profileName = this.props.user.profile.name;
		const profilePrenom = this.props.user.profile.prenom;
		const profileEmail = this.props.user.profile.email;

		const {
			loading,
			user: {
				name,
				profile_pic_url,
				profile,
				leaderProfile,
				tel,
				application_email,
				name_of_in_charge,
				banner,
				website,
				description,
				zip_code,
				country,
				city,
				effective,
				address,
				address_2,
				zip_code_2,
				country_2,
				city_2
			}
		} = this.props;
		return (
			<Col md={12}>
				<Card>
					<CardBody>
						<ListGroup tag="div" className="Profil-group">
							<Row className="justify-content-center">
								<Col xs={12} md={6} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<div>
										{profile_pic_url && (
											<span className="remove-avatar" onClick={this._handleRemoveAvatar}>
												x
											</span>
										)}
										<img
											className="img-logo"
											ref={this.profilePicture}
											src={profile_pic_url}
											alt={"logo"}
											style={{ width: "50%" }}
										/>
									</div>

									<Input
										style={{ visibility: "hidden" }}
										id="profile_pic_url"
										name="profile_pic_url"
										type="file"
										accept="image/jpeg, image/png"
										onChange={this.updatePhoto}
										invalid={!!this.profile_pic_url}
										innerRef={this.setRef}
									/>
									<Label
										htmlFor="profile_pic_url"
										className="btn Profil-logo__btn__upload font-size-medium medium-padding text-white"
									>
										<i className="fa fa-camera" style={{ marginRight: 6 }} />
										{profile_pic_url ? "MODIFIER" : "AJOUTER LOGO"}
									</Label>
								</Col>
								<Col xs={12} md={6} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<img
										ref={this.profileBanner}
										src={banner}
										alt={"logo"}
										className="img-banner"
										style={{ height: "80%" }}
									/>
									<Input
										onChange={this.updatePhoto}
										style={{ visibility: "hidden" }}
										id="banner"
										name="banner"
										type="file"
										accept="image/jpeg, image/png"
										invalid={!!this.banner}
										innerRef={this.setRef}
									/>
									<Label
										htmlFor="banner"
										className="btn Profil-logo__btn__upload font-size-medium medium-padding text-white"
									>
										<i className="fa fa-camera" style={{ marginRight: 6 }} />
										{banner ? "MODIFIER" : "AJOUTER BANIERE"}
									</Label>
								</Col>
							</Row>
							{profile.isleader == "false" && (
								<div>
									<Row>
										<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
											<span className="profile-div3">Infos personnel</span>
										</Col>
									</Row>
									<Row>
										<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
											<FormGroup>
												<Label className="Profil-group__label" for="profileName">
													Nom
													<span style={{ marginLeft: 5, color: "red" }}>*</span>
												</Label>
												<Input
													className="Profil-group__input"
													innerRef={this.setRef}
													defaultValue={profileName}
													type="text"
													name="profileName"
													placeholder="Nom"
													invalid={!!errors.profileName}
												/>
												<FormFeedback>{errors.profileName}</FormFeedback>
											</FormGroup>
										</Col>
										<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
											<FormGroup>
												<Label className="Profil-group__label" for="profilePrenom">
													Prénom
													<span style={{ marginLeft: 5, color: "red" }}>*</span>
												</Label>
												<Input
													className="Profil-group__input"
													innerRef={this.setRef}
													defaultValue={profilePrenom}
													type="text"
													name="profilePrenom"
													placeholder="prénom"
													invalid={!!errors.profilePrenom}
												/>
												<FormFeedback>{errors.profilePrenom}</FormFeedback>
											</FormGroup>
										</Col>
									</Row>
									<Row>
										<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
											<FormGroup>
												<Label className="Profil-group__label" for="profileEmail">
													Email
													<span style={{ marginLeft: 5, color: "red" }}>*</span>
												</Label>
												<Input
													className="Profil-group__input"
													innerRef={this.setRef}
													defaultValue={profileEmail}
													type="text"
													name="profileEmail"
													placeholder="Nom"
													invalid={!!errors.profileEmail}
												/>
												<FormFeedback>{errors.profileEmail}</FormFeedback>
											</FormGroup>
										</Col>
										<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6, marginTop: "2em" }}>
											<Label className="Profil-group__label" for="profileEmail" />
											<Button
												onClick={this._updateProfile}
												className="Profil-btn__success"
												size="lg"
												text="SAUVEGARDER"
												color="primary"
												loading={loading}
											/>
										</Col>
									</Row>
									<Row>
										<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
											<span className="profile-div3">Infos entreprise</span>
										</Col>
									</Row>
								</div>
							)}
							<Row>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Nom de la société
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<Input
											className="Profil-group__input"
											innerRef={this.setRef}
											defaultValue={name}
											type="text"
											name="name"
											placeholder="Nom"
											invalid={!!errors.name}
										/>
										<FormFeedback>{errors.name}</FormFeedback>
									</FormGroup>
								</Col>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Nom, prénom du responsable
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<Input
											className="Profil-group__input"
											innerRef={this.setRef}
											defaultValue={name_of_in_charge}
											type="text"
											name="name_of_in_charge"
											placeholder="Nom, prénom du responsable"
											invalid={!!errors.name_of_in_charge}
										/>
										<FormFeedback>{errors.name_of_in_charge}</FormFeedback>
									</FormGroup>
								</Col>
							</Row>

							<Row>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Adresse principale
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<AddressAutocomplete
											addressEntreprise={{
												address: address,
												zip_code: zip_code,
												country: country,
												city: city
											}}
											setAddress={this.setAddress}
										/>
										{errors.address && <span className="span-error">{errors.address}</span>}
									</FormGroup>
								</Col>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Autre établissement
										</Label>
										<AddressAutocomplete
											addressEntreprise={{
												address: address_2,
												zip_code: zip_code_2,
												country: country_2,
												city: city_2
											}}
											setAddress={this.setAddress_2}
										/>{" "}
										{errors.address_2 && <span className="span-error">{errors.address_2}</span>}
									</FormGroup>
								</Col>
							</Row>

							<Row>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Email principal
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<Input
											className="Profil-group__input"
											innerRef={this.setRef}
											defaultValue={leaderProfile.email}
											type="email"
											name="email"
											placeholder="Adresse email principale"
											invalid={!!errors.email}
										/>
										<FormFeedback>{errors.email}</FormFeedback>
									</FormGroup>
								</Col>

								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Email de candidature
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<Input
											className="Profil-group__input"
											innerRef={this.setRef}
											defaultValue={application_email}
											type="text"
											name="application_email"
											placeholder="Email de candidature"
											invalid={!!errors.application_email}
										/>
										<FormFeedback>{errors.application_email}</FormFeedback>
									</FormGroup>
								</Col>
							</Row>

							<Row>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Numéro de téléphone
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<Input
											className="Profil-group__input"
											innerRef={this.setRef}
											defaultValue={tel}
											type="text"
											name="tel"
											placeholder="Numéro de téléphone"
											invalid={!!errors.tel}
										/>
										<FormFeedback>{errors.tel}</FormFeedback>
									</FormGroup>
								</Col>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Site web
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<Input
											className="Profil-group__input"
											innerRef={this.setRef}
											defaultValue={website}
											type="text"
											name="website"
											placeholder="Site web"
											invalid={!!errors.website}
										/>
										<FormFeedback>{errors.website}</FormFeedback>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Activité
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<div className="form__form-group-field">
											<Input
												innerRef={this.setRef}
												onKeyPress={this.setActivity}
												type="text"
												name="activity"
												placeholder="3 activités maximum"
												invalid={!!errors.activity}
											/>
											<button className="form__form-group-button-entreprise" onClick={this.setActivityRef}>
												<EyeIcon />
											</button>
										</div>
										{errors.activity && <span className="span-error">{errors.activity}</span>}
									</FormGroup>
									<ActivityLabels items={activity} delete={this.delete} className="Profil-sticky" />
								</Col>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Effectif
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<Input
											className="Profil-group__input"
											innerRef={this.setRef}
											defaultValue={effective}
											type="number"
											name="effective"
											placeholder="Effectif"
											invalid={!!errors.effective}
										/>
										<FormFeedback>{errors.effective}</FormFeedback>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col xs={12} md={12} lg={12} xl={12} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Présentation de l'entreprise
											<span style={{ marginLeft: 5, color: "red" }}>*</span>
										</Label>
										<EditorHtml
											description={description}
											placeholder={"Saisissez la présentation de votre entreprise..."}
											setDescriptionRef={this.setDescriptionRef}
										/>
										{errors.description && <span className="span-error">{errors.description}</span>}
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col xs={12} md={12} lg={12} xl={12} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Lien de votre linkedin
										</Label>
										<Input
											className="Profil-group__input"
											defaultValue={linkedinLink}
											type="text"
											name="linkedinLink"
											placeholder="Lien de votre linkedin"
											onChange={this.onLink2change}
											invalid={!!errors.linkedinLink}
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<FormGroup>
										<Label className="Profil-group__label" for="name">
											Lien de vidéo youtube
										</Label>
										<Input
											className="Profil-group__input"
											defaultValue={youtubeLink}
											type="text"
											name="youtubeLink"
											placeholder="Lien de vidéo youtube"
											onChange={this.onLinkchange}
											invalid={!!errors.youtubeLink}
										/>
										<FormFeedback>{errors.youtubeLink}</FormFeedback>
									</FormGroup>
								</Col>
								{youtubeLink && ReactPlayer.canPlay(youtubeLink) ?
									<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6, display: "grid", justifyContent: "center" }}>
										<ReactPlayer
											url={youtubeLink}
											width={"25rem"}
											height={"20rem"}
										/>
									</Col>
									: <Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }} />
								}
							</Row>
						</ListGroup>
						<div style={{ paddingBottom: "1rem" }}>
							<span
								style={{
									color: "gray",
									fontSize: "1.1em"
								}}
							>
								Tous les champs demandés ci-dessous excepté l'email principal seront affichés publiquement dans votre
								fiche entreprise
							</span>
						</div>
						<div style={{ display: "flex", justifyContent: "center" }}>
							<Button
								onClick={this._handleChangeUpdate}
								className="Profil-btn__cancel"
								size="lg"
								text="Annuler"
								color="secondary"
								loading={loading}
							/>

							<Button
								onClick={this._handleSubmit}
								className="Profil-btn__success"
								size="lg"
								text="SAUVEGARDER"
								color="primary"
								loading={loading}
							/>
						</div>
					</CardBody>
				</Card>
			</Col>
		);
	}
}
const UPDATE_ENTREPRISE = gql`
	mutation updateEntreprise($id: ID!, $input: UpdateEntrepriseInput!) {
		updateEntreprise(id: $id, input: $input) {
			id
			application_email
			activity
			effective
			description
			name
			tel
			website
			address
			country
			city
			zip_code
			youtubeLink
			linkedinLink
		}
	}
`;
const UPDATE_USER = gql`
	mutation updateEntrepriseUser($id: ID!, $input: UpdateUserInput!) {
		updateEntrepriseUser(id: $id, input: $input) {
			id
		}
	}
`;

const UPDATE_ENTREPRISE_LOGO = gql`
	mutation updateEntrepriseLogo($file: Upload!, $id: ID) {
		updateEntrepriseLogo(file: $file, id: $id)
	}
`;

const REMOVE_USER_AVATAR = gql`
	mutation removeUserAvatar {
		removeUserAvatar
	}
`;

const UPDATE_ENTREPRISE_BANNER = gql`
	mutation updateEntrepriseBanner($file: Upload!, $id: ID) {
		updateEntrepriseBanner(file: $file, id: $id)
	}
`;
export default compose(
	graphql(UPDATE_ENTREPRISE, {
		name: "updateEntreprise"
	}),
	graphql(UPDATE_USER, {
		name: "updateEntrepriseUser"
	}),
	graphql(REMOVE_USER_AVATAR, {
		name: "removeUserAvatar"
	}),
	graphql(UPDATE_ENTREPRISE_LOGO, {
		name: "updateEntrepriseLogo"
	}),
	graphql(UPDATE_ENTREPRISE_BANNER, {
		name: "updateEntrepriseBanner"
	})
)(EntrepriseInfoUpdate);
