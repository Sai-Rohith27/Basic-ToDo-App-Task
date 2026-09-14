import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme';

export default function App() {
    return (
        <StoreProvider store={store}>
            <SafeAreaProvider>
                <ThemeProvider>
                    <PaperProvider>
                        <RootNavigator />
                    </PaperProvider>
                </ThemeProvider>
            </SafeAreaProvider>
        </StoreProvider>
    );
}
