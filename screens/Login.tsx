import { View, Text, Image , Pressable, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Button from '../components/Button';
import * as SQLite from 'expo-sqlite';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { onValue, ref} from "firebase/database";
import {datab} from "../config1";


const Login = ({ navigation }) => {
    // Abra o banco de dados (você pode escolher qualquer nome)
    const db = SQLite.openDatabase('RentCarDespesaApp.db');
    const [isLoading, setIsLoading] = useState(true);
    const [newemail, SetNewEmail] = useState(null);
    const [newpassword, setNewPassword] = useState(null);
    const [dados, setDados] = useState([]);
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [todoData, setTodoData] = useState([])
    const [sessao, setSessao] = useState([]);
    const sessionData = null;
    const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

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

      if (isSpinnerVisible) {
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
    

      const showToastErrorInvalid = () => {
        Toast.show({
          type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
          position: 'top', // Posição: 'top' ou 'bottom'
          text1: 'Senha ou Email invalidos',
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

        const showToastErrorContaInactiva = () => {
            Toast.show({
              type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'A tua conta esta desactivada',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }

        const showToastErrorInternet = () => {
            Toast.show({
              type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'Estas sem internet!, conecte-se e volte a tentar',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }

        const showErrorFatal = () => {
            Toast.show({
              type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
              position: 'top', // Posição: 'top' ou 'bottom'
              text1: 'Contacte a serviSIS',
              visibilityTime: 3000, // Duração em milissegundos
            });
        }
        
      const validarLogin = ()=> {
        setIsSpinnerVisible(true);
        pegarDadosSessao()
            if(newemail == null || newpassword == null){
                        SetNewEmail(null);
                        setNewPassword(null);
                        pegarDadosSessao()
                        setIsSpinnerVisible(false);
                return(showToastError())
            }

            // Encontre o objeto no array com base na primeira string (nome)

            //Logar online via FireBase

                if(todoData === null){
                    setIsSpinnerVisible(false);
                    showToastErrorInternet();
                }
              
                try{
                    const objetoEncontrado = todoData.find(objeto => objeto.Usuario.toLowerCase() === newemail.toLowerCase());
                    if(objetoEncontrado) {
                        // Se o objeto foi encontrado, compare a segunda string (cor) com a propriedade do objeto
                        if(objetoEncontrado.Senha === newpassword) {
                            console.log(objetoEncontrado.Nome)
                                if(objetoEncontrado.Status === "Activo"){
                                            // Criar sessão na bd
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                        'INSERT INTO sessions (usuario, senha, status, nome) VALUES (?, ?, ?, ?);',
                                        [objetoEncontrado.Usuario, objetoEncontrado.Senha, objetoEncontrado.Status, objetoEncontrado.Nome],
                                        (_, { insertId }) => {
                                            console.log('Sessão inserida com sucesso, ID:', insertId);
                                        }
                                        );
                                        tx.executeSql(
                                            'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
                                            [],
                                            (_, { rows }) => {
                                            if (rows.length > 0) {  
                                                const sessionData = rows.item(0);  
                                                setSessao(sessionData)
                                            } else {
                                                console.log('Nenhuma sessão encontrada.');
                                            }
                                            }
                                        );
                                    });
                                    // ir para o home
                                    setIsSpinnerVisible(false);
                                    navigation.navigate('Home', {sessao});
                                return
                                }else{
                                    setIsSpinnerVisible(false);
                                    showToastErrorContaInactiva()
                                    console.log("A tua conta esta desactivada");
                                    console.log(todoData);
                                }
                            }else{
                                setIsSpinnerVisible(false);
                                showToastErrorInvalid()
                                console.log("senha errada");
                                console.log(todoData);
                            }
                        }else{
                            setIsSpinnerVisible(false);
                            showToastErrorInvalid()
                            console.log("Email errado offline");
                            console.log(todoData);    
                        }  
                } catch{
                    setIsSpinnerVisible(false);
                    showErrorFatal();
                    return
                } 
           
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
                        Ola, Bem Vindo ! 👋
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
                    }}>Usuario</Text>

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
                            onChangeText={SetNewEmail}
                            value={newemail}
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
                    }}>Senha</Text>

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
                            onChangeText={setNewPassword}
                            value={newpassword}
                            placeholder='Introduza a tua senha'
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
                    title="Entrar"
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

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Esqueceu a senha?/Quer alterar? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("RecuperarSenha")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.orange,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Clique aqui!</Text>
                    </Pressable>
                </View>
            </View>

       
        </SafeAreaView>
    )
}

export default Login