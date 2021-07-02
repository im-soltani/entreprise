import React from "react";

import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import Icon from "../../../shared/components/Icon";

const SidebarLink = ({ route, onClick }) => (
  <NavLink
    to={route.to}
    onClick={onClick}
    activeClassName={route.className + "-active"}
  >
    <li
      className={`${route.className} ${
        route.isActive ? route.className + "-active" : ""
      }`.trim()}
    >
      <Icon className="side-bar__icon" name={route.icon} />
      <p className={route.className + "-title"}>{route.label}</p>
    </li>
  </NavLink>
);

SidebarLink.propTypes = {
  route: PropTypes.object,

  onClick: PropTypes.func
};

SidebarLink.defaultProps = {
  route: {},
  sidebarCollapse: true,
  toggleC: () => {},
  onClick: () => {}
};

export default SidebarLink;
