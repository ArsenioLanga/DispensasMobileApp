import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import {Text, View} from "react-native"
import React from 'react'

import { theme } from './Theme';
import { Home } from './screens/Home';
import { Categorias } from './screens/Categorias';
import PasswordComfirm from './screens/PasswordComfirm';
import RecuperarSenha from  './screens/RecuperarSenha';
import Login from './screens/Login';
import Welcome from './screens/Welcome';
import COLORS from './constants/colors';
import ConnectionStatus from './components/ConnectionStatus';


const Stack = createNativeStackNavigator();

export default function App() {

  const CustomStatusBar = () => {
    return (
      <View style={{ backgroundColor: COLORS.orange2}}>
        <ConnectionStatus /> 
      </View>
    );
  };

  return (
    <NavigationContainer theme={theme}> 
      <CustomStatusBar />
          <Stack.Navigator initialRouteName='Welcome'>
            <Stack.Screen name='Welcome' component={Welcome} options={{headerShown: false}}/>
            <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
            <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
            <Stack.Screen name='Categorias' component={Categorias}/>
            <Stack.Screen name='RecuperarSenha' component={RecuperarSenha}/>
            <Stack.Screen name='PasswordComfirm' component={PasswordComfirm}/>
          </Stack.Navigator>
      
       <Toast 
          config={{ 
            success: ({ text1, props, ...rest }) => (
              <View style={{ backgroundColor: COLORS.orange, padding: 16 }}>
                <Text style={{ color: 'white' }}>{text1}</Text>
              </View>
            ),
            error: ({ text1, props, ...rest }) => (
              <View style={{ backgroundColor: 'red', padding: 16 }}>
                <Text style={{ color: 'white' }}>{text1}</Text>
              </View>
            ),
            info: ({ text1, props, ...rest }) => (
              <View style={{ backgroundColor: 'blue', padding: 16 }}>
                <Text style={{ color: 'white' }}>{text1}</Text>
              </View>
            ),
            // Outras configurações aqui
          }}
      />
  </NavigationContainer>
  );
}

