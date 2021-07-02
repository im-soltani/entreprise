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
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { GET_OFFERS_BY_STATUS } from "../../../handler/queries";
import Parser from "html-react-parser";
import Alert from "../../../handler/utils/Alert";

class OfferTabs extends PureComponent {
  static propTypes = {
    offer: PropTypes.object.isRequired,
    updateOfferState: PropTypes.func,
    refetch: PropTypes.func,
    fromApp: PropTypes.bool
  };
  static defaultProps = {
    fromApp: false
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
  holdOffer = state =>
    this.props
      .updateOfferState({
        variables: {
          id: this.props.offer.id,
          state: state
        },
        refetchQueries: [
          {
            query: GET_OFFERS_BY_STATUS,
            variables: {
              state: state === "ACTIF" ? "ON_HOLD_BY_ADMIN" : "ACTIF",
              search: "",
              skip: 0,
              limit: 5,
              field: "name",
              direction: 1
            }
          }
        ]
      })
      .then(res => {
        if (res) Alert.success("Statut changé avec succès");
        else Alert.success("Erreur");
        this.props.refetch();
      });

  render() {
    const { offer, fromApp } = this.props;
    return (
      <Col md={12} lg={fromApp ? 12 : 7} xl={fromApp ? 12 : 8}>
        <Card style={fromApp ? { boxShadow: "2px 2px 10px #e6e6e6" } : {}}>
          <div className="profile__card tabs tabs--bordered-bottom">
            {/*  <img src={offer.banner} className="profile_banner" /> */}

            <div className="tabs__wrap">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === "1"
                    })}
                    onClick={() => {
                      this.toggle("1");
                    }}>
                    Description
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <div
                    style={{
                      flexWrap: "wrap",
                      padding: 20,
                      textAlign: "justify",
                    }}
                  >
                    {Parser(offer.description_poste)}
                  </div>
                </TabPane>
              </TabContent>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}
const UPDATE_OFFER_STATE = gql`
  mutation updateOfferState($id: ID!, $state: String!) {
    updateOfferState(id: $id, state: $state) {
      name
    }
  }
`;
export default graphql(UPDATE_OFFER_STATE, {
  name: "updateOfferState"
})(OfferTabs);
