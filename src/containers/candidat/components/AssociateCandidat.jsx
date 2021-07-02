import React, { Fragment } from "react";

import { Query, graphql, compose } from "react-apollo";
import Pagination from "react-js-pagination";
import {
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  Button,
  Row,
  Label,
  FormGroup
} from "reactstrap";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import Icon from "../../../shared/components//Icon";
import * as moment from "moment";
import Alert from "../../../handler/utils/Alert";
import {
  GET_OFFERS_BY_STATUS,
  GET_OFFER_BY_NUM
} from "../../../handler/queries";

class AssociateCandidat extends React.Component {
  static propTypes = {
    toggle: PropTypes.func,
    addApplicationByEntreprise: PropTypes.func,
    updateApplicationState: PropTypes.func,
    id: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    modal: PropTypes.bool,
    error: PropTypes.object,
    data: PropTypes.object,
    addApplicationByEntreprise: PropTypes.object
  };
  static defaultProps = {
    loading: false,
    error: null,
    data: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      modal: props.modal,
      selected: "1",
      status: "PUBLISHED",
      state: "",
      offer: false,
      sort: "recent",
      activePage: 1,
      search: "",
      loading: false,
      ApplicationId: null
    };

    this._toggle = this._toggle.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.modal !== this.props.modal)
      this.setState({ modal: nextProps.modal });
  }

  _toggle() {
    this.unselectOffer();
    this.props.toggle();
  }
  getRating = rating => {
    this.setState({ rating });
  };

  handlePageChange = pageNumber => {
    this.setState({
      activePage: pageNumber,
      skip: pageNumber * 2
    });
  };

  onResponse = cb => {
    this.setState(
      {
        loading: false
      },
      () => {
        cb();
      }
    );
  };

  changeAppStatus = () => {
    if (!this.state.loading && this.state.offer && this.state.state) {
      this.setState({ loading: true });

      this.props
        .updateApplicationState({
          variables: {
            id: this.state.ApplicationId,
            state: this.state.state
          },
          refetchQueries: [
            {
              query: GET_OFFER_BY_NUM,
              variables: { num: this.state.offer.num }
            }
          ]
        })
        .then(rd => {
          this.onResponse(() => {
            console.log("onResponse", rd.data)
            if (rd.data.updateApplicationState) {
              Alert.success(
                "Le changement de status a été fait avec succès à cette offre."
              );
            }
            this.setState({ loading: false });
            this._toggle();
          });
        })
        .catch(e => {
          this.onResponse(() => {
            console.log(e);
          });
        });
    }
  };

  handleSubmit = () => {
    if (!this.state.loading && this.state.offer && this.state.state) {
      this.setState({ loading: true });

      this.props
        .addApplicationByEntreprise({
          variables: {
            state: this.state.state,
            candidat_id: this.props.id,
            offer_id: this.state.offer.id
          },
          refetchQueries: [
            {
              query: GET_OFFER_BY_NUM,
              variables: { num: this.state.offer.num }
            }
          ]
        })
        .then(rd => {
          this.onResponse(() => {
            if (rd.data.addApplicationByEntreprise.test) {
              Alert.success(
                "Le candidat a été associé avec succès à cette offre."
              );
              this.setState({ loading: false });
              this._toggle();
            }
            else {
              this.setState({ ApplicationId: rd.data.addApplicationByEntreprise.ApplicationId, selected: "3" });
            }
          });
        })
        .catch(e => {
          this.onResponse(() => {
            console.log(e);
          });
        });
    }
  };

  sort = (a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  };

  onChangeSearch = e => this.setState({ search: e.target.value });
  setActif = () => this.setState({ status: "ACTIF" });
  setPublished = () => this.setState({ status: "PUBLISHED" });
  selectOffer = offer => this.setState({ offer: offer, selected: "2" });
  unselectOffer = () =>
    this.setState({ offer: false, selected: "1", state: "" });
  setClicked = item => this.setState({ state: item });
  render() {
    const { selected, modal, activePage, status, search } = this.state;
    return (
      <div className="AssociateCV-frag">
        <Modal isOpen={modal} toggle={this._toggle} className="AssociateCV">
          <ModalHeader
            toggle={this._toggle}
            style={{ textTransform: "uppercase" }}>
            associer le CV à une Offre
          </ModalHeader>
          <ModalBody className="AssociateCV-body">
            <Row className="AssociateCV-row__header">
              <Label
                onClick={this.setPublished}
                className="AssociateCV-label__header"
                style={
                  status === "PUBLISHED"
                    ? {
                      border: "1px solid #f7c93e",
                      padding: 10,
                      boxShadow: "1px 1px #f7c93e"
                    }
                    : { padding: 10 }
                }>
                offres publiées
              </Label>
            </Row>
            {selected == "1" && (
              <div>
                <Input
                  className="AssociateCV-input"
                  placeholder="Rechercher une offre"
                  type="text"
                  value={this.state.search}
                  onChange={this.onChangeSearch}
                />
                <Query
                  query={GET_OFFERS_BY_STATUS}
                  variables={{
                    state: status,
                    search: search,
                    skip: (activePage - 1) * 4,
                    limit: 4,
                    field: "name",
                    direction: 1
                  }}
                  fetchPolicy='cache-and-network'
                >
                  {({ data, loading, error }) => {
                    if (loading) return <div />;
                    else if (error) return <p>ERROR</p>;

                    return (
                      <Fragment>
                        <div>
                          {data.getOffersByState &&
                            data.getOffersByState.offers &&
                            data.getOffersByState.offers
                              .sort((a, b) => this.sort(a, b))
                              .map(offer => {
                                return (
                                  <Row
                                    key={offer.id}
                                    className="AssociateCV-row"
                                    onClick={() => this.selectOffer(offer)}>
                                    <Col
                                      md={6}
                                      lg={6}
                                      xl={5}
                                      sx={6}
                                      className="AssociateCV-col">
                                      <Label className="AssociateCV-label__name">
                                        {offer.name}
                                      </Label>
                                      <br />
                                      {offer.offreType == "EDUCATION" ?
                                        <Label className="AssociateCV-label">
                                          {offer.typeFormation}
                                        </Label> :
                                        <Label className="AssociateCV-label">
                                          {offer.contract} - {offer.city}
                                        </Label>
                                      }
                                    </Col>
                                    <Col
                                      md={2}
                                      lg={2}
                                      xl={4}
                                      sx={0}
                                      sm={0}
                                      className="AssociateCV-col"
                                    />
                                    <Col
                                      md={4}
                                      lg={4}
                                      xl={3}
                                      sx={6}
                                      className="AssociateCV-col">
                                      {" "}
                                      <Label className="AssociateCV-label">
                                        Activée le{" "}
                                        {moment(offer.createdAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </Label>
                                      <br />
                                      <Label className="AssociateCV-label">
                                        Expire le{" "}
                                        {moment(offer.expiredAt).format(
                                          "DD/MM/YYYY"
                                        )}
                                      </Label>
                                    </Col>
                                  </Row>
                                );
                              })}
                          <div style={{ textAlign: "center" }}>
                            <Pagination
                              prevPageText="Précédente"
                              nextPageText="Suivante"
                              firstPageText="Première"
                              lastPageText="Dernière"
                              activePage={activePage}
                              itemsCountPerPage={4}
                              innerClass={"pagination"}
                              totalItemsCount={
                                data.getOffersByState
                                  ? data.getOffersByState.totalCount
                                  : 0
                              }
                              pageRangeDisplayed={5}
                              onChange={this.handlePageChange}
                            />
                          </div>
                        </div>
                      </Fragment>
                    );
                  }}
                </Query>
              </div>
            )}
            {selected == "2" && (
              <div className="AssociateCV-row__div">
                <Row key={this.state.offer.id} className="AssociateCV-row-2">
                  <Col
                    md={1}
                    lg={1}
                    xl={1}
                    sx={1}
                    className="AssociateCV-col"
                    onClick={() => this.unselectOffer()}>
                    <Label className="AssociateCV-label__name">
                      <Icon className="AssociateCV-link" name="cv-arrow-long" />
                    </Label>
                  </Col>
                  <Col md={5} lg={5} xl={5} sx={5} className="AssociateCV-col">
                    <Label className="AssociateCV-label__name">
                      {this.state.offer.name}
                    </Label>
                    <br />
                    {this.state.offer.offreType == "EDUCATION" ?
                      <Label className="AssociateCV-label">
                        {this.state.offer.typeFormation}
                      </Label> :
                      <Label className="AssociateCV-label">
                        {this.state.offer.contract} - {this.state.offer.city}
                      </Label>
                    }
                  </Col>
                  <Col
                    md={2}
                    lg={2}
                    xl={2}
                    sx={0}
                    className="AssociateCV-col"
                  />
                  <Col
                    sm={0}
                    md={4}
                    lg={4}
                    xl={4}
                    sx={7}
                    className="AssociateCV-col ">
                    {" "}
                    <Label className="AssociateCV-label">
                      Activée le{" "}
                      {moment(this.state.offer.createdAt).format("DD/MM/YYYY")}
                    </Label>
                    <br />
                    <Label className="AssociateCV-label">
                      Expire le{" "}
                      {moment(this.state.offer.expiredAt).format("DD/MM/YYYY")}
                    </Label>
                  </Col>
                </Row>
                <Row
                  className="AssociateCV-row__label"
                  style={{
                    backgroundColor:
                      this.state.state === "PENDING"
                        ? "rgb(247, 201, 62)"
                        : "#fff"
                  }}
                  onClick={() => this.setClicked("PENDING")}>
                  <Col sm={1} className="AssociateCV-col__label" />
                  <Col className="AssociateCV-col__label">Non traitée</Col>
                </Row>
                <Row
                  className="AssociateCV-row__label"
                  style={{
                    backgroundColor:
                      this.state.state === "ACCEPTED"
                        ? "rgb(247, 201, 62)"
                        : "#fff"
                  }}
                  onClick={() => this.setClicked("ACCEPTED")}>
                  <Col sm={1} className="AssociateCV-col__label" />
                  <Col className="AssociateCV-col__label">Validée</Col>
                </Row>
                <FormGroup
                  className="AssociateCV-group"
                  style={{
                    textAlign: "center",
                    display: "flex"
                  }}>
                  <Button
                    className="AssociateCV-cancel__btn"
                    onClick={this.state.loading ? null : this._toggle}>
                    {this.state.loading ? "En cours" : "Annuler"}
                  </Button>
                  <Button
                    className="AssociateCV-add__btn"
                    onClick={this.state.loading ? null : this.handleSubmit}>
                    {this.state.loading ? "En cours" : "Associer"}
                  </Button>
                </FormGroup>
              </div>
            )}
            {selected == "3" && (
              <div className="AssociateCV-row__div">
                <Row className="AssociateCV-row__header">
                  <Label
                    className="AssociateCV-label"
                    style={{ padding: 10 }}>
                    Ce CV fait déjà parti des candidatures de l'offre. Êtes-vous sûr de vouloir en modifier le statut?
                </Label>
                </Row>
                <FormGroup
                  className="AssociateCV-group"
                  style={{
                    textAlign: "center",
                    display: "flex"
                  }}>
                  <Button
                    className="AssociateCV-cancel__btn"
                    onClick={() => this.setState({ selected: "1" })}>
                    {this.state.loading ? "En cours" : "Annuler"}
                  </Button>
                  <Button
                    className="AssociateCV-add__btn"
                    onClick={this.state.loading ? null : this.changeAppStatus}>
                    {this.state.loading ? "En cours" : "Valider"}
                  </Button>
                </FormGroup>
              </div>
            )}
          </ModalBody>
        </Modal>
      </div>
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
const ADD_APPLICATION_BY_ENTREPRISE = gql`
  mutation addApplicationByEntreprise(
    $state: String!
    $candidat_id: ID!
    $offer_id: ID!
  ) {
    addApplicationByEntreprise(
      state: $state
      candidat_id: $candidat_id
      offer_id: $offer_id
    ){
      test 
      ApplicationId
    }
  }
`;
export default compose(
  graphql(ADD_APPLICATION_BY_ENTREPRISE, {
    name: "addApplicationByEntreprise"
  }),
  graphql(UPDATE_APPLICATION_STATE, {
    name: "updateApplicationState"
  })
)(AssociateCandidat);
