import React, { PureComponent } from "react";
import {
  Card,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Query } from "react-apollo";
import ProfilLetter from "./ProfilLetter";
import ProfilCV from "./ProfilCV";
import { GET_ANNOTATION } from "../../../handler/queries";
import AnnotationCard from "../../application/components/AnnotationCard";
const image = `${process.env.PUBLIC_URL}/img/images/not-found.png`;

export default class ProfileTabs extends PureComponent {
  static propTypes = {
    candidat: PropTypes.object.isRequired,
    entreprise: PropTypes.object.isRequired,
    refetch: PropTypes.func
  };
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1"
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
    const { candidat, refetch, entreprise } = this.props;
    return (
      <Col md={12} lg={7} xl={8}>
        <Card>
          <div className="profile__card tabs tabs--bordered-bottom">
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
                    CV Français
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "2"
                    })}
                    onClick={() => {
                      this.toggle("2");
                    }}
                  >
                    CV Anglais
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "3"
                    })}
                    onClick={() => {
                      this.toggle("3");
                    }}
                  >
                    Lettre de motivation
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "4"
                    })}
                    onClick={() => {
                      this.toggle("4");
                    }}
                  >
                    Annotations
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <ProfilCV
                    file={candidat.cv}
                    name={candidat.first_name + "-" + candidat.last_name}
                    is_blocked={candidat.profile.is_blocked}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <ProfilCV
                    file={candidat.cv_eng}
                    name={candidat.first_name + "-" + candidat.last_name}
                    is_blocked={candidat.profile.is_blocked}
                    id_profile={candidat.profile.id}
                    refetch={refetch}
                  />
                </TabPane>
                <TabPane tabId="3">
                  <ProfilLetter letter={candidat.letter} />
                </TabPane>
                <TabPane tabId="4">
                  <Query
                    query={GET_ANNOTATION}
                    variables={{
                      entreprise_id: entreprise.id,
                      candidate_id: candidat.id,
                    }}
                    fetchPolicy='cache-and-network'
                  >
                    {({ data, loading, error }) => {
                      if (loading) return <div />;
                      else if (error) return <p>ERROR</p>;
                      return (
                        <React.Fragment>
                          {data.getAnnotation &&
                            data.getAnnotation.AnnotationResult &&
                            data.getAnnotation.totalCount > 0 ? (
                              data.getAnnotation.AnnotationResult.map((Annotation, index) => {
                                return (
                                  <div style={{ paddingLeft: "3rem" }} key={index.toString()}>
                                    <AnnotationCard Annotation={Annotation} key={index.toString()} />
                                  </div>
                                );
                              })
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  textAlign: "center",
                                  alignSelf: "center",
                                  alignItems: "center"
                                }}><img src={image} style={{ minWidth: 300, width: "25%" }} />
                                <span>
                                Aucune annotation.
                              
                              <br />
                                </span>
                              </div>
                            )}
                        </React.Fragment>
                      );
                    }}</Query>
                </TabPane>
              </TabContent>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}
