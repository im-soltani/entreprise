import React from "react";
import { Modal, ModalHeader, Row, ModalBody, Label, Input, FormGroup, Col } from "reactstrap";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import Button from "../../../shared/components/Button";
import { EMAIL_REGEX } from "../../../handler/utils/constants";
import Alert from "../../../handler/utils/Alert";
import { checkEmail } from "../../../handler/api/auth";
import { GET_ENTREPRISES_USERS } from "../../../handler/queries";

const defaultErrors = {
	nom: null,
	prenom: null,
	email: null
};
class AddUserModal extends React.Component {
	static propTypes = {
		toggle: PropTypes.func,
		toggleModal: PropTypes.func,
		addEntrepriseProfile: PropTypes.func,
		getEntrepriseProfile: PropTypes.object.isRequired,
		modal: PropTypes.bool,
		refetch: PropTypes.func
	};
	static defaultProps = {
		modal: false,
		getEntrepriseProfile: {
			id: "",
			name: ""
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			modal: props.modal,
			nom: "",
			prenom: "",
			email: "",
			loading: false,
			errors: {
				...defaultErrors
			}
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.modal !== this.props.modal) this.setState({ modal: nextProps.modal });
	}
	_handleAdd = async () => {
		const { nom, prenom, email, loading } = this.state;
		if (!loading) {
			const errors = {
				...defaultErrors
			};

			if (!nom ) errors.nom = "Le nom est obligatoire";
			if (!prenom )
				errors.prenom = "Le prenom est obligatoire";
			if (!EMAIL_REGEX.test(email)) errors.email = "Le email est obligatoire et doit etre de valid form";
			else {
				await checkEmail({ email })
					.then(({ success, message }) => {
						if (!success) {
							errors.email = message;
						}
					})
					.catch(() => {});
			}
			if (errors.nom || errors.prenom || errors.auteur || errors.email) {
				this.setState({ errors: { ...errors } });
				Alert.warning("Merci de corriger les problèmes identifiés dans le formulaire");
			} else {
				this.setState({ loading: true, errors });
				const { id, company_id } = this.props.getEntrepriseProfile;

				this.props
					.addEntrepriseProfile({
						variables: {
							input: {
								name: nom,
								prenom,
								email,
								leaderUid: id
							}
						},
						refetchQueries: [
							{
								query: GET_ENTREPRISES_USERS,
								variables: {
									search: "",
									skip: 0,
									limit: 999999,
									id: company_id
								}
							}
						]
					})
					.then(() => {
						this.props.refetch();
						this.props.toggleModal();
						this.setState({ loading: false });
						Alert.success("L'entreprise a été ajoutée avec succès");
					})
					.catch(e => {
						console.log(e);
					});
			}
		}
	};
	onChange(name, event) {
		this.setState({ [name]: event.target.value });
	}
	render() {
		const { modal, errors } = this.state;
		const { toggleModal } = this.props;

		return (
			<Modal isOpen={modal} toggle={toggleModal} className="ModalCV">
				<ModalHeader toggle={toggleModal} style={{ textTransform: "uppercase" }}>
					ajouter un utilisateur
				</ModalHeader>
				<ModalBody className="">
					<Row style={{ marginBottom: 6 }}>
						<Col xs={9} md={9} lg={9} xl={9}>
							<FormGroup>
								<Label className="Profil-group__label" for="nom">
									Nom
									<span style={{ marginLeft: 5, color: "red" }}>*</span>
								</Label>
								<Input
									className="Profil-group__input"
									onChange={event => this.onChange("nom", event)}
									defaultValue={this.nom}
									name="nom"
									type="text"
									placeholder="Saisie le nom de profile"
									invalid={!!errors.nom}
								/>
								{errors.nom && <span className="span-error">{errors.nom}</span>}
							</FormGroup>
						</Col>
					</Row>
					<Row style={{ marginBottom: 6 }}>
						<Col xs={9} md={9} lg={9} xl={9}>
							<FormGroup>
								<Label className="Profil-group__label" for="nom">
									Prénom
									<span style={{ marginLeft: 5, color: "red" }}>*</span>
								</Label>
								<Input
									className="Profil-group__input"
									onChange={event => this.onChange("prenom", event)}
									defaultValue={this.prenom}
									name="prenom"
									type="text"
									placeholder="Saisie le prenom de profile"
									invalid={!!errors.prenom}
								/>
								{errors.prenom && <span className="span-error">{errors.prenom}</span>}
							</FormGroup>
						</Col>
					</Row>
					<Row style={{ marginBottom: 6 }}>
						<Col xs={9} md={9} lg={9} xl={9}>
							<FormGroup>
								<Label className="Profil-group__label" for="nom">
									Email
									<span style={{ marginLeft: 5, color: "red" }}>*</span>
								</Label>
								<Input
									className="Profil-group__input"
									onChange={event => this.onChange("email", event)}
									defaultValue={this.email}
									name="email"
									type="text"
									placeholder="Saisie l'email de connexion"
									invalid={!!errors.email}
								/>
								{errors.email && <span className="span-error">{errors.email}</span>}
							</FormGroup>
						</Col>
					</Row>
					<div className="Profil-btns">
						<Button
							onClick={toggleModal}
							className="Profil-btn__cancel"
							size="lg"
							text="Annuler"
							color="secondary"
							loading={this.state.loading}
						/>
						<Button
							onClick={this._handleAdd}
							className="Profil-btn__success"
							size="lg"
							text={"AJOUTER"}
							color="primary"
							loading={this.state.loading}
						/>
					</div>
				</ModalBody>
			</Modal>
		);
	}
}
const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			id
			company_id
		}
	}
`;
const ADD_ENTREPRISE_POFILE = gql`
	mutation addEntrepriseProfile($input: EntrepriseProfileInput!) {
		addEntrepriseProfile(input: $input) {
			name
		}
	}
`;

export default withRouter(
	compose(
		graphql(ADD_ENTREPRISE_POFILE, {
			name: "addEntrepriseProfile"
		}),
		graphql(GET_ENTRPRISE, {
			options: () => ({
				fetchPolicy: "cache-and-network"
			}),
			props: ({ data: { loading, error, getEntrepriseProfile } }) => ({
				loading,
				error,
				getEntrepriseProfile,
			})
		})
	)(AddUserModal)
);
