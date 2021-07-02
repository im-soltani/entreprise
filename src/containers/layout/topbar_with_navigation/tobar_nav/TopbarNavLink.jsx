import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Icon from "../../../../shared/components/Icon";

const TopbarNavLink = ({ title, icon, route }) => (
  <Link className="topbar__link" to={route}>
    {icon ? (
      <Icon
        style={{
          width: "1.3rem",
          height: "1rem",
          left: 0,

          fill: "rgb(97, 97, 97)"
        }}
        name={icon}
      />
    ) : (
      ""
    )}
    <p className="topbar__link-title" style={{ marginLeft: 5 }}>
      {title}
    </p>
  </Link>
);

TopbarNavLink.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  newLink: PropTypes.bool,
  route: PropTypes.string.isRequired
};

TopbarNavLink.defaultProps = {
  icon: "",
  newLink: false
};

export default TopbarNavLink;
