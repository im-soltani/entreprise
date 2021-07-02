import React from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";

class Select extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func,
    className: PropTypes.string,
    items: PropTypes.array,
    defaultValue: PropTypes.string,
    name: PropTypes.string,
    error: PropTypes.string,
    optionLabel: PropTypes.string,
    optionLabelDisabled: PropTypes.bool
  };

  static defaultProps = {
    className: "",
    checked: false,
    error: "",
    name: "",
    optionLabel: "Aucun(e)",
    optionLabelDisabled: true
  };

  constructor(props) {
    super(props);
    this.state = {
      items: props.items,
      value: props.defaultValue
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.setState({ items: nextProps.items });
    }
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
    }
  }

  handleChange = e => {
    if (e.target.value && e.target.value !== this.props.optionLabel) {
      this.props.onSelect(e.target.value, this.props.name);
      this.setState({ value: e.target.value });
    }
  };

  render() {
    const { value, items } = this.state;
    const {
      className,
      name,
      error,
      optionLabel,
      optionLabelDisabled
    } = this.props;
    return (
      <Input
        className={className}
        onChange={e => this.handleChange(e)}
        value={value}
        type="select"
        name={name}
        invalid={!!error}>
        <option
          value={null}
          disabled={optionLabelDisabled}
          key={Math.random()}
          style={{ backgroundColor: "#ececec", height: 40 }}>
          {optionLabel}
        </option>
        {items &&
          items.map(item => {
            return (
              <option
                value={item.value ? item.value : item.id}
                key={item.id + "" + Math.random()}>
                {item.label ? item.label : item.name}
              </option>
            );
          })}
      </Input>
    );
  }
}

export default Select;
