import React from "react";
import PropTypes from "prop-types";

class Icon extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    style: PropTypes.object
  };

  static defaultProps = {
    className: "",
    style: {}
  };

  render() {
    const { name, className, style } = this.props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`icon ${className}`.trim()}
        style={style}>
        <use
          xlinkHref={`/img/icons/sprite.svg#${name}`}
        />
      </svg>
    );
  }
}

export default Icon;
