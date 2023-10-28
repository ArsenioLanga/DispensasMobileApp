import { View, Text,TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

import { theme } from "../Theme";


export const Categorias = () => {
// Abra o banco de dados (você pode escolher qualquer nome)
  const db = SQLite.openDatabase('despesasApp.db');

  const [isLoading, setIsLoading] = useState(true);
  const [currenteName, SetCurrentName] = useState(undefined);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS tipo_despesas (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
    });
    db.transaction(tx => {
        tx.executeSql("SELECT * FROM tipo_despesas", null,
         (txObj, resultSet) => setCategorias(resultSet.rows._array),
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
          <Text>Processando tipos de despesas...</Text>
      </View>
    )
  }

  const addName = ()=> {
      db.transaction(tx => {
          tx.executeSql("INSERT INTO tipo_despesas (name) values(?)", [currenteName],
           (txObj, resultSet) => {
              let existingNames = [...categorias];
              existingNames.push({id: resultSet.rows._array, name: currenteName});
              setCategorias(existingNames);
              SetCurrentName(undefined)
           },
           (txObj, error) => false
          );
      });
  }

  
  const deleteName = (id) =>{
    db.transaction(tx => {
      tx.executeSql("DELETE FROM tipo_despesas WHERE id = ?", [id],
        (txObj, resultSet) => {
          if(resultSet.rowsAffected > 0){
             let existingNames = [...categorias].filter(name => name.id !== id);
             setCategorias(existingNames);
          }
        },
        (txObj, error) => false
      );
    })
  };

  const updateName = (id) => {
    db.transaction(tx => {
      tx.executeSql("UPDATE names SET tipo_despesas = ? WHERE id = ?", [currenteName,id],
        (txObj, resultSet) => {
          if(resultSet.rowsAffected > 0){
            let existingNames = [...categorias];
            const indexToUpdet = existingNames.findIndex(name => name.id === id);
            existingNames[indexToUpdet].name = currenteName;
            setCategorias(existingNames);
            SetCurrentName(undefined);
         }
        },
        (txObj, error) => false
      );
    });
  }

  const showNames =() => {
    return categorias.map((name, index) => {
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
                <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{name.name}</Text>  
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
                    
                    {showNames()}
                   
                            
                </View>
            </ScrollView>
            <View style={{ 
                display: "flex",
                alignItems: "center",
                flexDirection: "row",  
                paddingVertical:8
                }}>
                <TextInput 
                    onChangeText={SetCurrentName}
                    value={currenteName}
                     placeholder="Categoria" 
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
                      <TouchableOpacity onPress={addName} style={{display:"flex", alignItems:"center", justifyContent:"center", padding:12}}>
                        <Feather name="send" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
            </View>
        
        </View>

    );

    }

    