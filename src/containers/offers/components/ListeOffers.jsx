import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Pagination from "react-js-pagination";
import { CardBody } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { graphql, Query, compose } from "react-apollo";
import gql from "graphql-tag";
import HeaderListesOffers from "./HeaderListesOffers";
import OfferItem from "./OfferItem";
import FomrationItem from "./formationItem";
import { GET_OFFERS_BY_STATUS } from "../../../handler/queries";
const image = `${process.env.PUBLIC_URL}/img/images/not-found.png`;

class ListeOffers extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.object,
    status: PropTypes.string,
    data: PropTypes.object,
    getOffersByState: PropTypes.func,
    exportOffer: PropTypes.func,
    getEntrepriseProfile: PropTypes.object,
  };

  static defaultProps = {
    loading: false,
    error: null,
    data: {},
    getEntrepriseProfile: {
      id: null,
      name: "Mon compte",
      ent_type: null,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      status: props.status,
      sort: "recent",
      field: "name",
      direction: 1,
      activePage: 1,
      search: "",
      url: "",
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({
      activePage: pageNumber,
      skip: pageNumber * 2,
    });
  };

  getStatus = (value) => {
    this.setState({ status: value });
  };
  getSort = (field, direction) => {
    this.setState({ field, direction });
  };

  onChangeSearch = (value) => {
    this.setState({ search: value });
  };
  render() {
    const { activePage, status, search, field, direction } = this.state;
    const { ent_type } = this.props.getEntrepriseProfile;
    return (
      <CardBody>
        <HeaderListesOffers
          getSort={this.getSort}
          getStatus={this.getStatus}
          onChangeSearch={this.onChangeSearch}
          status={status}
          field={field}
          direction={direction}
          search={search}
        />
        <Query
          query={GET_OFFERS_BY_STATUS}
          variables={{
            state: status,
            search: search,
            skip: (activePage - 1) * 10,
            limit: 10,
            field,
            direction,
            ent_type: ent_type,
          }}
          fetchPolicy="cache-and-network">
          {({ data, loading, error, refetch }) => {
            if (loading) return <div />;
            else if (error) return <p>ERROR</p>;
            return (
              <Fragment>
                {data.getOffersByState &&
                data.getOffersByState.offers &&
                data.getOffersByState.offers.length > 0 ? (
                  data.getOffersByState.offers.map((offer) => {
                    return (
                      <div key={offer.num}>
                        {ent_type == "ecole" ? (
                          <FomrationItem
                            key={offer.num}
                            offer={offer}
                            state={status}
                            search={search}
                            skip={(activePage - 1) * 4}
                            limit={4}
                            refetch={refetch}
                            ent_type={ent_type}
                          />
                        ) : (
                          <OfferItem
                            key={offer.num}
                            offer={offer}
                            state={status}
                            search={search}
                            skip={(activePage - 1) * 4}
                            limit={4}
                            refetch={refetch}
                            ent_type={ent_type}
                          />
                        )}
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
                      alignItems: "center",
                    }}>
                    <img src={image} style={{ minWidth: 300, width: "25%" }} />
                    <span>
                      Aucune offre trouvée{" "}
                      {status === "DRAFT"
                        ? "de brouillons"
                        : status === "ACTIF"
                          ? "d'offres actives"
                          : status === "PUBLISHED"
                            ? "d'offres publiées"
                            : "d'offres archivées"}
                      .<br />
                      Vous pouvez commencer par{" "}
                      <Link to="/creation-une-offre">créer une offre</Link> ou
                      {status === "DRAFT"
                        ? " dupliquer une autre offre"
                        : " changer l'état d'une autre offre."}
                    </span>
                  </div>
                )}
                <div style={{ textAlign: "center" }}>
                  <Pagination
                    prevPageText="Précédente"
                    nextPageText="Suivante"
                    firstPageText="Première"
                    lastPageText="Dernière"
                    activePage={activePage}
                    itemsCountPerPage={10}
                    innerClass={"pagination"}
                    totalItemsCount={
                      data.getOffersByState
                        ? data.getOffersByState.totalCount
                        : 0
                    }
                    pageRangeDisplayed={10}
                    onChange={this.handlePageChange}
                  />
                </div>
              </Fragment>
            );
          }}
        </Query>
      </CardBody>
    );
  }
}
const GET_ENTRPRISE = gql`
  query getEntrepriseProfile {
    getEntrepriseProfile {
      id
      name
      ent_type
    }
  }
`;
export default withRouter(
  compose(
    graphql(GET_ENTRPRISE, {
      options: () => ({
        fetchPolicy: "cache-and-network",
      }),
      props: ({ data: { loading, error, getEntrepriseProfile, refetch } }) => ({
        loading,
        error,
        getEntrepriseProfile,
        refetch,
      }),
    })
  )(ListeOffers)
);
