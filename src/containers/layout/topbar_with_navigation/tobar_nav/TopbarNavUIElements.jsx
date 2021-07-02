import React from "react";
import DownIcon from "mdi-react/ChevronDownIcon";
import {
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown
} from "reactstrap";
import TopbarNavLink from "./TopbarNavLink";

const TopbarNavUIElements = () => (
  <UncontrolledDropdown className="topbar__nav-dropdown">
    <DropdownToggle className="topbar__nav-dropdown-toggle">
      Cvthèque
      <DownIcon />
    </DropdownToggle>
    <DropdownMenu className="topbar__nav-dropdown-menu dropdown__menu">
      <DropdownItem>
        <TopbarNavLink title="Déposer un CV" icon="add-cv" route="/accueil" />
      </DropdownItem>
      <DropdownItem>
        <TopbarNavLink
          title="Rechercher un candidat"
          icon="cv-deposed"
          route="/rechercher-un-candidat"
        />
      </DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
);

export default TopbarNavUIElements;
