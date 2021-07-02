import React from "react";
import { Modal, ModalHeader, Row, ModalBody, Label, Input, FormGroup, Col } from "reactstrap";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import { GET_ANNOTATION } from "../../../handler/queries";
import Button from "../../../shared/components/Button";
import Alert from "../../../handler/utils/Alert";

const defaultErrors = {
	commentaire: null
};
class AddAnnotationModal extends React.Component {
	static propTypes = {
		toggle: PropTypes.func,
		toggleModal: PropTypes.func,
		addAnnotation: PropTypes.func,
		getEntrepriseProfile: PropTypes.object.isRequired,
		modal: PropTypes.bool,
		refetch: PropTypes.func,
		candidat_id: PropTypes.string.isRequired
	};
	static defaultProps = {
		modal: false,
		getEntrepriseProfile:null,
	};

	constructor(props) {
		super(props);
		this.state = {
			modal: props.modal,
			commentaire: "",
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
		const { commentaire, loading } = this.state;
		const {getEntrepriseProfile,candidat_id} = this.props;
		if (!loading) {
			const errors = {
				...defaultErrors
			};

			if (!commentaire)
				errors.commentaire = "Veuillez saisir votre commentaire";

			if (errors.commentaire) {
				this.setState({ errors: { ...errors } });
				Alert.warning("Merci de corriger les problèmes identifiés dans le formulaire");
			} else {
				this.setState({ loading: false, errors });
				this.props
				.addAnnotation({
					variables: {
						input: {
							commentaire,
							entreprise_id: getEntrepriseProfile.id,
							user_id:getEntrepriseProfile.profile.id,
						  candidate_id:candidat_id
						}
					},
					refetchQueries: [
						{
							query: GET_ANNOTATION,
							variables: {
                entreprise_id: getEntrepriseProfile.id,
                candidate_id:candidat_id,
							}
						}
					]
				})
				.then(() => {
					this.props.refetch();
					this.props.toggleModal();
					Alert.success("La commentaire a été ajoutée avec succès");
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
						Ajouter Une Annotation
				</ModalHeader>
				<ModalBody className="">

					<Row style={{ marginBottom: 6 }}>
						<Col xs={9} md={9} lg={9} xl={9}>
							<FormGroup>
								<Label className="Profil-group__label" for="nom">
									Commentaire
									<span style={{ marginLeft: 5, color: "red" }}>*</span>
								</Label>
								<Input
									className=""
									onChange={event => this.onChange("commentaire", event)}
									defaultValue={this.commentaire}
									name="commentaire"
									type="textarea"
									placeholder="Saisie une commentaire sur ce condidat"
									invalid={!!errors.commentaire}
								/>
								{errors.commentaire && <span className="span-error">{errors.commentaire}</span>}
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
			name
			profile {
				id
				email
				name
				prenom
				isleader
			}
			leaderProfile {
				id
				email
				name
				prenom
				isleader
			}
			application_email
		}
	}
`;
const ADD_ANNOTATION = gql`
	mutation addAnnotation($input: AnnotationInput!) {
		addAnnotation(input: $input) {
			commentaire
		}
	}
`;

export default withRouter(
	compose(
		graphql(ADD_ANNOTATION, {
			name: "addAnnotation"
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
	)(AddAnnotationModal)
);
