import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { datab } from '../config1';
import { onValue, ref } from "firebase/database";

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    //Verificar se existe conexão a internet
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setIsConnected(false);
        // Verificar conexão a internet tem comunicação com o firebas
        try {
          var data = null
          try {
            const getDespesas = ref(datab, "Despesas/");
             onValue(getDespesas, (snapshot) => {
               data = snapshot.val();
              console.log("data" + data);
            });
          } catch (error) {
            data = null
            setIsConnected(false);
          }
            if (data === null) {
              setIsConnected(false);
              Alert.alert("Sem conexão a firebase");
            }else{
              setIsConnected(state.isConnected);
              Alert.alert("Conexão activa");
              data = null
            }
        } catch {
          setIsConnected(false);
          Alert.alert("Sem conexão");
        }
      } else {
        setIsConnected(false);
        Alert.alert("Falha na conexão.");
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);


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
