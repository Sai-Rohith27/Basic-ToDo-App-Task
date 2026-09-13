import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { PaperProvider } from 'react-native-paper';

// We'll create navigation next - for now placeholder
import NavigationContainer from './navigation/RootNavigator';

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider>
                <NavigationContainer />
            </PaperProvider>
        </Provider>
    );
}