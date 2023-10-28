import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { theme } from './Theme';
import { Home } from './screens/Home';
import { Categorias } from './screens/Categorias';
import { Viaturas } from './screens/Viaturas';
import { Motoristas } from './screens/Motoristas';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={theme}>
       <StatusBar style="light" />
          <Stack.Navigator>
            <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
            <Stack.Screen name='Categorias' component={Categorias}/>
            <Stack.Screen name='Veiculos' component={Viaturas}/>
            <Stack.Screen name='Motoristas' component={Motoristas}/>
          </Stack.Navigator>
      
  </NavigationContainer>
  );
}

