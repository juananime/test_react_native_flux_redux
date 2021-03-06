import React, {Component} from "react";
import {AsyncStorage, Image, Text} from "react-native";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";
import {Button, Content, Form, Input, Item, Label, Spinner} from "native-base";
import {Col, Grid, Row} from "react-native-easy-grid";
import firebase from "firebase";
import { emailChanged, passwordChanged, loginUser,userStored } from '../actions/AuthActions';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showspinner: false
        };
        // this._showDatePicker = this._showDatePicker.bind(this);
        // this._showAreaPicker= this._showAreaPicker.bind(this);
    }

    componentWillMount() {
        AsyncStorage.getItem('dbUser').then((value) => {
            if (value !== null) {
                // key exists
                var user = { uid: value };

                this.props.userStored(user)
            } else {
                // key does not exist
            }
        });

        AsyncStorage.getItem('curlocid').then((value) => {
            if (value !== null) {
                // key exists
            } else {
                // key does not exist
                AsyncStorage.setItem('curlocid', 'none');
            }
        });
    }

    componentDidMount(){
        this.doFireBase();
    }

    doFireBase() {
        const config = {
            apiKey: 'AIzaSyAd3ajChrBXWlux-3N6ZfCehdg9WXpNDmY',
            authDomain: 'manager-77ca0.firebaseapp.com',
            databaseURL: 'https://manager-77ca0.firebaseio.com',
            storageBucket: 'manager-77ca0.appspot.com',
            messagingSenderId: '987956351735'
        };
        firebase.initializeApp(config);
    }

    onEmailChange(text) {
        this.props.emailChanged(text);
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }

    onButtonPress() {
        //Actions.menu()
        const { email, password } = this.props;

        this.state.showspinner = true;

        this.props.loginUser({ email, password });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user !== this.props.user) {
          AsyncStorage.setItem('dbUser', nextProps.user.uid);
          Actions.menu();

        }
    }

    renderButton() {
        if (this.props.loading) {
            return <Spinner size="large" />;
        }

        return (
            <Button onPress={this.onButtonPress.bind(this)} block info>
            <Text>Login</Text>
            </Button>
        );
    }

    render() {
        return (

                <Content style={{ padding: 22 }}>
                    <Grid>
                        <Row>
                            <Image
                            style={{ width: 250, height: 75 }}
                              source={require('../img/symphonylogo.png')}
                            />
                        </Row>
                        <Row>
                            <Col>
                                <Form>
                                    <Item floatingLabel>
                                        <Label>Username</Label>
                                            <Input
                                                keyboardType = 'email-address'
                                                onChangeText={this.onEmailChange.bind(this)}
                                                value={this.props.email}
                                            />
                                    </Item>
                                    <Item floatingLabel last>
                                        <Label>Password</Label>
                                            <Input
                                                secureTextEntry
                                                onChangeText={this.onPasswordChange.bind(this)}
                                                value={this.props.password}
                                            />
                                    </Item>
                                    <Text style={styles.errorTextStyle}>
                                        {this.props.error}
                                    </Text>
                                    {this.props.loading && <Spinner /> }
                                </Form>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 22 }}>
                            <Col><Button onPress={this.onButtonPress.bind(this)} block info>
                            <Text>Login</Text>
                            </Button></Col>
                        </Row>
                    </Grid>
                </Content>


        );
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
};

const mapStateToProps = ({ auth }) => {
    const { email, password, error, loading , user} = auth;

    return { email, password, error, loading , user};
};

export default connect(mapStateToProps, {
    emailChanged, passwordChanged, loginUser,userStored
})(LoginForm);
