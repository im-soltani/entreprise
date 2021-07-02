import React, { PureComponent } from "react";
import { Card, Col, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import PropTypes from "prop-types";
import classnames from "classnames";
import ProfilLetter from "./ProfilLetter";

export default class ProfileTabs extends PureComponent {
	static propTypes = {
		entreprise: PropTypes.object.isRequired
	};
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: "1",
			status: "TOUT",
			field: "name",
			direction: 1,
			activePage: 1,
			search: ""
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		const { entreprise } = this.props;
		return (
			<Col md={12} lg={7} xl={8}>
				<Card>
					<div className="profile__card tabs tabs--bordered-bottom">
						<img src={entreprise.banner} className="profile_banner" />
						<div className="tabs__wrap">
							<Nav tabs>
								<NavItem>
									<NavLink
										className={classnames({
											active: this.state.activeTab === "1"
										})}
										onClick={() => {
											this.toggle("1");
										}}
									>
										Description
									</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab}>
								<TabPane tabId="1">
									<ProfilLetter description={entreprise.description} youtubeLink={entreprise.youtubeLink} />
								</TabPane>
							</TabContent>
						</div>
					</div>
				</Card>
			</Col>
		);
	}
}
