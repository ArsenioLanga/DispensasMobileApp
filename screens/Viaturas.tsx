import { View, Text,TextInput, TouchableOpacity, ScrollView, Button } from "react-native";
import { Feather } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';

import { theme } from "../Theme";


export const Viaturas = () => {
// Abra o banco de dados (você pode escolher qualquer nome)
  const db = SQLite.openDatabase('despesasApp.db');

  const [isLoading, setIsLoading] = useState(true);
  const [currenteMarca, SetCurrenteMarca] = useState(undefined);
  const [currenteMatricula, SetCurrenteMatricula] = useState(undefined);
  const [veiculos, setVeiculos] = useState([]);
  
  useEffect(() => {
    db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS veiculos (id INTEGER PRIMARY KEY AUTOINCREMENT, marca TEXT, matricula TEXT)");
    });
    db.transaction(tx => {
        tx.executeSql("SELECT * FROM veiculos", null,
         (txObj, resultSet) => setVeiculos(resultSet.rows._array),
         (txObj, error) => false
        );
    });
    setIsLoading(false)
  }, []);
 
  if(isLoading){
    return(
      <View style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
          <Text>Processando veículos...</Text>
      </View>
    )
  }
   
  const addVeiculo = ()=> {
    db.transaction(tx => {
        tx.executeSql("INSERT INTO veiculos (marca, matricula) values(?, ?)", [currenteMarca, currenteMarca],
         (txObj, resultSet) => {
            let existingNames = [...veiculos];
            existingNames.push({id: resultSet.rows._array, marca: currenteMarca, matricula: currenteMatricula});
            setVeiculos(existingNames);
            SetCurrenteMarca(undefined)
            SetCurrenteMatricula(undefined)
         },
         (txObj, error) => false
        );
    });
}


const deleteVeiculo = (id) =>{
  db.transaction(tx => {
    tx.executeSql("DELETE FROM veiculos WHERE id = ?", [id],
      (txObj, resultSet) => {
        if(resultSet.rowsAffected > 0){
           let existingNames = [...veiculos].filter(marca => marca.id !== id);
           setVeiculos(existingNames);
        }
      },
      (txObj, error) => false
    );
  })
};

const updateVeiculo = (id) => {
    db.transaction(tx => {
      tx.executeSql("UPDATE veiculos SET marca = ?, matricula = ?  WHERE id = ?", [currenteMarca,currenteMatricula,id],
        (txObj, resultSet) => {
          if(resultSet.rowsAffected > 0){
            let existingNames = [...veiculos];
            const indexToUpdet = existingNames.findIndex(marca => marca.id === id);
            existingNames[indexToUpdet].marca = currenteMarca;
            setVeiculos(existingNames);
            SetCurrenteMarca(undefined);
            SetCurrenteMatricula(undefined);
         }
        },
        (txObj, error) => false
      );
    });
  }

  const showVeiculos =() => {
    return veiculos.map((vehicle, index) => {
        return(
            <View key={index} style={{
                display:"flex",
                flexDirection: "row",
                alignItems: "center",
                width:"100%",
                justifyContent: "flex-start",
                padding: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                backgroundColor: theme.colors.card,
            }}>
                <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{vehicle.marca}</Text>  
                <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{vehicle.matricula}</Text>
             
            </View>
        );
    });
  }

  

    return (
        <View style={{margin: 16, flex: 1}}>
            <ScrollView style={{flex: 1}}>
                <View style={{
                    borderRadius: 11,
                    overflow: "hidden",
                }}>
                    {showVeiculos()}
                            
                </View>
            </ScrollView>
            <View style={{ 
                display: "flex",
                alignItems: "center",
                flexDirection: "row",  
                paddingVertical:8
                }}>
                <TextInput 
                    onChangeText={SetCurrenteMarca}
                    value={currenteMarca}
                     placeholder="Modelo da viatura" 
                     placeholderTextColor={theme.colors.border} 
                     style={{
                        color:"white", 
                        height: 40,
                        borderColor: theme.colors.border,
                        borderWidth: 1,
                        flex: 1,
                        borderRadius: 8,
                        paddingLeft:8,
                        marginLeft:8
                     }}/>
                      <TextInput 
                    onChangeText={SetCurrenteMatricula}
                    value={currenteMatricula}
                     placeholder="Matricula da viatura" 
                     placeholderTextColor={theme.colors.border} 
                     style={{
                        color:"white", 
                        height: 40,
                        borderColor: theme.colors.border,
                        borderWidth: 1,
                        flex: 1,
                        borderRadius: 8,
                        paddingLeft:8,
                        marginLeft:8
                     }}/>
                      <TouchableOpacity onPress={addVeiculo} style={{display:"flex", alignItems:"center", justifyContent:"center", padding:12}}>
                        <Feather name="send" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
            </View>
        
        </View>

    );

    }