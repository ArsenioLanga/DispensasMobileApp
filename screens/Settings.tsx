import {Text, View, Alert} from "react-native"
import { ListItem } from "../components/LidstItem"
import { Entypo } from '@expo/vector-icons'; 
import { theme } from "../Theme";
import { useEffect } from "react";
import * as SQLite from 'expo-sqlite';



export const Settings = ({navigation}) => {
 // Abra o banco de dados (você pode escolher qualquer nome)
 const db = SQLite.openDatabase('RentCarDespesaApp.db');

   
 const eliminarSessao = () => {
      db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM sessions;',
              [],
              (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                  console.log('Sessão encerrada com sucesso.');
                  // Realize outras ações de encerramento de sessão, como navegar para a tela de login
                } else {
                  console.log('Nenhuma sessão para encerrar.');
                }
              }
            );
            navigation.navigate("Welcome")
          });
      }

      return(
      <View style={{
            margin: 16,
            borderRadius: 11,
            overflow: "hidden"
            }}>
           
              <ListItem
                  label="Sair da aplicação"
                  detail={<Entypo name="chevron-right" size={40} color="white" style={{opacity: 0.3}}/>}
                  onClick={() => {
                        Alert.alert("Tem certeza?", "Pretende sair da aplicação?", [
                              {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                  },
                                  {text: 'OK', onPress: () => {
                                    eliminarSessao()
                                  }},
                        ],{
                              userInterfaceStyle: 'dark',
                        })
                  }}
            />
            
      </View>
 )}