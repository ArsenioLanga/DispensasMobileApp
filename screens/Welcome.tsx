import { View, Text, Pressable, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';
import NetInfo from "@react-native-community/netinfo";
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from '@firebase/firestore';
import * as SQLite from 'expo-sqlite';
import { Home } from './Home';
import { onValue, ref, set} from "firebase/database";
import { TextInput } from "react-native";
import { useFocusEffect } from '@react-navigation/native';



const Welcome = ({ navigation }) => {
  // Abra o banco de dados (você pode escolher qualquer nome)
  const db = SQLite.openDatabase('RentCarDespesaApp.db');
  const [sessao, setSessao] = useState(null);
  const sessionData = null;
  const [url, setUrl] = useState(null);

  const [title, setTitle] = useState("Arsenio");
  const [body, setBody] = useState("Langa");
  const [todoData, setTodoData] = useState([])
  const [users, setUsers] = useState([])
  const [despesas, setDespesas] = useState([])
  const [resultadoBlob, setResultadoBlob] = useState(null);

    const pegarDadosSessao = () =>{
        db.transaction((tx) => {
              tx.executeSql(
                'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
                [],
                (_, { rows }) => {
                  if (rows.length > 0) {  
                    const sessionData = rows.item(0);  
                    setSessao(sessionData)
                  //  console.log('Dados da sessão Welcame:', sessionData);
                  } else {
                    console.log('Nenhuma sessão encontrada.');
                  }
                }
              );
            });       
         } 

    const navigateToHome = () => {
        navigation.navigate('Home');
    }

    const navigateToLogin = () => {
        navigation.navigate('Login');
    }

    const navigateToCreateAccount = () => {
        navigation.navigate('CriarcONTA');
    }

      useEffect(() => {
        pegarDadosSessao();
      try{
        // db.transaction(tx => {
        //   tx.executeSql("DELETE FROM despesaMotoristas");
        // });
        db.transaction(tx => {
          tx.executeSql("CREATE TABLE IF NOT EXISTS despesaMotoristas (id INTEGER PRIMARY KEY AUTOINCREMENT, idFoto TEXT, local TEXT, url TEXT, viatura TEXT, nrDoc TEXT, tipoDespesa TEXT, valorDespesa TEXT, qtdDespesa TEXT, total TEXT, motorista TEXT, status TEXT,dataDoc TEXT, observacao Text, TipoCombustivel Text, motivo TEXT, random TEXT, created_at TEXT, updated_at TEXT)");
        });
        console.log("Recriado");
      }catch{
        console.log("erro ao eliminar");
      }
    
   
      db.transaction((tx) => {
        tx.executeSql(
        'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario TEXT, senha TEXT, status TEXT, nome TEXT);',
        [],
        () => {
            console.log('Tabela de sessões criada com sucesso.');
        }
        );
    });
  console.log("Tabela despesaMotoristas recriada");
      }, []);

      useFocusEffect(
        React.useCallback(() => {
              pegarDadosSessao();
              pegarDadosSessao();     
        }, [])
      );
    
      useEffect(() => {
        // Verificar se a sessão existe e navegar para a tela Home se for o caso
        if (sessao) {
          navigation.navigate('Home',{sessao});
        }
      }, [sessao, navigation]);

    return (
        <View  style={{
            flex: 1,
            backgroundColor:COLORS.orange2,
            height:"80%"
        }}>

            {
            sessionData ?
            
            navigation.navigate('Home'): 
            
         
            <View style={{
                flex: 1,
                backgroundColor:COLORS.orange2,
                height:"80%"
            }}
            >

                <View style={{
                    paddingHorizontal: 22,
                    position: "absolute",
                    top: "30%",
                    width: "100%"
                }}>
                    <Text style={{
                         fontSize: 46,
                         color: COLORS.white,
                    }}>Vamos</Text>
                    <Text style={{
                        fontSize: 46,
                        color: COLORS.white
                    }}>Começar</Text>

                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                            marginVertical: 4
                        }}>Com um simples click</Text>
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.white,
                        }}>Reporta todas as despesas de forma rapida</Text>
                    </View>

                    <Button
                        title="Conecte-se"
                        onPress={navigateToLogin}
                        style={{
                            marginTop: 22,
                            width: "100%"
                        }}
                    />
                    

                   
                </View>
            </View>        
            }
        </View>


        
    )
}

export default Welcome