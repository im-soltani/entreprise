import React from "react";
import PropTypes from "prop-types";
import { FormGroup, Input, Row, Col, InputGroup, InputGroupAddon } from "reactstrap";
import SearchIcon from "mdi-react/SearchIcon";
import { sortOffersConst, ActualiteStatusConst } from "../../../handler/utils/constants";
import Select from "../../../shared/components/Select";

class HeaderListesActualité extends React.Component {
	static propTypes = {
		getStatus: PropTypes.func,
		onChangeSearch: PropTypes.func,
		onChangeSelected: PropTypes.func,
		getSort: PropTypes.func,
		status: PropTypes.string,
		field: PropTypes.string,
		direction: PropTypes.number,
		search: PropTypes.string,
		allActus: PropTypes.bool
	};

	static defaultProps = {
		status: "TOUT",
		field: "name",
		direction: 1,
		search: "",
		allActus: false
	};
	constructor(props) {
		super(props);

		this.state = {
			status: props.status ? props.status : "TOUT",
			field: props.field ? props.field : "name",
			direction: props.direction ? props.direction : 1,
			search: props.search ? props.search : "",
			allActus: props.allActus ? props.allActus : false
		};
	}

	onChange = e => {
		if (e.target) this.props.getStatus(e.target.id);
	};
	onChangeSearch = e => {
		this.setState({ search: e.target.value });
		this.props.onChangeSearch(e.target.value);
	};
	onSelect = (value, name) => {
		this.setState({ [name]: value });
		let array = value.split(";");
		this.props.getSort(array[0], parseInt(array[1]));
	};
	onSelectStatus = (value, name) => {
		this.setState({ [name]: value });
		this.props.getStatus(value);
	};
	onChangeSelectedTT = (index) => {
		console.log("index", index);
		if (index == "0") {
			this.setState({ allActus: true });
			this.props.onChangeSelected(true);
		} else {
			this.setState({ allActus: false });
			this.props.onChangeSelected(false);
		}
	};
	render() {
		return (
			<div>
				<FormGroup tag="fieldset">
					<Row>
						<button
							title="Ajouter à mes cv"
							className="btn__top"
							style={{ marginRight: "1rem", backgroundColor: this.state.allActus ? "#426cc0" : "#f7c93e" }}
							onClick={() => this.onChangeSelectedTT("0")}
						>
							Toutes les Actus RH
						</button>
						<button
							title="Ajouter à mes cv"
							className="btn__top"
							style={{ backgroundColor: !this.state.allActus ? "#426cc0" : "#f7c93e" }}
							onClick={() => this.onChangeSelectedTT("1")}
						>
							Mes Actus RH
						</button>
					</Row>
					<Row>
						<Col
							sm={6}
							style={{
								display: "flex",
								justifyContent: "space-between",

								padding: 8
							}}
						>
							<InputGroup>
								<InputGroupAddon
									addonType="prepend"
									style={{
										backgroundColor: "#e8e8e8",
										width: "3em",
										borderRadius: "24px 0px 0px 24px",
										border: "1px solid #ced4da"
									}}
								>
									<SearchIcon
										style={{
											margin: "auto",
											borderRadius: "24px 0px 0px 24px",
											color: "#6b6b6b",
											fontSize: "1.3em"
										}}
									/>
								</InputGroupAddon>
								<Input
									className="Profil-group__input"
									placeholder="Rechercher..."
									type="text"
									value={this.state.search}
									onChange={this.onChangeSearch}
								/>
							</InputGroup>
						</Col>
						<Col
							sm={3}
							style={{
								display: "flex",
								justifyContent: "space-between",
								padding: 8
							}}
						>
							<Select
								className="Profil-group__input"
								onSelect={this.onSelectStatus}
								name={"status"}
								optionLabel={"Etat des Actus RH"}
								defaultValue={this.state.status}
								items={ActualiteStatusConst}
							/>
						</Col>
						<Col
							sm={3}
							style={{
								display: "flex",
								justifyContent: "space-between",
								padding: 8
							}}
						>
							<Select
								className="Profil-group__input"
								onSelect={this.onSelect}
								name={"direction"}
								optionLabel={"Trier par"}
								items={sortOffersConst}
							/>
						</Col>
					</Row>
				</FormGroup>
			</div>
		);
	}
}

export default HeaderListesActualité;
