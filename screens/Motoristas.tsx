import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Feather } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

import { theme } from "../Theme";
import { Motorista } from "../Models/motorista";
import { MotoristaRow } from "../components/MotoristaRow";


export const Motoristas = () => {
    // Abra o banco de dados (você pode escolher qualquer nome)
    const db = SQLite.openDatabase('despesasApp.db');

    const [isLoading, setIsLoading] = useState(true);
    const [currentNome, SetCurrenNome] = useState(undefined);
    const [currentServico, SetCurrentServico] = useState(undefined);
    const [currentNrCartao, SetCurrenNrcartao] = useState(undefined);
    const [currentNib, SetCurrentNib] = useState(undefined);
    const [currentContacto, SetCurrentContacto] = useState(undefined);
    const [motoristas, setMotoristas] = useState([]);



    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS motoristas (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, servico TEXT, contacto TEXT, nr_Cartao TEXT, nib TEXT)");
        });
        db.transaction(tx => {
            tx.executeSql("SELECT * FROM motoristas", null,
             (txObj, resultSet) => setMotoristas(resultSet.rows._array),
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
              <Text>Processando Motoristas...</Text>
          </View>
        )
      }

      const addMotorista = ()=> {
        db.transaction(tx => {
            tx.executeSql("INSERT INTO motoristas (nome, servico, contacto, nr_Cartao, nib) values(?, ?, ?, ?, ?)", [currentNome, currentServico, currentContacto, currentNrCartao, currentNib],
             (txObj, resultSet) => {
                let existingNames = [...motoristas];
                existingNames.push({id: resultSet.rows._array, nome: currentNome, servico: currentServico, contacto:currentContacto, nr_Cartao:currentNrCartao, nib:currentNib});
                setMotoristas(existingNames);
                SetCurrenNome(undefined)
                SetCurrentServico(undefined)
                SetCurrentContacto(undefined)
                SetCurrenNrcartao(undefined)
                SetCurrentNib(undefined)
             },
             (txObj, error) => false
            );
        });
    }
    
    
    const deleteMotorista = (id) =>{
      db.transaction(tx => {
        tx.executeSql("DELETE FROM motoristas WHERE id = ?", [id],
          (txObj, resultSet) => {
            if(resultSet.rowsAffected > 0){
               let existingNames = [...motoristas].filter(nome => nome.id !== id);
               setMotoristas(existingNames);
            }
          },
          (txObj, error) => false
        );
      })
    };
    
const updateVeiculo = (id) => {
    db.transaction(tx => {
      tx.executeSql("UPDATE motoristas SET nome = ?, servico = ?, contacto = ?, nr_Cartao = ?, nib = ? WHERE id = ?", [currentNome, currentServico, currentContacto, currentNrCartao, currentNib,id],
        (txObj, resultSet) => {
          if(resultSet.rowsAffected > 0){
            let existingNames = [...motoristas];
            const indexToUpdet = existingNames.findIndex(nome => nome.id === id);
            existingNames[indexToUpdet].nome = currentNome;
            setMotoristas(existingNames);
            SetCurrenNome(undefined)
            SetCurrentServico(undefined)
            SetCurrentContacto(undefined)
            SetCurrenNrcartao(undefined)
            SetCurrentNib(undefined)
         }
        },
        (txObj, error) => false
      );
    });
  }

  const show =() => {
    return motoristas.map((motorista, index) => {
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
                <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{motorista.nome}</Text>  
                <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{motorista.contacto}</Text>
                <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{motorista.nr_Cartao}</Text>
                <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{motorista.servico}</Text>
            </View>
        );
    });
  }

    
       
    return (
        <View style={{ margin: 16, flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <View style={{
                    borderRadius: 11,
                    overflow: "hidden",
                }}>
                     {show()}

                </View>
            </ScrollView>
            <View
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "row",
                    paddingVertical: 8,
                    height: "35%"
                }}>

                <View style={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    paddingVertical: 8,
                    height: "100%",
                    width: "90%"
                }}>
                    <TextInput
                        onChangeText={SetCurrenNome}
                        value={currentNome}
                        placeholder="Nome"
                        placeholderTextColor={theme.colors.border}
                        style={{
                            color: "white",
                            height: 40,
                            borderColor: theme.colors.border,
                            borderWidth: 1,
                            flex: 1,
                            borderRadius: 8,
                            paddingLeft: 8,
                            marginLeft: 8,
                            width: "98%"
                        }} />
                    <TextInput
                        onChangeText={SetCurrentServico}
                        value={currentServico}
                        placeholder="Serviço"
                        placeholderTextColor={theme.colors.border}
                        style={{
                            color: "white",
                            height: 40,
                            borderColor: theme.colors.border,
                            borderWidth: 1,
                            flex: 1,
                            borderRadius: 8,
                            paddingLeft: 8,
                            marginLeft: 8,
                            width: "98%"
                        }} />
                    <TextInput
                        onChangeText={SetCurrentContacto}
                        value={currentContacto}
                        placeholder="Contacto"
                        placeholderTextColor={theme.colors.border}
                        style={{
                            color: "white",
                            height: 40,
                            borderColor: theme.colors.border,
                            borderWidth: 1,
                            flex: 1,
                            borderRadius: 8,
                            paddingLeft: 8,
                            marginLeft: 8,
                            width: "98%"
                        }} />
                    <TextInput
                        onChangeText={SetCurrenNrcartao}
                        value={currentNrCartao}
                        placeholder="Nº Cartão"
                        placeholderTextColor={theme.colors.border}
                        style={{
                            color: "white",
                            height: 40,
                            borderColor: theme.colors.border,
                            borderWidth: 1,
                            flex: 1,
                            borderRadius: 8,
                            paddingLeft: 8,
                            marginLeft: 8,
                            width: "98%"
                        }} />
                    <TextInput
                        onChangeText={SetCurrentNib}
                        value={currentNib}
                        placeholder="NIB"
                        placeholderTextColor={theme.colors.border}
                        style={{
                            color: "white",
                            height: 40,
                            borderColor: theme.colors.border,
                            borderWidth: 1,
                            flex: 1,
                            borderRadius: 8,
                            paddingLeft: 8,
                            marginLeft: 8,
                            width: "98%"
                        }} />
                </View>
                <View>
                    <TouchableOpacity onPress={addMotorista} style={{
                         display: "flex", 
                         alignItems: "flex-end", 
                         justifyContent: "center",
                         padding: 12,
                         paddingTop:90,
                        }}>
                        <Feather name="send" size={24} color={theme.colors.primary}  />
                    </TouchableOpacity>
                </View>
            </View>

        </View>

    );

}