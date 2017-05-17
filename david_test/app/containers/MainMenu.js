import React, {Component} from "react";
import {Actions} from "react-native-router-flux";
import {AsyncStorage, DeviceEventEmitter, Picker, View} from "react-native";
import {Body, Button, Container, Content, Header, Icon, Item, Spinner, Switch, Text, Title} from "native-base";
import {Col, Grid, Row} from "react-native-easy-grid";
import _ from "lodash";
//import {beaconsOnRange} from "../actions/BeaconsActions";
import {locationsFetch} from "../actions/LocationsActions";
import {configUpdated} from "../actions/GeneralConfigActions";
import {tagsFetch} from "../actions/TagsActions";
import {settingsFetch} from "../actions/SettingsActions";
import {itemsFetch} from "../actions/ItemsActions";
import BeaconInfo from "../components/BeaconInfo";
import Beacons from "react-native-beacons-manager";


import {connect} from "react-redux";
import PouchDB from "../services/PouchDBService";

const goToItems = () => {

    Actions.items();
};

const goToTasks = () => {

    Actions.tasks();
};

const gotoSuppliers = () => {

};
const goToScan = () => {

    Actions.scan();

};
const gotoLocations = () => {

    Actions.locations();

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

        this.beaconsOnRange = {};
        this.beaconsRegistered = [];
        this.locationSelected = {} // this.state.locationSelected
        this.areaSelected = {};
        this.beaconsAlreadyOnTrack = [];
       // this.rangeGlitchCount = 0;
        this.nearestBeacon = {distance:1000, uuid:'', id:''};
    }


    componentWillUpdate(nextProps) {


    }

    componentDidUpdate(prevProps, prevState) {


        if (prevProps.locations !== this.props.locations) {


            var locationsAux = this.state.locations
            for (var indx in this.props.locations) {
                if (this.props.locations[indx].areas !== null) {


                    locationsAux[indx] = this.props.locations[indx];
                    this.setState({locations: locationsAux})
                }
            }

            this.updateBeaconsRegisteredSystem()


        }


        if (prevProps.systemCapabilities !== this.props.systemCapabilities) {
            console.log('BLUETOOTH => ' + this.props.systemCapabilities.bluetoothActive)
            this.setState({bluetoothActive: this.props.systemCapabilities.bluetoothActive})
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('firstrun', (err, result) => {
            if (!result) {
                console.log('firstrun: no');
                console.log('this.props.auth.user.uid: '+this.props.auth.user.uid);
                AsyncStorage.setItem('firstrun', 'yes');
                PouchDB.connect(this.props.auth.user.uid, this.onPouchInit.bind(this));
            } else {
                console.log('firstrun:',result);

                this.onPouchInit();
            }
        });
        Beacons.detectIBeacons();
        DeviceEventEmitter.addListener(
            'beaconsDidRange',
            (data) => {

                //console.log('beaconsDidRange data: ', data);

                var beaconsOnRangeAux = this.beaconsOnRange;


                if (data.beacons.length > 0) {
                    data.beacons.forEach(function (item) {
                        var beaconOnRangeID = formatBeaconId({uuid:data.uuid, identifier:data.identifier, major:item.major,minor:item.minor})
                        beaconsOnRangeAux[beaconOnRangeID] = data.beacons[0];
                        beaconsOnRangeAux[beaconOnRangeID].identifier = data.identifier;
                    })


                }
                this.beaconsOnRange = beaconsOnRangeAux;

               // console.log('Beacons on range ==> ', this.beaconsOnRange)

                if (this.state.activateBeacons) {
                    this.checkNearestBeaconsOnRegion()
                } else {
                    this.setState({enablePicker: true})
                }
            }
        );

        // monitoring:
        DeviceEventEmitter.addListener(
            'regionDidEnter',
            ({identifier, uuid, minor, major}) => {
                console.log('monitoring - regionDidEnter data: ', {identifier, uuid, minor, major});
                //  const time = moment().format(TIME_FORMAT);
                // this.setState({ regionEnterDatasource: this.state.rangingDataSource.cloneWithRows([{ identifier, uuid, minor, major, time }]) });
            }
        );

        DeviceEventEmitter.addListener(
            'regionDidExit',
            ({identifier, uuid, minor, major}) => {
                console.log('monitoring - regionDidExit data: ', {identifier, uuid, minor, major});

                var beaconOnRangeID = formatBeaconId({identifier:identifier,uuid:uuid, major:major, minor:minor})

                delete  this.beaconsOnRange[beaconOnRangeID];
                // const time = moment().format(TIME_FORMAT);
                //  this.setState({ regionExitDatasource: this.state.rangingDataSource.cloneWithRows([{ identifier, uuid, minor, major, time }]) });
            }
        );


    }

    checkNearestBeaconsOnRegion() {

        var nearestDist = 1000;

        var nearesHasChanged = false;

        if (JSON.stringify(this.beaconsOnRange) === '{}') {



            this.setState({enablePicker: true})


        } else {

            for (key_id in this.beaconsOnRange) {

               // console.log('XXX comparing ===>'+this.beaconsOnRange[key_id].identifier+ ':: ditance '+ this.beaconsOnRange[key_id].distance)
             //   console.log('XXX comparing nearestBeacon===> '+this.nearestBeacon.identifier + ':: dust :; '+this.nearestBeacon.distance)

                if (this.beaconsOnRange[key_id].distance < nearestDist) {
                    nearestDist = this.beaconsOnRange[key_id].distance;
                   // console.log('CHANGED :: XXXXXXXXXXXXXXXXXXX  =====> ');
                    nearesHasChanged = true;
                    this.nearestBeacon = this.beaconsOnRange[key_id]

                }
            }

            if (nearesHasChanged) {
                this.processBeaconsData(this.nearestBeacon)
            }

        }


    }

    processBeaconsData(nearest) {


        var foundBeacon = false;


        // console.log('NEAREST ===========> '+nearest.uuid)
        for (var i = 0; i < this.props.locations.length; i++) {
            var loc = this.props.locations[i]
            for (var j = 0; j < loc.areas.length; j++) {

                if (loc.areas[j]['beacon']) {
                    // console.log(' CHEKING ==== >>> ', nearest)
                    if (loc.areas[j].beacon.uuid === nearest.uuid) {

                       // console.log('NEAREST BBBB TO ===========> ' + nearest.uuid)
                        var objArea = {"value": loc.areas[j].areaid, "label": loc.areas[j].areaname}
                        var objLocation = {"value": loc._id, "label": loc.locationname}

                        this.setState({enablePicker: false})

                        foundBeacon = true;

                        if (JSON.stringify(this.locationSelected.value) !== JSON.stringify(loc._id) || this.areaSelected['value'] !== loc.areas[j].areaid) {

                           // console.log('NEAREST CHANGING TO BBBBBB ===========> ' + nearest.uuid)
                            this.onLocationChange(JSON.stringify(objLocation))
                            this.onAreaChange(JSON.stringify(objArea))
                        }


                    }
                }
            }
        }

        if (!foundBeacon) {

            this.setState({enablePicker: true})
        }


    }


    onPouchInit() {


        this.props.locationsFetch(() => {


            this.setState({showspinner: false})

            this.props.itemsFetch();

            this.props.settingsFetch();

            this.props.tagsFetch();

            console.log('LOC ==== > ', this.state.locations)

            AsyncStorage.getItem('curloc', (err, result) => {
                if (!result) {
                    //const lit = '{"key": "' + this.state.locations[0]._id + '","value":"' + this.state.locations[0].locationname + '"}';
                    const lit = {key: this.state.locations[0]._id, value: this.state.locations[0].locationname}
                    this.locationSelected = lit;
                    AsyncStorage.setItem('curloc', JSON.stringify(lit));

                    this.setAreaList(lit);
                } else {
                    this.locationSelected = JSON.parse(result);

                    this.setAreaList(this.locationSelected);
                }

            });
            AsyncStorage.getItem('curarea', (err, result) => {
                if (!result) {

                } else {

                    this.areaSelected = result;
                }


            });

            this.updateBeaconsRegisteredSystem()

        });


    }


    updateBeaconsRegisteredSystem() {

        // this.stopBeacons()

        var locationsAux = this.props.locations
        this.beaconsRegistered = [];
        //  var regBeacons = [];
        for (var i = 0; i < locationsAux.length; i++) {
            let loc = locationsAux[i];
            if (loc.areas != null) {
                for (var j = 0; j < loc.areas.length; j++) {

                    if (loc.areas[j].beacon != null) {

                        var beaconAux = Object.assign(loc.areas[j].beacon);
                        beaconAux.id = formatBeaconId(beaconAux);

                       // console.log('BEAOCN ID REG ===> ', beaconAux)
                        this.beaconsRegistered.push(beaconAux);
                    }
                }
            }

        }


        //console.log('regBeacons => ', this.beaconsRegistered, locationsAux)

        if (this.beaconsRegistered.length > 0)
            this.doBeacons();
    }


    /**
     * Beacons range detections
     */
    doBeacons() {

        console.log('doBeacons', this.beaconsRegistered)
        for (var i = 0; i < this.beaconsRegistered.length; i++) {
            const beaconItem = this.beaconsRegistered[i];

            console.log('forEach => ', beaconItem)
            // TO FIX (In lib): "startRangingBeaconsInRegion" should take an object as parameter to make it uniform with iOS
            // NOTE: needs to take either object or like now multiple parameters to avoid users breaking changes
            //identifier + uuid + major + minor

            var idAreadyOnTrack = null;
            idAreadyOnTrack = _.find(this.beaconsAlreadyOnTrack, function (id) {
                return id === beaconItem.id
            });

            if (!idAreadyOnTrack) {
                this.beaconsAlreadyOnTrack.push(beaconItem.id)
                console.log('ID NOT ON RANGE ==> ' + beaconItem.identifier)
                Beacons
                    .startRangingBeaconsInRegion(beaconItem.identifier, beaconItem.uuid, beaconItem.major, beaconItem.minor)
                    .then(() => console.log('Beacons ranging started succesfully'))
                    .catch(error => console.log(`Beacons ranging not started, error: ${error}`));
                Beacons
                    .startMonitoringForRegion({
                        identifier: beaconItem.identifier,
                        uuid: beaconItem.uuid,
                        major: beaconItem.major,
                        minor: beaconItem.minor
                    }) // minor and major are null here
                    .then(() => console.log('Beacons monitoring started succesfully'))
                    .catch(error => console.log(`Beacons monitoring not started, error: ${error}`));
            }


        }
    }


    onLocationChange(value: string) {

        const obj = JSON.parse(value);
        AsyncStorage.setItem('curloc', value);
        this.locationSelected = obj;
        this.setState({locationSelectedPicker: value})
        console.log('loc:: ', value);
        this.setAreaList(obj);
    }

    setAreaList(obj) {
        for (var i = 0; i < this.state.locations.length; i++) {
            if (this.state.locations[i]._id === obj.key) {
                this.setState({areas: this.state.locations[i].areas});
                if (this.areaSelected === {} && i == 0) {
                    // const ait = '{"key": "' + this.state.locations[0].areas[0].areaid + '","value":"' + this.state.locations[0].areas[0].areaname + '"}';
                    const ait = {
                        key: this.state.locations[0].areas[0].areaid,
                        value: this.state.locations[0].areas[0].areaname
                    }


                    this.areaSelected = ait,
                        this.updateAreaProp();
                }
            }
        }
    }

    onAreaChange(value: string) {


        AsyncStorage.setItem('curarea', value);
        console.log('curarea', value);
        this.areaSelected = JSON.parse(value)

        this.setState({areaSelectedPiker: value})

        const config = {
            locationSelected: this.locationSelected,
            areaSelected: JSON.parse(value)
        };
        console.log('this.state.areaSelected.config', config);
        this.updateAreaProp();
        this.props.configUpdated(config);
    }

    updateAreaProp() {
        const config = {
            locationSelected: this.locationSelected,
            areaSelected: this.areaSelected
        };

        console.log('this.state.areaSelected.config', config);
        this.props.configUpdated(config);
    }

    doSync() {
        console.log('doSync');
        PouchDB.connect(this.props.auth.user.uid, this.onPouchInit.bind(this));
    }

    doNFC() {
        Actions.nfc();
    }

    doBarcode() {
        Actions.barcode();
    }

    renderScanButton() {
        if (this.state.bluetoothActive) {
            return (
                <Button iconLeft light full onPress={goToScan} style={{height: 80}}>
                    <Icon name='qr-scanner'/>
                    <Text>RFID</Text>
                </Button>
            )
        } else {
            return (
                <Button iconLeft light full style={{height: 80, opacity: 0.5}}>
                    <Icon name='qr-scanner'/>
                    <Text>RFID</Text>
                </Button>
            )
        }
    }

    renderLocation() {


        if (this.state.enablePicker) {
            let LocationList = this.state.locations.map((s, i) => {
                const lit = '{"key": "' + s._id + '","value":"' + s.locationname + '"}';

                return <Item key={i} label={s.locationname} value={lit}/>
            });

            let AreaList = this.state.areas.map((a, i) => {
                const ait = '{"key": "' + a.areaid + '","value":"' + a.areaname + '"}';

                return <Item key={i} label={a.areaname} value={ait}/>
            });
            return (
                <View>
                    <Row>
                        <Col>
                            <Picker

                                enabled={this.state.enablePicker}
                                iosHeader="Select Location"
                                mode="dropdown"
                                selectedValue={this.state.locationSelectedPicker}
                                onValueChange={this.onLocationChange.bind(this)}>
                                {LocationList}
                            </Picker>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Picker
                                enabled={this.state.enablePicker}
                                iosHeader="Select Area"
                                mode="dropdown"
                                selectedValue={this.state.areaSelectedPiker}
                                onValueChange={this.onAreaChange.bind(this)}>
                                {AreaList}
                            </Picker>
                        </Col>
                    </Row>
                </View>
            )
        } else {
            return (
                <View>
                    <Row>
                        <Col>
                            <Text>{this.state.nearestBeaconId}</Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <BeaconInfo location={this.locationSelected} area={this.areaSelected}/>
                        </Col>
                    </Row>
                </View>

            )
        }


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

                                {this.renderScanButton()}
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
        locations: state.locations,
        systemCapabilities: state.systemCapabilities,
        beacons: state.beacons,

    }

}


export default connect(mapStateToProps, {

    locationsFetch, configUpdated, itemsFetch, tagsFetch, settingsFetch,

})(mainMenu);
