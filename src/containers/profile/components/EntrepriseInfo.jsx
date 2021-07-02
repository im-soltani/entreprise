import React from "react";
import PropTypes from "prop-types";
import { CardBody, ListGroup, Row, Col } from "reactstrap";
import ReactPlayer from "react-player/youtube"
import Parser from "html-react-parser";
import EditIcon from "mdi-react/EditIcon";
import ItemDetails from "../../../shared/components/ItemDetails";
class EntrepriseInfo extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		title: PropTypes.string,
		user: PropTypes.object.isRequired,
		handleChangeUpdate: PropTypes.func,
		loading: PropTypes.bool.isRequired
	};

	static defaultProps = {
		className: "Profil",
		title: ""
	};

	_handleChangeUpdate = () => {
		this.props.handleChangeUpdate();
	};
	render() {
		const {
			user: {
				name,
				profile,
				leaderProfile,
				tel,
				profile_pic_url,
				application_email,
				name_of_in_charge,
				address_2,
				banner,
				website,
				description,
				activity,
				effective,
				address,
				youtubeLink,
				linkedinLink
			}
		} = this.props;
		return (
			<CardBody>
				<div className="Profil-banner">
					<img className="img-banner_2" src={banner} alt={"logo"} />
				</div>
				<div className="Profil-logo">
					<img className="Profil-logo__img" src={profile_pic_url} alt={"logo"} />
				</div>
				<div style={{ paddingTop: "1rem" }}>
					<span
						style={{
							color: "gray",
							fontSize: "1.1em"
						}}
					>
						Tous les champs demandés ci-dessous excepté l'email principal seront affichés publiquement dans votre fiche
						entreprise
					</span>
				</div>
				<ListGroup tag="div" className="Profil-group">
					{profile.isleader == "false" && (
						<div>
							<span className="profile-div3">Infos personnel</span>
							<Row>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<ItemDetails label="Nom et prenom" value={profile.name + " " + profile.prenom} />
								</Col>
								<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
									<ItemDetails label="Email" value={profile.email} />
								</Col>
							</Row>
						</div>
					)}
					<span className="profile-div3">Infos entreprise</span>
					<Row>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Nom de la société" value={name} />
						</Col>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Nom, prénom du responsable" value={name_of_in_charge} />
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Email principal" value={leaderProfile.email} />
						</Col>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Email de candidature" value={application_email} />
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Adresse principal" value={address} />
						</Col>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Autre établissement" value={address_2} />
						</Col>
					</Row>

					<Row>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Numéro de téléphone" value={tel} />
						</Col>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<a target="blank" href={website}>
								<ItemDetails label="Site web" value={website} />
							</a>
						</Col>
					</Row>
					<Row>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Activité" array={true} value={activity} />
						</Col>
						<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
							<ItemDetails label="Effectif" value={effective} />
						</Col>
					</Row>
					{linkedinLink &&
						<Row>
							<Col xs={12} md={12} lg={12} xl={12} style={{ marginBottom: 6 }}>
								<a target="blank" href={linkedinLink}>
									<ItemDetails label="Lien Linkedin" value={linkedinLink} />
								</a>
							</Col>
						</Row>}
					<Row style={{ marginBottom: 6 }}>
						<Col xs={12} md={12} lg={12} xl={12}>
							<ItemDetails label="Présentation de l'entreprise" value={description && Parser(description)} />
						</Col>
					</Row>
					{youtubeLink &&
						<Row>
							<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6 }}>
								<a target="blank" href={youtubeLink}>
									<ItemDetails label="Lien de vidéo youtube" value={youtubeLink} />
								</a>
							</Col>
							<Col xs={12} md={12} lg={6} xl={6} style={{ marginBottom: 6, display: "grid", justifyContent: "center" }}>
								<ReactPlayer
									url={youtubeLink}
									width={"25rem"}
									height={"20rem"}
								/>
							</Col>
						</Row>}
				</ListGroup>
				<div className="Button-add__div" title="Modifier">
					<span className="Button-add__btn" onClick={this._handleChangeUpdate}>
						<EditIcon className="Button-add__btn-icon" />
					</span>
				</div>
			</CardBody>
		);
	}
}

export default EntrepriseInfo;
