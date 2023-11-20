import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Button from '../components/Button';
import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { onValue, ref, set, get} from "firebase/database";
import {datab} from "../config1";


const Login = ({ navigation }) => {
    // Abra o banco de dados (você pode escolher qualquer nome)
    const db = SQLite.openDatabase('RentCarDespesaApp.db');
    const [isLoading, setIsLoading] = useState(true);
    const [telefone, setTelefone] = useState(null);
    const [novaSenha, setNovaSenha] = useState(null);
    const [novaSenha2, setNovaSenha2] = useState(null);
    const [dados, setDados] = useState([]);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [todoData, setTodoData] = useState([])
    const [sessao, setSessao] = useState([]);
    const sessionData = null;

    //Pegar os dados do RealTime FireBase
 const getData = () =>{

    if(sessionData === null){
        const getDatas = ref(datab, "Motoristas/");
        onValue(getDatas, (snapshot) =>{
            const data = snapshot.val();
            const newData = Object.keys(data).map(key => ({
                id:key,
                ...data[key]
            }));
            console.log("Dados do get "+newData)
            setTodoData(newData)
        })
    }
   
}

const pegarDadosSessao = () =>{
    db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
            [],
            (_, { rows }) => {
              if (rows.length > 0) {  
                const sessionData = rows.item(0);  
                setSessao(sessionData)
              //  console.log('Dados da sessão recuperados:', sessionData);
              } else {
                console.log('Nenhuma sessão encontrada.');
              }
            }
          );
        });       
     }
    
    useEffect(() => {
        getData();
        pegarDadosSessao()
    // Crie uma tabela para armazenar os dados da sessão (isto é um exemplo simples, você pode adaptá-lo conforme necessário)
        db.transaction((tx) => {
            tx.executeSql(
            'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario TEXT, senha TEXT, status TEXT, nome TEXT);',
            [],
            () => {
                console.log('Tabela de sessões criada com sucesso.');
            }
            );
        });
        setIsLoading(false)
      }, []);

      useFocusEffect(
        React.useCallback(() => {
            pegarDadosSessao();
            getData();
        },
         [])
      );
    
      const showToastErrorInvalid = () => {
        Toast.show({
          type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
          position: 'top', // Posição: 'top' ou 'bottom'
          text1: 'Senha ou Email invalidos',
          visibilityTime: 3000, // Duração em milissegundos
        });
     }

     const showToastErrorSenhas = () => {
        Toast.show({
          type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
          position: 'top', // Posição: 'top' ou 'bottom'
          text1: 'As senhas devem ser iguais',
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

        const showToastErrorSenha = () => {
            Toast.show({
              type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'As senhas devem ser iguais',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }

        const showToastErrorSenhaSemConexao = () => {
            Toast.show({
              type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'Tem que estar conectado a internet',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }

        const showToastErrorTelefone = () => {
            Toast.show({
              type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'Numero de telefone invalido',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }
        const showToastSuccess = () => {
            Toast.show({
              type: 'success', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'Senha alterada com sucesso',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }

      const validarLogin = async ()  => {
        pegarDadosSessao()
        if(telefone == null ||novaSenha == null ||novaSenha2 == null){
                    pegarDadosSessao()
            return(showToastError())
        }

        if(novaSenha !== novaSenha2){
            pegarDadosSessao()
            return(showToastErrorSenha())
        }

        //Logar online via FireBase
        if(!sessionData){
            const objetoEncontrado = todoData.find(objeto => objeto.Telefone === telefone);


            if(objetoEncontrado) {
                console.log("Inciando actualização da senha")
                try {
                    const chaveUnica = objetoEncontrado.id; // Use a coluna 'id' como chave única
                    const caminhoFilho = `Motoristas/${chaveUnica}`;
                    const motoristaRef = ref(datab, caminhoFilho);

                    const snapshot = await get(motoristaRef);

                    if (snapshot.exists()) {
                              // Atualize o campo 'Senha' para a nova senha
                              await set(motoristaRef, {Nome:snapshot.val().Nome, Senha: novaSenha , Status:snapshot.val().Status, Telefone:snapshot.val().Telefone, Usuario:snapshot.val().Usuario});             
                      }
                      showToastSuccess();
                    navigation.navigate('Login');
                    
                    console.log('Senha atualizada com sucesso no Realtime Database.');
                  } catch (error) {
                    console.error('Erro ao atualizar a senha no Realtime Database:', error);
                  }

                console.log("Fim da alteração da senha")
           }else{
            showToastErrorTelefone();
           }
              
        } else{
            showToastErrorSenhaSemConexao();
        }
     }


    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
                        Recupera a tua senha, e reconecte-se! 👋
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: COLORS.black
                    }}>Registe as tuas despesas hoje!</Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        marginVertical: 8
                    }}>Telefone</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            onChangeText={setTelefone}
                            value={telefone}
                            placeholder='Introduza o teu usuario'
                            placeholderTextColor={COLORS.black}
                            keyboardType='email-address'
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
                    }}>Nova Senha</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                         <TextInput
                            onChangeText={setNovaSenha}
                            value={novaSenha}
                            placeholder='Reintroduza a nova senha'
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

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        marginVertical: 8
                    }}>Confirmar Senha</Text>

                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
                        <TextInput
                            onChangeText={setNovaSenha2}
                            value={novaSenha2}
                            placeholder='Reintroduza a nova senha'
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
                    title="Entar"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={validarLogin}
                />


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                   

                   
                </View>

            </View>
        </SafeAreaView>
    )
}

export default Login