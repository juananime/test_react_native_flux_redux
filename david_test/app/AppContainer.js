import React,{Component} from 'react';
import {
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    Text,
    View,
    Platform,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import LoginForm from './containers/LoginForm';

import LocationList from './containers/LocationList';
import Style from './styles/styles'
import LocationForm from './containers/LocationForm';
import ItemList from './containers/ItemList';
import ItemInfo from './containers/ItemInfo';
import ItemVariation from './containers/ItemVariation';
import TasksList from './containers/TasksList';
import TaskInfo from './containers/TaskInfo';

import ScanScreen from './containers/RFIDScanScreen';
import MainMenu from './containers/MainMenu';
import NFCContainer from './containers/NFCContainer';
import BarcodeScanScreen from './containers/BarcodeScanScreen';
import TagDetailInfo from './containers/TagDetailInfo';

import { Actions,Router, Scene, ActionConst, Modal, Reducer} from 'react-native-router-flux';
class AppContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { state, actions } = this.props;
        // console.log("Props", this.props, state, actions); // everything ok here


        return (


            <Router navigationBarStyle={Style.navBar} titleStyle={Style.navBarTitle} barButtonTextStyle={Style.barButtonTextStyle} barButtonIconStyle={Style.barButtonIconStyle}>

                <Scene key="root"  >

                    <Scene key="login" component={LoginForm} hideNavBar={true} />
                    <Scene key="menu" component={MainMenu} hideNavBar={true} />
                    <Scene key="scan" component={ScanScreen} hideNavBar={false} />
                    <Scene key="nfc" title='NFC screen' component={NFCContainer} hideNavBar={false} />
                    <Scene key="barcode" title='Barcode screen' component={BarcodeScanScreen} hideNavBar={false} />

                    <Scene key="locations" title='Locations' component={LocationList} hideNavBar={false} />
                    <Scene key="locationsForm" title='Locations Form' component={LocationForm} hideNavBar={false} />

                    <Scene key="items" title='Items' component={ItemList} hideNavBar={false} />
                    <Scene key="itemInfo" title="Item Info" component={ItemInfo} hideNavBar={false} />
                    <Scene key="itemVariation" title="Item Variation" component={ItemVariation} hideNavBar={false} />

                    <Scene key="tasks" title='Tasks' component={TasksList} hideNavBar={false} />
                    <Scene key="taskinfo" title='Task Details' component={TaskInfo} hideNavBar={false} />
                    <Scene key="tag_manager" title='Tags Manager' component={TagDetailInfo} hideNavBar={true} />

                </Scene>

            </Router>

        );
    }
}

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps (dispatch) {
    return {

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(AppContainer);
