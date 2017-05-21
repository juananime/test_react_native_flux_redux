import React, {Component,PropTypes} from "react";
import {connect} from "react-redux";

import LoginForm from "./containers/LoginForm";
import Style from "./styles/styles";
import MainMenu from "./containers/MainMenu";

import {Router, Scene} from "react-native-router-flux";
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
