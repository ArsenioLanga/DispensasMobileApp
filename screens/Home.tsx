import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Expenses, Settings, Add, Reports } from '../screens';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import React from 'react'

const Tab = createBottomTabNavigator()

export const Home = ({ route }) => {
  const { sessao } = route.params;
  // Mova esta linha para dentro da função Home


  return (
    <Tab.Navigator screenOptions={{
      tabBarStyle:{
        backgroundColor: COLORS.orange2,
      }
    }}>
       <Tab.Screen name="Despesas" component={Expenses}  initialParams={{ sessao }} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" color={"white"} size={size} />
        ),
      }}/>
      <Tab.Screen name='Registar despesa' component={Add} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add" color={"white"} size={size} />
        ),
      }}/>
      <Tab.Screen name='Definições' component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={"white"} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


