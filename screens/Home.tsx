import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Expenses, Settings, Add, Reports } from '../screens';
import { Ionicons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator()

export const Home = () => (
    <Tab.Navigator screenOptions={{
        tabBarStyle:{
          backgroundColor: "#000",
        
        }
       }}>
          <Tab.Screen name='Despesas' component={Expenses} options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={"white"} size={size} />
              ),
          }}></Tab.Screen>
          <Tab.Screen name='Relatorios' component={Reports}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart" color={"white"} size={size} />
            ),
         }}    
          ></Tab.Screen>
          <Tab.Screen name='Registar despesa' component={Add}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="add" color={"white"} size={size} />
              ),
          }}
          ></Tab.Screen>
          <Tab.Screen name='Definições' component={Settings}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={"white"} size={size} />
            ),
        }}
         ></Tab.Screen>
      </Tab.Navigator>
)