import React from "react";
import { Container, Row, Col } from "reactstrap";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import ProfileMain from "./components/ProfileMain";
import ProfilInfosTop from "./components/ProfilInfosTop";
import ProfilCompetences from "./components/ProfilCompetences";
import CondidatureNotes from "./components/CondidatureNotes";
import ProfileTabs from "./components/ProfileTabs";
import OfferInfosTop from "../offer/components/OfferInfosTop";
import OfferCompetences from "../offer/components/OfferCompetences";
import OfferTabs from "../offer/components/OfferTabs";
import Select from "../../shared/components/Select";
import GraphQlResult from "../../shared/components/GraphQLResult";
import SendEmail from "../candidat/components/SendEmail";
import { GET_OFFER_BY_NUM } from "../../handler/queries";
import { withRouter } from "react-router";

class ApplicationDetail extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    loadingg:PropTypes.bool,
    error: PropTypes.object,
    getApplicationByNum: PropTypes.object,
    getEntrepriseProfile: PropTypes.object,
    updateApplicationState: PropTypes.func,
    sendApplicationEmail: PropTypes.func,
    refetch: PropTypes.func
  };

  static defaultProps = {
    loading: false,
    error: null,
    getApplicationByNum: null,
    getEntrepriseProfile: null
  };
  constructor(props) {
    super(props);
    this.state = {
      state: props.getApplicationByNum && props.getApplicationByNum.state,
      candidat_id: null,
      modalSend: false,
      offer_name: null,
      offer_num: null,
      num: null,
      offer:
        props.getApplicationByNum && props.getApplicationByNum.offer
          ? props.getApplicationByNum.offer
          : {}
    };
  }
  onSelectState = (value, name) => {
    if (value === "REFUSED") {
      confirmAlert({
        title: "Refus",
        message: "Voulez vous refuser cette candidature",
        buttons: [
          {
            label: "Oui",
            onClick: () =>
              this.props
                .updateApplicationState({
                  variables: {
                    id: this.props.getApplicationByNum.id,
                    state: "REFUSED"
                  },
                  refetchQueries: [
                    {
                      query: GET_OFFER_BY_NUM,
                      variables: {
                        num: this.props.getApplicationByNum.offer.num
                      }
                    }
                  ]
                })
                .then(() => {
                  this.props.refetch();
                  this.setState({ [name]: value });
                  confirmAlert({
                    title: "Notification",
                    message:
                      "Voulez vous envoyer l'email par defaut en cas de refus ?",
                    buttons: [
                      {
                        label: "Oui",
                        onClick: () =>
                          this.props.sendApplicationEmail({
                            variables: {
                              id: this.props.getApplicationByNum.id,
                              state: "REFUSED"
                            }
                          })
                      },
                      {
                        label: "Personnalisé",
                        onClick: () =>
                          this.setState({
                            modalSend: true,
                            candidat_id: this.props.getApplicationByNum.candidat
                              .id,
                            offer_name: this.props.getApplicationByNum.offer
                              .name,
                            offer_num: this.props.getApplicationByNum.offer.num,
                            num: this.props.getApplicationByNum.numm
                          })
                      },
                      {
                        label: "Non",
                        onClick: () => {}
                      }
                    ]
                  });
                })
          },
          {
            label: "Non",
            onClick: () =>
              this.setState({ state: this.props.getApplicationByNum.state })
          }
        ]
      });
    } else {
      confirmAlert({
        title: "Changement de statut",
        message: "Voulez vous changer le statut de cette candidature ?",
        buttons: [
          {
            label: "Oui",
            onClick: () =>
              this.props
                .updateApplicationState({
                  variables: {
                    id: this.props.getApplicationByNum.id,
                    state: value
                  },
                  refetchQueries: [
                    {
                      query: GET_OFFER_BY_NUM,
                      variables: {
                        num: this.props.getApplicationByNum.offer.num
                      }
                    }
                  ]
                })
                .then(() => {
                  this.props.refetch();
                  this.setState({ [name]: value });
                })
          },
          {
            label: "Non",
            onClick: () =>
              this.setState({ state: this.props.getApplicationByNum.state })
          }
        ]
      });
    }
  };
  toggleSend() {
    this.setState({
      modalSend: !this.state.modalSend
    });
  }
  render() {
    const { loading, error, getApplicationByNum,loadingg, refetch } = this.props;
    const { modalSend, state } = this.state;
    return (
      <Container>
        <GraphQlResult
          error={error}
          loading={loading || loadingg}
          emptyResult={(!loading || !loadingg)  && !getApplicationByNum}>
          {getApplicationByNum && (
            <div className="profile">
              <SendEmail
                modal={modalSend}
                refus={true}
                offer_name={this.props.getApplicationByNum.offer.name}
                offer_num={this.props.getApplicationByNum.offer.num}
                num={this.props.getApplicationByNum.num}
                toggle={this.toggleSend}
                id={this.state.candidat_id}
              />
              <Row>
                <Col md={12} lg={6} xl={6} className="candidature-left">
                  <Row
                    style={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      marginBottom: 10
                    }}>
                    <Col md={6} lg={3} xl={3}>
                      <Select
                        className="Profil-group__input"
                        onSelect={this.onSelectState}
                        name={"state"}
                        optionLabel={"Etat de la candidature"}
                        defaultValue={state}
                        items={[
                          {
                            id: 1,
                            value: "PENDING",
                            label: "Nouvelle"
                          },
                          {
                            id: 2,
                            value: "APPROVED",
                            label: "Selectionnée"
                          },
                          {
                            id: 3,
                            value: "ACCEPTED",
                            label: "Retenue"
                          },
                          {
                            id: 4,
                            value: "REFUSED",
                            label: "Réfusée"
                          }
                        ]}
                      />
                    </Col>
                    <Col md={6} lg={6} xl={6}>
                      <div className="candidature-title">
                        <span style={{ fontSize: "1rem", fontWeight: 800 }}>
                          Détail du candidat
                        </span>
                      </div>
                    </Col>
                  </Row>

                  <Row styel={{ margin: 0 }}>
                    <ProfileMain
                      candidat={getApplicationByNum.candidat}
                      createdAt={getApplicationByNum.createdAt}
                      refetch={refetch}
                    />
                    <ProfilInfosTop candidat={getApplicationByNum.candidat} />

                    <ProfilCompetences
                      competences={getApplicationByNum.candidat.competences}
                    />
                    <CondidatureNotes
                      candidat_id={getApplicationByNum.candidat.id}
                      entreprise= {getApplicationByNum.entreprise}
                    />
                  </Row>
                  <Row styel={{ margin: 0 }}>
                    <ProfileTabs candidat={getApplicationByNum.candidat} />
                  </Row>
                </Col>
                <Col md={12} lg={6} xl={6} className="candidature-right">
                  <div className="candidature-title">
                    <span style={{ fontSize: "1rem", fontWeight: 800 }}>
                      Détail de l'offre
                    </span>
                  </div>
                  <Row styel={{ margin: 0 }}>
                    <OfferInfosTop
                      offer={getApplicationByNum.offer}
                      candidat={getApplicationByNum.candidat}
                      show={false}
                      fromApp={true}
                    />{" "}
                    <OfferCompetences
                      competences={
                        getApplicationByNum.offer &&
                        getApplicationByNum.offer.competences
                      }
                      fromApp={true}
                    />
                    <OfferTabs
                      offer={getApplicationByNum.offer}
                      refetch={refetch}
                      fromApp={true}
                    />
                  </Row>
                </Col>
              </Row>
            </div>
          )}
        </GraphQlResult>
      </Container>
    );
  }
}

const GET_APPLICATION_BY_NUM = gql`
  query getApplicationByNum($num: Int!) {
    getApplicationByNum(num: $num) {
      id
      createdAt
      state
      candidat {
        id
        last_name
        first_name
        jobs
        num
        competences
        note
        address
        letter
        sharedby
        sharedcv
        contract
        twitter
        siteweb
        linkedin
        sexe
        age
        experience
        disponibility
        entreprises {
          isFavoris
          id
        }
        tel
        etude
        profile_pic_url
        address
        cv
        cv_eng
        profile {
          id
          email
          is_blocked
        }
        createdAt
      }
      offer {
        id
        num
        name
        job {
          id
          name
        }
        city
        competences {
          id
          name
        }
        contract
        experience
        etude
        banner
        description_poste
        address
        extra_file
        salary
        salary_type
        work_time
        application_number
        all_application_number
        state
        createdAt
        expiredAt
      }
      entreprise {
        id
      }
    }
  }
`;
const UPDATE_APPLICATION_STATE = gql`
  mutation updateApplicationState($id: ID!, $state: String!) {
    updateApplicationState(id: $id, state: $state) {
      id
    }
  }
`;
const SEND_APPLICATION_EMAIL = gql`
  mutation sendApplicationEmail($id: ID!, $state: String!) {
    sendApplicationEmail(id: $id, state: $state) {
      id
    }
  }
`;
export default withRouter(
  compose(
    graphql(UPDATE_APPLICATION_STATE, {
      name: "updateApplicationState"
    }),
    graphql(SEND_APPLICATION_EMAIL, {
      name: "sendApplicationEmail"
    }),
    graphql(GET_APPLICATION_BY_NUM, {
      options: props => ({
        variables: { num: props.match.params.num },
        fetchPolicy: "cache-and-network"
      }),
      props: ({ data: { loading, error, getApplicationByNum, refetch } }) => ({
        loading,
        error,
        getApplicationByNum,
        refetch
      })
    })
  )(ApplicationDetail)
);
