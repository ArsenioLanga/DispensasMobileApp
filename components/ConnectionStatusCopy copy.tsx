import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { datab } from '../config1';
import { onValue, ref} from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';

const ConnectionStatus = () => {
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      //Verificar se existe conexão a internet
      const unsubscribe = NetInfo.addEventListener((state) => {
         if (state.isConnected) {
            setIsConnected(false);
          // Verificar conexão a internet tem comunicação com o firebas
            getDataUpdateDespesas()
            .then((result) => {
              setIsConnected(state.isConnected);
              Alert.alert("Conexão bem-sucedida. Resultado: " + result);
            })
            .catch((error) => {
              setIsConnected(false);
              Alert.alert("Falha na conexão. Resultado: " + error);
            });
         }else{
          setIsConnected(false);
          Alert.alert("Falha na conexão.");
         }
       });
    
    
      function getDataUpdateDespesas(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const getDespesas = ref(datab, "Despesas/"); 
            onValue(getDespesas, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const newData = Object.keys(data).map((key) => ({
                        random: key,
                        ...data[key],
                    }));
                    const updatePromises: Promise<void>[] = [];
                    Promise.all(updatePromises)
                        .then(() => {
                            resolve(true); // Sucesso, retorna true
                        })
                        .catch(() => {
                            reject(false); // Falha, retorna false
                        });
                } else {
                    reject(false); // Falha se não há dados
                }
            });
        });
    }
    
      return () => {
        unsubscribe();
      };
    }, []);
    

    useFocusEffect(() => {
      //Verificar se existe conexão a internet
      const unsubscribe = NetInfo.addEventListener((state) => {
         if (state.isConnected) {
          // Verificar conexão a internet tem comunicação com o firebas
            getDataUpdateDespesas()
            .then((result) => {
              setIsConnected(state.isConnected);
            })
            .catch((error) => {
              setIsConnected(false);
            });
         }else{
          setIsConnected(false);
         }
       });
    
    
      function getDataUpdateDespesas(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try{
              const getDespesaUpdate = ref(datab, "Despesas/");
                onValue(getDespesaUpdate, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const newData = Object.keys(data).map((key) => ({
                        random: key,
                        ...data[key],
                    }));
                    const updatePromises: Promise<void>[] = [];
                    Promise.all(updatePromises)
                        .then(() => {
                            resolve(true); // Sucesso, retorna true
                        })
                        .catch(() => {
                            reject(false); // Falha, retorna false
                        });
                } else {
                    reject(false); // Falha se não há dados
                }
              });

            }catch{
              reject(false); // Falha se não há dados
            }
          
        });
    }
    

      return () => {
        unsubscribe();
      };
    });

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
  