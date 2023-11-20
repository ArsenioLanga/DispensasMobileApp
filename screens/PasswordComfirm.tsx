import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Button from '../components/Button';
import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-toast-message';


const PasswordComfirm = ({ navigation }) => {
// Abra o banco de dados (você pode escolher qualquer nome)
const db = SQLite.openDatabase('sixtDespesaApp.db');

    const [isLoading, setIsLoading] = useState(true);
    const [password, SetPassword] = useState(null);
    const [newpassword, setNewPassword] = useState(null);
    const [newpassword1, setNewPassword1] = useState(null);
    const [sessao, setSessao] = useState(null)
    const [users, setUsers] = useState([]);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    
    useEffect(() => {
                db.transaction(tx => {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT ,email TEXT, telefone TEXT, password TEXT)");
                });
                setIsLoading(false)
                   
      }, []);

      
    const pegarDadosSessao = () =>{
        db.transaction((tx) => {
              tx.executeSql(
                'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
                [],
                (_, { rows }) => {
                  if (rows.length > 0) {  
                    const sessionData = rows.item(0);  
                    setSessao(sessionData)
                    console.log('Dados da sessão recuperados:', sessionData);
                  } else {
                    console.log('Nenhuma sessão encontrada.');
                  }
                }
              );
            });       
         }


      if(isLoading){
        return (
            <View style={{
                  flex: 1,
                  backgroundColor: COLORS.orange2,
                  alignItems: 'center',
                  justifyContent: 'center',
            }}>
                  {/* <Text style={{ color: COLORS.white }}>Processando...</Text> */}
                  <Image
                        source={require('../spinner/spinner.gif')} // Substitua pelo caminho do seu GIF de spinner
                        style={{ width: 140, height: 140, backgroundColor: COLORS.orange2 }} // Ajuste o tamanho conforme necessário
                        />
            </View>
      )
      }
     
      const showToast = () => {
        Toast.show({
          type: 'success', // Pode ser 'success', 'error', 'info', ou 'custom'
          position: 'top', // Posição: 'top' ou 'bottom'
          text1: 'Registado de sucesso',
          visibilityTime: 3000, // Duração em milissegundos
        });
     }
        const showToastError = () => {
            Toast.show({
              type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'Preencha todos os campos',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }

        const showToastErrorValid = () => {
            Toast.show({
              type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'As senha devem ser iguais',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }

      const upDatePass = ()=> {
        if( password == null || newpassword1 == null || newpassword == null ){
                    SetPassword(null);
                    setNewPassword(null);
                    setNewPassword1(null);
            return(showToastError())
        }

        if(  newpassword1 !== newpassword){
            SetPassword(null);
            setNewPassword(null);
            setNewPassword1(null);
                return(showToastErrorValid())
            }

            db.transaction(tx => {
                tx.executeSql("UPDADE users SET password = ? WHERE usuario = ?", [newpassword, sessao.usuario],
                 (txObj, resultSet) => {
                    let existingNames = [...users];
                    existingNames.push({id: resultSet.rows._array, password: newpassword});
                    setUsers(existingNames);
                    SetPassword(null);
                    setNewPassword(null);
                    setNewPassword1(null);
                    console.log("SEnha alterada")
                    console.log(users)
                 },
                 (txObj, error) => false
                );
            });
            showToast()
            console.log(users)
           //  navigation.navigate("Welcome")
    }
   
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
                        Redifinição da senha
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: COLORS.black
                    }}>Registe as tuas despesas hoje!</Text>
                </View>

               
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        marginVertical: 8
                    }}>Senha Antiga</Text>

                    <View style={{
                        width: "100%",
                        height: 40,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            onChangeText={SetPassword}
                            value={password}
                            placeholder='Introduza a senha atribuida'
                            placeholderTextColor={COLORS.black}
                            style={{
                                width: "100%"
                            }}
                        />
                    </View>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        marginVertical: 8
                    }}>Confirme a Nova Senha</Text>

                    <View style={{
                        width: "100%",
                        height: 40,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            onChangeText={setNewPassword}
                            value={newpassword}
                            placeholder='Defina uma senha simples e segura'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                    <View style={{
                        width: "100%",
                        height: 40,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            onChangeText={setNewPassword}
                            value={newpassword}
                            placeholder='Reintruza a nova Senha'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={isPasswordShown}
                            style={{
                                width: "100%"
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShown == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>
                <Button
                    title="Confirmar"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={upDatePass}
                />

           

               
                
 
        </SafeAreaView>
    )
}

export default PasswordComfirm