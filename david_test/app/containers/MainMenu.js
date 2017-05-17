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
                    <Grid>
                        <Row>
                            <Col style={{padding: 5, height: 50}}>

                                <Switch
                                    onValueChange={(value) => this.setState({activateBeacons: value})}
                                    disabled={false}
                                    style={{position: 'absolute', top: 20, right: 10}}
                                    value={this.state.activateBeacons}/>
                                <Text style={{position: 'absolute', top: 15, right: 60}}>Activate iBeacons</Text>

                            </Col>
                        </Row>
                        {this.renderLocation()}
                        <Row>
                            <Col style={{padding: 5}}>

                                <Button iconLeft light full onPress={() => {
                                    this.doNFC();
                                }} style={{height: 80}}>
                                    <Icon name='qr-scanner'/>
                                    <Text>NFC</Text>
                                </Button>
                            </Col>

                            <Col style={{padding: 5}}>

                                <Button iconLeft light full style={{height: 80}} onPress={() => {
                                    this.doBarcode();
                                }}>
                                    <Icon name='barcode'/>
                                    <Text>Barcode</Text>
                                </Button>
                            </Col>

                        </Row>
                        <Row>
                            <Col style={{padding: 5}}>
                                <Button iconLeft light full onPress={() => {
                                    this.doSync();
                                }} style={{height: 80}}>
                                    <Icon name='sync'/>
                                    <Text>Sync</Text>
                                </Button>
                            </Col>

                        </Row>
                        <Row>
                            <Col style={{padding: 5}}>
                                <Button iconLeft light block onPress={gotoSuppliers} style={{height: 80}}>
                                    <Icon name='basket'/>
                                    <Text>Suppliers</Text>
                                </Button>
                            </Col>
                            <Col style={{padding: 5}}>
                                <Button iconLeft light block onPress={gotoLocations} style={{height: 80}}>
                                    <Icon name='compass'/>
                                    <Text>Locations</Text>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding: 5}}>
                                <Button iconLeft light block onPress={goToItems} style={{height: 80}}>
                                    <Icon name='shirt'/>
                                    <Text>Items</Text>
                                </Button>
                            </Col>
                            <Col style={{padding: 5}}>
                                <Button iconLeft light block onPress={goToTasks} style={{height: 80}}>
                                    <Icon name='checkmark'/>
                                    <Text>Tasks</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
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
