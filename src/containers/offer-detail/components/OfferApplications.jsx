import React from "react";
import Board from "react-trello";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import * as moment from "moment";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { GET_OFFER_BY_NUM } from "../../../handler/queries";
import { etudeConst, experienceConst } from "../../../handler/utils/constants";
import CustomCard from "./CustomCard";
import SendEmail from "../../candidat/components/SendEmail";
let eventBus;

class OfferApplications extends React.Component {
  static propTypes = {
    offer: PropTypes.object,
    sort: PropTypes.string,
    updateApplicationState: PropTypes.func,
    sendApplicationEmail: PropTypes.func,
    refetch: PropTypes.func
  };

  static defaultProps = {
    offer: {}
  };
  constructor(props) {
    super(props);

    this.state = {
      candidat_id: null,
      modalSend: false,
      offer_name: null,
      offer_num: null,
      num: null,
      offer: props.offer ? props.offer : {},
      data: {
        lanes: [
          {
            id: "lane1",
            title: "nouvelle",
            cards: []
          },
          {
            id: "lane2",
            title: "validée",
            cards: []
          },
          {
            id: "lane3",
            title: "refusée",
            cards: []
          }
        ]
      },
      sort: props.sort,
      dropdownOpen: false
    };
    this.toggle = this.toggle.bind(this);
    this.toggleSend = this.toggleSend.bind(this);
  }
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  toggleSend() {
    this.setState({
      modalSend: !this.state.modalSend,
      candidat_id: null
    });
  }
  setEventBus = handle => {
    eventBus = handle;
  };

  refuseApplication = obj => {
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
                  id: obj.id,
                  state: "REFUSED"
                },
                refetchQueries: [
                  {
                    query: GET_OFFER_BY_NUM,
                    variables: { num: obj.num }
                  }
                ]
              })
              .then(() => {
                this.props.refetch();
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
                            id: obj.id,
                            state: "REFUSED"
                          }
                        })
                    },
                    {
                      label: "Personnalisé",
                      onClick: () =>
                        this.setState({
                          modalSend: true,
                          candidat_id: obj.candidat_id,
                          offer_name: this.props.offer.name,
                          offer_num: this.props.offer.num,
                          num: obj.app_num
                        })
                    },
                    {
                      label: "Non",
                      onClick: () => {
                        this.buildData(this.state.offer);
                      }
                    }
                  ]
                });
              })
        },
        {
          label: "Non",
          onClick: () => this.buildData(this.state.offer)
        }
      ]
    });
  }

  handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    cardDetails
  ) => {
    if (sourceLaneId !== targetLaneId)
      if (targetLaneId === "lane3") {
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
                      id: cardId,
                      state: "REFUSED"
                    },
                    refetchQueries: [
                      {
                        query: GET_OFFER_BY_NUM,
                        variables: { num: this.props.offer.num }
                      }
                    ]
                  })
                  .then(() => {
                    this.props.refetch();
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
                                id: cardId,
                                state: "REFUSED"
                              }
                            })
                        },
                        {
                          label: "Personnalisé",
                          onClick: () =>
                            this.setState({
                              modalSend: true,
                              candidat_id: cardDetails.candidat_id,
                              offer_name: this.props.offer.name,
                              offer_num: this.props.offer.num,
                              num: cardDetails.app_num
                            })
                        },
                        {
                          label: "Non",
                          onClick: () => {
                            this.buildData(this.state.offer);
                          }
                        }
                      ]
                    });
                  })
            },
            {
              label: "Non",
              onClick: () => this.buildData(this.state.offer)
            }
          ]
        });
      } else {
        this.props
          .updateApplicationState({
            variables: {
              id: cardId,
              state:
                (targetLaneId === "lane1" && "PENDING") ||
                (targetLaneId === "lane2" && "ACCEPTED") ||
                (targetLaneId === "lane3" && "REFUSED")
            },
            refetchQueries: [
              {
                query: GET_OFFER_BY_NUM,
                variables: { num: this.props.offer.num }
              }
            ]
          })
          .then(() => {
            this.props.refetch();
          });
      }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.offer !== this.props.offer) {
      this.setState({ offer: nextProps.offer });
      this.buildData(nextProps.offer, nextProps.sort);
    }
    if (nextProps.sort !== this.props.sort) {
      this.setState({ sort: nextProps.sort });
      this.buildData(nextProps.offer, nextProps.sort);
    }
  }
  sort = (a, b, sort) => {
    if (sort === "rating") {
      if (a.rating < b.rating) return -1;
      if (a.rating > b.rating) return 1;
      return 0;
    } else if (sort === "experience") {
      var experienceA = a.experience.toLowerCase(),
        experienceB = b.experience.toLowerCase();
      if (experienceA > experienceB) return -1;
      if (experienceA < experienceB) return 1;
      return 0;
    } else if (sort === "disponibility") {
      if (a.dispo < b.dispo) return -1;
      if (a.dispo > b.dispo) return 1;
      return 0;
    } else if (sort === "recent") {
      if (a.createdAt > b.createdAt) return -1;
      if (a.createdAt < b.createdAt) return 1;
      return 0;
    }
  };
  buildData = offer => {
    if (offer !== {}) {
      let data = {
        lanes: [
          {
            id: "lane1",
            title: "non traitée",
            cards: []
          },
          {
            id: "lane2",
            title: "validée",
            cards: []
          },
          {
            id: "lane3",
            title: "refusée",
            cards: []
          }
        ]
      };
      offer.applications.map(application => {
        if (!JSON.stringify(data).includes(application.id)) {
          let card = {
            laneId:
              (application.state === "PENDING" && "lane1") ||
              (application.state === "ACCEPTED" && "lane2") ||
              (application.state === "REFUSED" && "lane3"),
            id: application.id,
            avatar: application.candidat.profile_pic_url,
            state: application.state,
            note: application.candidat.note,
            jobs: application.candidat.jobs,
            num: application.candidat.num,
            app_num: application.num,
            last_name: application.candidat.last_name,
            candidat_id: application.candidat.id,
            first_name: application.candidat.first_name,
            experience:
              application.candidat.experience &&
              experienceConst.filter(
                experience =>
                  experience.value === application.candidat.experience
              )[0].label,
            etude:
              application.candidat.etude &&
              etudeConst.filter(
                etude => etude.value === application.candidat.etude
              )[0].label,

            disponibility: application.candidat.disponibility
              ? moment(application.candidat.disponibility).diff(
                moment(),
                "days"
              ) > 0
                ? "Dans " +
                moment(application.candidat.disponibility).diff(
                  moment(),
                  "days"
                ) +
                " jours"
                : "Immédiate"
              : " --",

            cardStyle: {
              borderRadius: 6,

              marginBottom: 15
            }
          };
          if (application.state === "PENDING") {
            data.lanes[0].cards.push(card);
          } else if (application.state === "ACCEPTED") {
            data.lanes[1].cards.push(card);
          } else if (application.state === "REFUSED") {
            data.lanes[2].cards.push(card);
          }
        }
      });
      this.setState({ data: data });
    }
  };
  componentDidMount() {
    this.buildData(this.state.offer, this.state.sort);
  }

  render() {
    const {
      data,
      dropdownOpen,
      offer,
      modalSend,
      offer_name,
      offer_num,
      num
    } = this.state;
    const { updateApplicationState, refetch } = this.props;
    return (
      <React.Fragment>
        <SendEmail
          modal={modalSend}
          refus={true}
          offer_name={offer_name}
          offer_num={offer_num}
          num={num}
          toggle={this.toggleSend}
          id={this.state.candidat_id}
        />
        <Board
          data={data}
          customCardLayout={true}
          laneDraggable={false}
          eventBusHandle={this.setEventBus}
          draggable={true}
          laneSortFunction={(card1, card2) =>
            this.sort(card1, card2, this.state.sort)
          }
          cardDraggable={true}
          handleDragEnd={this.handleDragEnd}
        >
          <CustomCard
            refuseApplication={this.refuseApplication}
            dropdownOpen={dropdownOpen}
            toggle={this.toggle}
            offerId={offer.id}
            mutate={updateApplicationState}
            refetch={refetch}
            eventBus={eventBus}
          />
        </Board>
      </React.Fragment>
    );
  }
}
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
export default compose(
  graphql(UPDATE_APPLICATION_STATE, {
    name: "updateApplicationState"
  }),
  graphql(SEND_APPLICATION_EMAIL, {
    name: "sendApplicationEmail"
  })
)(OfferApplications);
