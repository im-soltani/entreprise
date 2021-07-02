import React, { PureComponent } from "react";
import DownIcon from "mdi-react/ChevronDownIcon";
import { Collapse } from "reactstrap";
import { graphql, compose } from "react-apollo";

import gql from "graphql-tag";
import PropTypes from "prop-types";
import { SET_TOKEN } from "../../../handler/mutations.local";
import TopbarMenuLink from "./TopbarMenuLink";
import { clientLogout } from "../../app/App";
const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;

class TopbarProfile extends PureComponent {
	static propTypes = {
		setToken: PropTypes.func.isRequired,
		getEntrepriseProfile: PropTypes.object.isRequired,
		history: PropTypes.object,
		loading: PropTypes.bool,
		error: PropTypes.object
	};

	static defaultProps = {
		loading: true,
		getEntrepriseProfile: {
			name: "Mon compte",
			profile_pic_url: null,
			profile: {
				isleader: null
			}
		}
	};

	constructor() {
		super();
		this.state = {
			collapse: false
		};
	}

	toggle = () => {
		this.setState({ collapse: !this.state.collapse });
	};

	logout = () => {
		this.props
			.setToken({
				variables: {
					token: null
				}
			})
			.then(() => {
				clientLogout();
			});
	};
	componentDidUpdate() {
		if (!this.props.loading && this.props.error) {
			this.props
			.setToken({
				variables: {
					token: null
				}
			}).then(() => {
				clientLogout();
				this.props.history.push("/connexion");
			})
		}
	}
	render() {
		const { name, profile_pic_url, profile } = this.props.getEntrepriseProfile;
		return (
			<div className="topbar__profile">
				<button className="topbar__avatar" onClick={this.toggle}>
					{profile_pic_url ? (
						<img src={profile_pic_url} alt="avatar" className="topbar__avatar-img" />
					) : (
						<img className="topbar__avatar-img" src={Ava} alt="avatar" />
					)}
					{profile.isleader == "false" ? (
						<p className="topbar__avatar-name">{profile.prenom}</p>
					) : (
						<p className="topbar__avatar-name">{name}</p>
					)}
					<DownIcon className="topbar__icon" />
				</button>
				{this.state.collapse && <button className="topbar__back" onClick={this.toggle} />}
				<Collapse isOpen={this.state.collapse} className="topbar__menu-wrap">
					<div className="topbar__menu" onClick={this.toggle}>
						<TopbarMenuLink title="Profil" icon="user" path="/compte" />
						{profile.isleader != "false" && <TopbarMenuLink title="Utilisateurs" icon="keyboard" path="/user-list" />}
						<TopbarMenuLink title="Changer le mot de passe" icon="keyboard" path="/changer-mot-de-passe" />
						<div className="topbar__menu-divider" />
						<TopbarMenuLink title="Déconnexion" icon="exit" button={true} callback={this.logout} />
					</div>
				</Collapse>
			</div>
		);
	}
}
const GET_ENTRPRISE = gql`
	query getEntrepriseProfile {
		getEntrepriseProfile {
			name
			profile_pic_url
			profile {
				isleader
				email
				is_verified
				name
				prenom
			}
		}
	}
`;
export default compose(
	graphql(GET_ENTRPRISE, {
		options: () => ({
			fetchPolicy: "cache-and-network"
		}),
		props: ({ data: { loading, error, getEntrepriseProfile } }) => ({
			loading,
			error,
			getEntrepriseProfile
		})
	}),
	graphql(SET_TOKEN, {
		name: "setToken"
	})
)(TopbarProfile);
