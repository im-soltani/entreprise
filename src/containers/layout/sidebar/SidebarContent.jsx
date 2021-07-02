import React, { Component } from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import Logo from "../../../shared/components/Logo";
import Icon from "../../../shared/components/Icon";
import SidebarCategory from "./SidebarCategory";

class SidebarContent extends Component {
	static propTypes = {
		onClick: PropTypes.func.isRequired,
		sidebarCollapse: PropTypes.bool.isRequired,
		changeSidebarVisibility: PropTypes.func.isRequired,
		onShow: PropTypes.func.isRequired,
		history: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired,
		getEntrepriseProfile: PropTypes.object.isRequired
	};
	static defaultProps = {
		getEntrepriseProfile: {
			ent_type: null
		}
	};
	hideSidebar = () => {
		this.props.onClick();
	};
	showSidebar = () => {
		this.props.onShow();
	};
	constructor(props) {
		super(props);
		this.state = {
			sidebarCollapse: props.sidebarCollapse
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.sidebarCollapse !== this.props.sidebarCollapse)
			this.setState({ sidebarCollapse: nextProps.sidebarCollapse });
	}
	render() {
		const { pathname } = this.props.location;
		return (
			<div className="sidebar__content">
				<div className="text-center mb-sm-5">
					{!this.state.sidebarCollapse && <Logo />}
					<div onClick={this.props.changeSidebarVisibility} style={{ cursor: "pointer" }}>
						<Icon className="sidebar__menu-icon" name="menu-button" />
					</div>
				</div>
				<ul className="sidebar__block">
					<SidebarLink
						key={"1"}
						route={{
							label: "Accueil",
							to: "/accueil",
							icon: "home",
							hasSubMenu: false,
							isActive: pathname === "/" || pathname === "/accueil",
							className: "sidebar__link"
						}}
						onClick={this.hideSidebar}
					/>
					<SidebarCategory
						route={{
							label: "Offres",
							to: "/mes-offres",
							isActive:
								pathname === "/mes-offres" || pathname === "/mes-formation" || pathname === "/creation-une-offre",
							icon: "my-offers",
							className: "sidebar__link",
							index: ""
						}}
						sidebarCollapse={this.state.sidebarCollapse}
					>
						<SidebarLink
							key={"2"}
							route={{
								label: "Créer une offre",
								to: "/creation-une-offre",
								isActive: pathname === "/creation-une-offre",
								hasSubMenu: false,
								className: "sidebar__link1",
								icon: "create-offer"
							}}
							onClick={this.hideSidebar}
						/>
						<SidebarLink
							key={"3"}
							route={{
								label: "Offres et candidatures",
								className: "sidebar__link1",
								hasSubMenu: false,
								isActive: pathname === "/mes-offres",
								to: "/mes-offres",
								icon: "files"
							}}
							onClick={this.hideSidebar}
						/>
						<SidebarLink
							key={"4"}
							route={{
								label: "Liste des formation",
								className: "sidebar__link1",
								hasSubMenu: false,
								isActive: pathname === "/mes-formation",
								to: "/mes-formation",
								icon: "files"
							}}
							onClick={this.hideSidebar}
						/>
					</SidebarCategory>
					<SidebarCategory
						route={{
							label: "Cvthèque",
							to: "/mes-cv",
							icon: "cvtheque",
							isActive:
								pathname === "/cv-partages" ||
								pathname === "/mes-cv" ||
								pathname === "/mes-cv/deposes" ||
								pathname === "/mes-cv/favoris",
							className: "sidebar__link",
							index: ""
						}}
						sidebarCollapse={this.state.sidebarCollapse}
					>
						<SidebarLink
							key={"5"}
							route={{
								label: "Déposer un CV",
								to: "/accueil",
								isActive: false,
								className: "sidebar__link1",
								icon: "add-cv",
								hasSubMenu: false
							}}
							onClick={this.hideSidebar}
						/>
						<SidebarLink
							key={"6"}
							route={{
								label: "Rechercher un candidat",
								to: "/rechercher-un-candidat",
								hasSubMenu: false,
								isActive: pathname === "/rechercher-un-candidat",
								className: "sidebar__link1",
								icon: "cv-shared"
							}}
							onClick={this.hideSidebar}
						/>
					</SidebarCategory>
					<SidebarLink
						key={"7"}
						route={{
							label: "Mon compte",
							to: "/compte",
							hasSubMenu: false,
							isActive: pathname === "/compte",
							className: "sidebar__link",
							icon: "my-account"
						}}
						onClick={this.hideSidebar}
					/>
					<SidebarLink
						key={"8"}
						route={{
							label: "Paramètres",
							to: "/parametres",
							isActive: pathname === "/parametres",
							icon: "settings",
							className: "sidebar__link"
						}}
						onClick={this.hideSidebar}
					/>

					<SidebarLink
						key={"9"}
						route={{
							label: "Tutoriel",
							to: "/tutoriel",
							hasSubMenu: false,
							isActive: pathname === "/tutoriel",
							className: "sidebar__link",
							icon: "help"
						}}
						onClick={this.hideSidebar}
					/>
				</ul>
			</div>
		);
	}
}
const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			ent_type
		}
	}
`;

export default withRouter(
	compose(
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
	)(SidebarContent)
);
