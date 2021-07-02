import React from "react";
import PropTypes from "prop-types";
import { Redirect, withRouter, Link } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import Layout from "../layout/index";
import { IS_LOGGED_IN, GET_KEYVALUE } from "../../handler/queries.local";
import Footer from "../layout/footer/Footer";
import Parser from "html-react-parser";
import Icon from "../../shared/components/Icon";
const routes = [
	{
		path: "/creation-une-offre",
		label: "Création d'une offre",
		parentLabel: "Mes offres",
		hasParent: true,
		showPlus: false,
		parentPath: "/mes-offres",
		icon: "my-account"
	},
	{
		path: "/creation-une-formation",
		label: "Création d'une formation",
		parentLabel: "Mes formation",
		hasParent: true,
		showPlus: false,
		parentPath: "/mes-formation",
		icon: "my-account"
	},
	{
		path: "/creation-une-actualité",
		label: "Création d'une actualité",
		parentLabel: "Actus RH",
		hasParent: true,
		showPlus: false,
		parentPath: "/mes-actualités",
		icon: "my-account"
	},
	{
		path: "/compte",
		parentLabel: "Mes offres",
		hasParent: false,
		parentPath: "/mes-offres",
		label: "Mon compte",
		icon: "my-account"
	},
	{
		path: "/parametres",
		parentLabel: "Mes offres",
		hasParent: false,
		parentPath: "/mes-offres",
		label: "Paramètres",
		icon: "settings"
	},
	{
		path: "/changer-mot-de-passe",
		parentLabel: "Mon compte",
		hasParent: true,
		showPlus: false,
		parentPath: "/compte",
		label: "Changer mon mot de passe",
		icon: "my-account"
	},
	{
		path: "/user-list",
		parentLabel: "Mon compte",
		hasParent: true,
		showPlus: false,
		parentPath: "/compte",
		label: "Liste des utilisateurs",
		icon: "my-account"
	},
	{
		path: "/mes-actualités",
		label: "Actus RH",
		hasParent: false,
		parentPath: "/mes-actualités",
		icon: "my-account"
	},
	{
		path: "/actualité/",
		parentLabel: "Actus RH",
		hasParent: true,
		showPlus: true,
		parentPath: "/mes-actualités",
		label: "Aperçu de : ",
		icon: "my-account"
	},
	{
		path: "/mes-offres",
		label: "Mes offres",
		parentLabel: "Mes offres",
		hasParent: false,
		parentPath: "/mes-offres",
		icon: "my-account"
	},
	{
		path: "/mes-formation",
		label: "Formation",
		parentLabel: "Offres",
		hasParent: false,
		showPlus: false,
		icon: "my-account"
	},
	{
		path: "/associatedCanadidate/",
		parentLabel: "Formation",
		hasParent: true,
		showPlus: true,
		parentPath: "/mes-formation",
		label: "CV associés à :",
		icon: "my-account"
	},
	{
		path: "/formation/",
		parentLabel: "Formation",
		hasParent: true,
		showPlus: true,
		parentPath: "/mes-formation",
		label: "Aperçu de : ",
		icon: "my-account"
	},
	{
		path: "/offre/",
		parentLabel: "Mes offres",
		hasParent: true,
		showPlus: true,
		parentPath: "/mes-offres",
		label: "Aperçu de : ",
		icon: "my-account"
	},
	{
		path: "/ecole/",
		parentLabel: "Les Formation",
		hasParent: false,
		showPlus: false,
		parentPath: "/mes-formation",
		icon: "my-account"
	},
	{
		path: "/rechercher-un-candidat",
		label: "Rechercher un candidat",
		parentLabel: "Mes offres",
		hasParent: false,
		parentPath: "/mes-offres",
		icon: "cv-shared"
	},

	{
		path: "/mon-offre/",
		parentLabel: "Mes offres",
		hasParent: true,
		showPlus: true,
		parentPath: "/mes-offres",
		label: "Détail de : ",
		icon: "my-account"
	},
	{
		path: "/candidature/",
		parentLabel: "Mes offres",
		hasParent: true,
		showPlus: true,
		parentPath: "/mes-offres",
		label: "",
		icon: "my-account"
	},
	{
		path: "/emails/",
		label: "Aperçu et modification du coprs d'un mail",
		parentLabel: "Paramètres",
		hasParent: true,
		showPlus: false,
		parentPath: "/parametres",
		icon: "my-account"
	},
	{
		path: "/candidat/",
		label: "",
		parentLabel: "Cvthèque",
		hasParent: true,
		showPlus: true,
		parentPath: "/rechercher-un-candidat",
		icon: "my-account"
	},
	{
		path: "/tutoriel",
		parentLabel: "Mes offres",
		hasParent: false,
		parentPath: "/mes-offres",
		label: "Tutoriel",
		icon: "help"
	},
	{
		path: "/rgpd",
		label: "RGPD",
		parentLabel: "Mes offres",
		hasParent: false,
		parentPath: "/mes-offres",
		icon: "my-account"
	},
	{
		path: "/mention-legale",
		parentLabel: "Mentions légales",
		hasParent: false,
		parentPath: "/mes-offres",
		label: "Mentions légales",
		icon: "my-account"
	}
];
class PrivateRoute extends React.Component {
	static propTypes = {
		children: PropTypes.element.isRequired,
		isLoggedIn: PropTypes.bool,
		KeyValue: PropTypes.string,
		history: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired
	};

	render() {
		const { children, isLoggedIn, KeyValue } = this.props;

		const { pathname } = this.props.location;

		return isLoggedIn === false ? (
			<Redirect to="/connexion" />
		) : (
				<div id="app">
					<Layout />
					<div className="container__wrap">
						{pathname !== "/" &&
							pathname !== "/accueil" && (
								<div className="pageTitle">
									<Icon className="pageTitle-icon" name="home" />
									<Link to="/accueil">Accueil</Link> /{" "}
									{routes.map(
										route =>
											pathname.includes(route.path) ? route.hasParent ? (
												<React.Fragment>
													<Link to={route.parentPath}>{route.parentLabel}</Link> / {route.label}{" "}
													{KeyValue && route.showPlus ? Parser(KeyValue) : null}
												</React.Fragment>
											) : (
													route.label
												) : null
									)}
								</div>
							)}
						{children}
					</div>
					<Footer />
				</div>
			);
	}
}

export default withRouter(
	compose(
		graphql(IS_LOGGED_IN, {
			props: ({ data: { isLoggedIn } }) => ({
				isLoggedIn: isLoggedIn ? isLoggedIn.isLoggedIn : false
			})
		}),
		graphql(GET_KEYVALUE, {
			props: ({ data: { KeyValue } }) => ({
				KeyValue: KeyValue ? KeyValue.KeyValue : null
			})
		})
	)(PrivateRoute)
);
