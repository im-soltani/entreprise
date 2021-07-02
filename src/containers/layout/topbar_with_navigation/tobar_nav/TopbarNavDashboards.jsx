import React, { Component } from "react";
import PropTypes from "prop-types";
import DownIcon from "mdi-react/ChevronDownIcon";
import {
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
} from "reactstrap";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import TopbarNavLink from "./TopbarNavLink";

class TopbarNavDashboards extends Component {
  static propTypes = {
    getEntrepriseProfile: PropTypes.object.isRequired,
  };
  static defaultProps = {
    getEntrepriseProfile: {
      ent_type: null,
    },
  };
  render() {
    return (
      <UncontrolledDropdown className="topbar__nav-dropdown">
        <DropdownToggle className="topbar__nav-dropdown-toggle">
          Offres <DownIcon />
        </DropdownToggle>
        <DropdownMenu className="topbar__nav-dropdown-menu dropdown__menu">
          <DropdownItem>
            <TopbarNavLink
              title="Créer une offre"
              icon="create-offer"
              route="/creation-une-offre"
            />
          </DropdownItem>
          <DropdownItem>
            <TopbarNavLink
              title="Offres et candidatures"
              icon="files"
              route="/mes-offres"
            />
          </DropdownItem>
          {/* 		{ent_type != "ecole" ? (
						<DropdownItem>
							<TopbarNavLink title="Formations" icon="files" route="/mes-formation" />
						</DropdownItem>
					) : null} */}
        </DropdownMenu>
      </UncontrolledDropdown>
    );
  }
}
const GET_ENTRPRISE = gql`
  query getEntrepriseProfile {
    getEntrepriseProfile {
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
  )(TopbarNavDashboards)
);
