import React, {Component,PropTypes} from "react";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Label, Input, Item, Title} from "native-base";
import {Col, Grid, Row} from "react-native-easy-grid";

import {pacoisTyped,fetchData} from "../actions/PacoActions"



import { FETCHING_DATA } from '../actions/types'
import {connect} from "react-redux";


const goToItems = () => {

    Actions.items();
};



class mainMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {

            activateBeacons: true,
            locations: [],
            areas: [],
            items: [],
            iteminfo: {},
            modalVisible: false,
            showspinner: true,
            bluetoothActive: true,
            isProcessingBeacons: false,
            areaSelectedPiker: {},
            locationSelectedPicker: {},
            enablePicker: true,

            pacoField:''

        };
    }


    componentWillUpdate(nextProps) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentDidMount() {
    }


    onPacoTypedChanged(txt){
        console.log('paco text ====>>> '+txt);

        this.setState({pacoField:txt})

        this.props.fetchData()
    }

    render() {


        return (
            <Container>
                <Header style={{backgroundColor: '#3641a1'}}>
                    <Body>
                    <Title>Main Menu</Title>
                    </Body>
                </Header>
                <Content style={{padding: 5}}>
                    <Item floatingLabel last>
                        <Label>Paco Field</Label>
                        <Input

                            onChangeText={this.onPacoTypedChanged.bind(this)}
                            value={this.state.pacoField}
                        />
                    </Item>

                </Content>
            </Container>

        );
    }
}



function mapStateToProps (state) {
    return {
        paco: state.paco
    }
}

function mapDispatchToProps (dispatch) {
    return {
        fetchData: () => dispatch(fetchData())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(mainMenu)




