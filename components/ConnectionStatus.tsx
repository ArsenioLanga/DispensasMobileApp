import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { datab } from '../config1';
import { onValue, ref} from "firebase/database";
import axios from 'axios';

const ConnectionStatus = () => {
    const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    //Verificar se existe conexão a internet
    const unsubscribe = NetInfo.addEventListener((state) => {
       if (state.isConnected) {
          setIsConnected(false);
        // Verificar conexão a internet tem comunicação com o firebas
        try{ 
          const urlGoogleSearch = 'https://www.google.co.mz/'
          axios.get(urlGoogleSearch)
            .then((response) => {
              setIsConnected(state.isConnected);
              //Alert.alert("Conexão activa");
              console.log('Resposta da pesquisa no Google:', response.data);
            })
            .catch((error) => {
              setIsConnected(false);
              //Alert.alert("Sem conexão a firebase" +error);
            });
        }catch{
          setIsConnected(false);
             // Alert.alert("Sem conexão");
        }     
       }else{
        setIsConnected(false);
       // Alert.alert("Falha na conexão.");
       }
     });
    return () => {
      unsubscribe();
    };
  }, []);

  function pesquisaNoGoogle() {
    const termoPesquisa = 'barco preto';  // O termo que você deseja pesquisar
  
    // URL da API de busca do Google (exemplo, pode não ser a URL real)
    const urlGoogleSearch = 'https://www.googleapis.com/customsearch/v1?q=' + encodeURIComponent(termoPesquisa);
  
    axios.get(urlGoogleSearch)
      .then((response) => {
        // Manipule a resposta da pesquisa do Google aqui
        console.log('Resposta da pesquisa no Google:', response.data);
      })
      .catch((error) => {
        // Manipule os erros aqui
        console.error('Erro na pesquisa no Google:', error.message);
      });
  }

 
    return (
      <View style={styles.container}>
        <View style={[styles.light, isConnected ? styles.greenLight : styles.redLight]} />
        <Text style={styles.statusText}>{isConnected ? 'Conectado' : 'Desconectado'}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: "flex-end",
      right: 10,
    },
    light: {
      width: 12,
      height: 12,
      borderRadius: 10,
      margin: 5
    },
    greenLight: {
      backgroundColor: '#00FF00'
    },
    redLight: {
      backgroundColor: '#FF0000'
    },
    statusText: {
      fontSize: 16,
      marginLeft: 5,
      color: 'white',
      fontWeight: '900'
    },
  });
  
  export default ConnectionStatus;
  