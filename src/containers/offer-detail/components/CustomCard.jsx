import React from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import Icon from "../../../shared/components/Icon";
import Image from "../../../shared/components/Image";

import { Link } from "react-router-dom";
import MenuDown from "mdi-react/HamburgerMenuIcon";
const MAX_LENGTH = 25;
class CustomCard extends React.Component {
  static propTypes = {
    refuseApplication: PropTypes.func,
    last_name: PropTypes.string,
    first_name: PropTypes.string,
    num: PropTypes.number,
    candidat_id: PropTypes.string,
    app_num: PropTypes.string,
    eventBus: PropTypes.any,
    laneId: PropTypes.string,
    note: PropTypes.number,
    id: PropTypes.string,
    jobs: PropTypes.array,
    state: PropTypes.string,
    etude: PropTypes.string,
    avatar: PropTypes.string,
    experience: PropTypes.string,
    disponibility: PropTypes.string,
    mutate: PropTypes.func,
    refetch: PropTypes.func
  };

  static defaultProps = {};
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      last_name: props.last_name,
      first_name: props.first_name,
      candidat_id: props.candidat_id,
      num: props.num,
      app_num: props.app_num,
      laneId: props.laneId,
      id: props.id,
      jobs: props.jobs,
      state: props.state,
      experience: props.experience,
      disponibility: props.disponibility,
      note: props.note,
      etude: props.etude,
      avatar: props.avatar
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState({
        id: nextProps.id,
        candidat_id: nextProps.candidat_id,
        state: nextProps.state,
        first_name: nextProps.first_name,
        laneId: nextProps.laneId,
        last_name: nextProps.last_name,
        num: nextProps.num,
        jobs: nextProps.jobs,
        app_num: nextProps.app_num,
        disponibility: nextProps.disponibility,
        experience: nextProps.experience,
        note: nextProps.note,
        etude: nextProps.etude
      });
    }
  }
  render() {
    const {
      id,
      state,
      laneId,
      last_name,
      first_name,

      candidat_id,
      app_num,
      dropdownOpen,
      disponibility,
      experience,
      etude,
      avatar,
      jobs
    } = this.state;
    return (
      <div
        style={{
          maxWidth: "100%",
          margin: "auto",
          height: "10em",
          marginBottom: "2em"
        }}>
        <Row>
          <Col xs={3} md={3} lg={3} xl={3} style={{ padding: 0 }}>
            {!!avatar ? (
              <Image
                style={{ width: "5em", maxHeight: "5em", float: "right" }}
                src={avatar}
              />
            ) : (
                <div className="OfferDetailTabs-candidat__letters-div">
                  <div className="OfferDetailTabs-candidat__letters">
                    {`${`${first_name.charAt(0) +
                      last_name.charAt(0)}`}`.toUpperCase()}
                  </div>
                </div>
              )}
          </Col>
          <Col
            xs={9}
            md={9}
            lg={9}
            xl={9}
            style={{
              paddingLeft: 10,
              boxShadow: "rgb(228, 224, 224) 1px 2px 4px 2px",
            }}>
            <div
              style={{
                paddingBottom: 6,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                color: "#295ebe"
              }}>
              <div style={{ fontSize: 14, fontWeight: "bold" }}>
                <Link to={`/candidature/${app_num}`}>
                  {first_name} <br /> {last_name}
                </Link>
              </div>
              <div
                style={{
                  fontSize: 22,
                  right: 8,
                  position: "absolute"
                }}>
                <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle className="OfferDetailTabs-dropdown-toggle">
                    <MenuDown className="OfferDetailTabs-dropdown-toggle_icon" />
                  </DropdownToggle>
                  <DropdownMenu className="OfferDetailTabs-dropdown-menu">
                    <DropdownItem
                      className="OfferDetailTabs-dropdown-item"
                      onClick={() =>
                        this.props
                          .mutate({
                            variables: {
                              id: id,
                              state: "PENDING"
                            }
                          })
                          .then(() => {
                            this.props.refetch();
                            this.props.eventBus.publish({
                              type: "MOVE_CARD",
                              fromLaneId: laneId,
                              toLaneId: "lane1",
                              cardId: id,
                              index: 0
                            });
                          })
                      }>
                      NOn traitée
                    </DropdownItem>
                    <DropdownItem
                      className="OfferDetailTabs-dropdown-item"
                      onClick={() =>
                        this.props
                          .mutate({
                            variables: {
                              id: id,
                              state: "APPROVED"
                            }
                          })
                          .then(() => {
                            this.props.refetch();
                            this.props.eventBus.publish({
                              type: "MOVE_CARD",
                              fromLaneId: laneId,
                              toLaneId: "lane2",
                              cardId: id,
                              index: 0
                            });
                          })
                      }>
                      selectionnée
                    </DropdownItem>
                    <DropdownItem
                      className="OfferDetailTabs-dropdown-item"
                      onClick={() =>
                        this.props
                          .mutate({
                            variables: {
                              id: id,
                              state: "ACCEPTED"
                            }
                          })
                          .then(() => {
                            this.props.refetch();
                            this.props.eventBus.publish({
                              type: "MOVE_CARD",
                              fromLaneId: laneId,
                              toLaneId: "lane3",
                              cardId: id,
                              index: 0
                            });
                          })
                      }>
                      RETENUE
                    </DropdownItem>
                    <DropdownItem
                      className="OfferDetailTabs-dropdown-item"
                      onClick={
                        () =>
                          this.props.refuseApplication({
                            id: id,
                            app_num: app_num,
                            candidat_id: candidat_id
                          })
                      }>
                      réfusée
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div style={{ fontSize: 11 }}>
              <Icon className="OfferDetailTabs-icon" name="candidat-brief" />
              <span style={{ fontWeight: "bold" }}>
                {(jobs && jobs.length > 0) ? jobs[0].substring(0, MAX_LENGTH) + "..." : "--"}
              </span>
            </div>
            <div style={{ fontSize: 11 }}>
              <Icon
                className="OfferDetailTabs-icon"
                name="experience-candidat"
              />
              <span style={{ fontWeight: "bold" }}>
                {experience ? experience : "--"}
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#BD3B36" }}>
              <div style={{ color: "#4C4C4C", fontWeight: "bold" }}>
                <Icon className="OfferDetailTabs-icon" name="candidat-etude" />
                {etude ? etude : "--"}
              </div>
              {laneId === "lane2" && (
                <div
                  onClick={() =>
                    this.props
                      .mutate({
                        variables: {
                          id: id,
                          state:
                            state === "APPROVED"
                              ? "CALLED_TO_INETRVIEW"
                              : "APPROVED"
                        }
                      })
                      .then(() => {
                        this.setState({
                          state:
                            state === "APPROVED"
                              ? "CALLED_TO_INETRVIEW"
                              : "APPROVED"
                        });
                      })
                  }>
                  {state === "CALLED_TO_INETRVIEW" && (
                    <Icon
                      className={"OfferDetailTabs-icon-entretien-green"}
                      name="entretien-candidat"
                    />
                  )}
                  {laneId === "lane2" && state !== "CALLED_TO_INETRVIEW" && (
                    <Icon
                      className={"OfferDetailTabs-icon-entretien"}
                      name="entretien-candidat"
                    />
                  )}
                </div>
              )}
              <div
                style={{
                  color: "#4C4C4C",
                  fontWeight: "bold",
                  marginBottom: "1em"
                }}>
                <Icon
                  className="OfferDetailTabs-icon"
                  name="disponibilty-candidat"
                />
                {disponibility}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CustomCard;
