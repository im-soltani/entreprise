import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Container } from "reactstrap";
import Parser from "html-react-parser";
import * as moment from "moment";
import Icon from "../../../shared/components/Icon";
import { BASE_URL } from "../../../handler/utils/constants";
const MAX_LENGTH = 30;
const logo = `${process.env.PUBLIC_URL}/img/images/logo-placeholder.jpeg`;

class ActualitéItem2 extends React.PureComponent {
	static propTypes = {
		actualite: PropTypes.object
	};

	static defaultProps = {
		actualite: {}
	};
	state = {
		src: process.env.PUBLIC_URL + this.props.actualite.entreprise.profile_pic_url
	}
	render() {
		const { actualite } = this.props;
		return (
			<Container key={actualite.num} className="OfferItem">
				<Row key={actualite._id.toString()} className="EntrepriseItem" style={{ borderBottom: 0, padding: 0 }}>
					<Col xs={12} md={2} lg={2} xl={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
						{actualite.entreprise.profile_pic_url ? (
							<img
								src={this.state.src}
								onError={() => { this.setState({ src: logo }) }}
								style={{ width: "5rem", height: "5rem", borderRadius: "100%" }}
							/>
						) : (
								<img src={BASE_URL + "/media/logos/logo.png"} style={{ width: "80%", height: "90%" }} />
							)}
					</Col>
					<Col xs={12} md={3} lg={3} xl={3} style={{ display: "flex", flexDirection: "column", paddingTop: "2rem" }}>
						<div className="OfferItemDetailHeader-text">
							{actualite.title.length > MAX_LENGTH ? (
								<div>{`${actualite.title.substring(0, MAX_LENGTH)}...`}</div>
							) : (
									actualite.title
								)}
						</div>
						<div>
							{actualite.eventDate && (
								<Row style={{ flexWrap: "wrap", paddingLeft: 20, paddingTop: 10, alignItems: "center" }}>
									<div style={{ fontSize: 16, opacity: 0.7 }}>Publiée le {" "}{moment(actualite.startPublication).format("DD/MM/YYYY")}</div>
								</Row>
							)}
						</div>
					</Col>
					<Col xs={12} md={6} lg={6} xl={6}> <div className="max-lines" style={{ paddingTop: "2rem" }}>{Parser(actualite.description)}</div></Col>
					<Col xs={12} md={1} lg={1} xl={1}>
						{actualite.lien && (
							<Row style={{ position: "absolute", bottom: "1rem", right: "1rem", paddingRight: 10 }}>
								<div
									style={{ color: "blue", cursor: "pointer", paddingTop: "1rem", flexDirection: "row" }}
									onClick={() => window.open(actualite.lien, "actualite.title", "resizable=yes")}
								>
									<Icon className="EntrepriseDetail-icon" name="out-icon" style={{ marginRight: "0.5em" }} />
									<span style={{ fontWeight: "bold", fontSize: "0.9rem", }}>
										Voir plus
							</span>
								</div>
							</Row>

						)}
					</Col>
				</Row>

			</Container>
		);
	}
}

export default ActualitéItem2;
