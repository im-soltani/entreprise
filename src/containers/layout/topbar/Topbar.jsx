import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TopbarSidebarButton from "./TopbarSidebarButton";
import TopbarProfile from "./TopbarProfile";
import Icon from "../../../shared/components/Icon";
const routes = [
	{
		label: "Accueil",
		to: "/accueil",
		icon: "home"
	},
	{
		label: "Mon compte",
		to: "/compte",
		icon: "my-account"
	},
	{
		label: "Mes CV",
		to: "/mes-cv",
		icon: "my-cv"
	},
	{
		label: "Candidat",
		to: "/candidat/",
		icon: "my-cv"
	},
	{
		label: "CV Partagés",
		to: "/cv-partages",
		icon: "shared-cv"
	},
	{
		label: "Création d'une offre",
		to: "/creation-une-offre",
		icon: "my-offers"
	},
	{
		label: "Création d'une formation",
		to: "/creation-une-formation",
		icon: "my-offers"
	},
	{
		label: "Mes offres",
		to: "/mes-offres",
		icon: "my-offers"
	},
	{
		label: "Liste des formation",
		to: "/mes-formation",
		icon: "my-offers"
	},
	{
		label: "Aperçu d'une offre",
		to: "/offre/",
		icon: "my-offers"
	},
	{
		label: "Mon Offre",
		to: "/mon-offre",
		icon: "my-offers"
	},
	{
		label: "Création d'une Actus RH",
		to: "/creation-une-actualité",
		icon: "my-offers"
	},
	{
		label: "Actus RH",
		to: "/mes-actualités",
		icon: "my-offers"
	},
	{
		label: "Aperçu d'une Actus RH",
		to: "/actualité/",
		icon: "my-offers"
	},
	{
		label: "Création d'une formation",
		to: "/creation-une-formation",
		icon: "my-offers"
	},
	{
		label: "Mes formation",
		to: "/mes-formation",
		icon: "my-offers"
	},
	{
		label: "Aperçu d'une formation",
		to: "/formation/",
		icon: "my-offers"
	},
	{
		label: "CV associés à une formation",
		to: "/associatedCanadidate/",
		icon: "my-offers"
	},
	{
		label: "Paramètres",
		to: "/parametres",
		icon: "settings"
	},
	{
		label: "Changer le mot de passe",
		to: "/changer-mot-de-passe",
		icon: "settings"
	},
	{
		label: "Tutoriel",
		to: "/tutoriel",
		icon: "help"
	},
	{
		label: "RGPD",
		to: "/rgpd",
		icon: "help"
	},
	{
		label: "Mentions légales",
		to: "/mention-legale",
		icon: "help"
	}
];
class Topbar extends PureComponent {
	static propTypes = {
		changeMobileSidebarVisibility: PropTypes.func.isRequired,
		changeSidebarVisibility: PropTypes.func.isRequired,
		sidebarCollapse: PropTypes.bool.isRequired,
		history: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired
	};

	render() {
		const { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;

		return (
			<div className="topbar">
				<div className="topbar__wrapper">
					<div className="topbar__left">
						<TopbarSidebarButton
							changeMobileSidebarVisibility={changeMobileSidebarVisibility}
							changeSidebarVisibility={changeSidebarVisibility}
						/>
						<div className="Topbar-divs">
							{this.props.location.pathname === "/" && (
								<div style={{ width: "100%" }}>
									<Icon className="Topbar-icons" name={"home"} />
									<span className="Topbar-spans">Accueil</span>
								</div>
							)}
							{routes.map((route, index) => {
								if (
									(this.props.location.pathname !== "/" && this.props.location.pathname === route.to) ||
									(this.props.location &&
										this.props.location.pathname.length !== 1 &&
										this.props.location.pathname !== "/" &&
										this.props.location.pathname.includes(route.to))
								)
									return (
										<div key={index} style={{ width: "100%" }}>
											<Icon className="Topbar-icons" name={route.icon} />
											<span className="Topbar-spans">{route.label}</span>
										</div>
									);
							})}
						</div>
					</div>
					<div className="topbar__right">
						<TopbarProfile />
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Topbar);
