import React, {Component} from "react";
import {Actions} from "react-native-router-flux";
import {Body, Button, Container, Content, Header, Icon, Spinner, Switch, Text, Title} from "native-base";
import {Col, Grid, Row} from "react-native-easy-grid";


import {connect} from "react-redux";


const goToItems = () => {

    Actions.items();
};




const formatBeaconId = function (beacon) {
    return (beacon.identifier + '_' + beacon.uuid+'_'+beacon.major+'_'+beacon.minor);
}

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


        };


    }


    componentWillUpdate(nextProps) {


    }

    componentDidUpdate(prevProps, prevState) {



    }

    componentDidMount() {



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
                    {this.state.showspinner && <Spinner /> }

                </Content>
            </Container>

        );
    }
}


function mapStateToProps(state) {
    return {
        auth: state.auth,


    }

}


export default connect(mapStateToProps, {



})(mainMenu);
