import React from "react";
import PropTypes from "prop-types";
import Icon from "../../../../shared/components/Icon";
const TopbarNavCategory = ({ title, icon, children }) => (
  <div className="topbar__category-wrap">
    <div className="topbar__link topbar__category">
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
        <span className="topbar__category-icon lnr lnr-chevron-right" />
      </p>
    </div>
    <div className="topbar__submenu">{children}</div>
  </div>
);

TopbarNavCategory.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default TopbarNavCategory;
