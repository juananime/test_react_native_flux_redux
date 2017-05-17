import { Router } from 'react-native-router-flux';
import { Provider } from 'react-redux';
const ConnectedRouter = connect()(Router);
const store = createStore(appReducer);
export default class RnrfExample extends Component {
    render() {
        return (
            <Provider store={store}>
              <ConnectedRouter scenes={Scenes}/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('david_test', () => david_test);
