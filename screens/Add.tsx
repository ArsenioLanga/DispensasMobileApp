import { Text, View, TextInput, ScrollView, Image, Platform, TouchableOpacity, Pressable, Alert } from "react-native"
import { Picker, type PickerItem } from 'react-native-woodpicker'
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Camera, CameraType } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { RadioButton } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { theme } from "../Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import Button from '../components/Button';
import NetInfo from "@react-native-community/netinfo";
import { AntDesign } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';


export const Add = ({ navigation }) => {
      // Abra o banco de dados (você pode escolher qualquer nome)
      const db = SQLite.openDatabase('RentCarDespesaApp.db');

      const [isViewVisible, setIsViewVisible] = useState(true);
      const [isView1Visible, setIsView1Visible] = useState(false);
      const [isView2Visible, setIsView2Visible] = useState(false);

      const [showCamera, setShowCamera] = useState(true);
      const [photoUri, setPhotoUri] = useState(null);
      const [isPhotoValid, setIsPhotoValid] = useState(false);
      const [cameraRef, setCameraRef] = useState(null);
      const [type, setType] = useState(CameraType.back);

      const [isLoading, setIsLoading] = useState(true);
      const [categorias, setCategorias] = useState([]);
      const [viaturas, setViaturas] = useState([]);
      const [despesas, setDespesas] = useState([]);
      const [datas, setDatas] = useState(new Date())
      const [showPicker, setShowPicker] = useState(false)
      const [permissionsGranted, setPermissionsGranted] = useState(false);



      const [foto, setFoto] = useState(null);
      const [uriToUpload, setUriToUpload] = useState(null);
      const [id, setId] = useState(null);
      const [fotoId, setFotoId] = useState("");
      const [sessao, setSessao] = useState(null);
      const [motorista, setMotorista] = useState(null); 
      const [local, setLocal] = useState(null);
      const [randonId, setRandon] = useState(null);
      const [tipoDespesa, setTipodespesa] = useState(null);
      const [dataDoc, setDataDoc] = useState(null);
      const [dataNow, setDataNow] = useState(null);
      const [nrdoc, setNrdoc] = useState(null);
      const [total, SetTotal] = useState(null);
      const [dataHoraAtual, setDataHoraAtual] = useState('');
      const [quantidade, setQuantidade] = useState(null);
      const [viatura, setViatura] = useState(null);
      const [pickedDataD, setPickedDataD] = useState<PickerItem>();
      const [pickedDataV, setPickedDataV] = useState<PickerItem>();
      const [observacao, setOberservacao] = useState(null)
      const [tipoCombustivel, setTipoCombustivel] = useState("indefinido");
      const [teste, setTeste] = useState(null);
      const [urlresult, setUrlresult] = useState(null);
      const [url, setUrl] = useState(null)
      const precoUnitario = total/quantidade;
      const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

      const data: Array<PickerItem> = [
            { label: "Selecione a despesa", value: 1 },
            { label: "Combustivel", value: 2 },
            { label: "Parqueamento", value: 3 },
            { label: "Portagem", value: 4 },
            { label: "Lavagem", value: 5 },
            { label: "Reboque", value: 6 },
            { label: "Outro", value: 7 }
      ];

      const provincias: Array<PickerItem> = [
            { label: "Selecione a Provincia", value: 1 }, 
            { label: "Maputo", value: 2 },
            { label: "Gaza", value: 3 },
            { label: "Inhambane", value: 4 },
            { label: "Manica", value: 5 },
            { label: "Sofala", value: 6 },
            { label: "Tete", value: 7 },
            { label: "Zambezia", value: 8 },
            { label: "Nampula", value: 9 },
            { label: "Cabo Delgado", value: 10 },
            { label: "Niassa", value: 11 }
      ];

           
    
      const getDespesa = () => {
            try {
                  db.transaction(tx => {
                        tx.executeSql(
                              "SELECT * FROM despesaMotoristas",
                              [],
                              (_, resultSet) => {
                                    // Processar os resultados da consulta
                                    const rows = resultSet.rows;
                                    //const despesa = [];

                                    for (let i = 0; i < rows.length; i++) {
                                          const item = rows.item(i);

                                          // Recuperar os valores das colunas do resultado
                                          const id = item.id;
                                          const idFoto = item.idFoto;
                                          const local = item.local;
                                          const viatura = item.viatura;
                                          const url = item.url;
                                          const nrDoc = item.nrDoc;
                                          const tipoDespesa = item.tipoDespesa;
                                          const valorDespesa = item.valorDespesa;
                                          const qtdDespesa = item.qtdDespesa;
                                          const total = item.total;
                                          const motorista = item.motorista;
                                          const status = item.status;
                                          const dataDoc = item.dataDoc;
                                          const observacao = item.observacao;
                                          const TipoCombustivel = item.TipoCombustivel;
                                          const created_at = item.created_at;
                                          const updated_at= item.updated_at;
                                          const random = item.random;

                                          // Adicionar os valores ao array de despesas
                                          despesas.push({
                                                id: id,
                                                idFoto: idFoto,
                                                local: local,
                                                url: url,
                                                viatura: viatura,
                                                nrDoc: nrDoc,
                                                tipoDespesa: tipoDespesa,
                                                valorDespesa: valorDespesa,
                                                qtdDespesa: qtdDespesa,
                                                total: total,
                                                motorista: motorista,
                                                status: status,
                                                dataDoc: dataDoc,
                                                observacao: observacao,
                                                TipoCombustivel: TipoCombustivel,
                                                random: random,
                                                created_at: created_at,
                                                updated_at: updated_at
                                          });
                                    }
                                    // Agora, 'despesas' contém os dados lidos da tabela
                                    console.log('Dados lidos da tabela despesaMotoristas:', despesas);
                              },
                              (_, error) => {
                                    console.log('Erro ao executar consulta SQL:', error);
                              }
                        );
                  });
            } catch (error) {
                  console.log('Erro durante a leitura da tabela:', error);
            }

      }

      const showToast = () => {
            Toast.show({
                  type: 'success', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Registado de sucesso',
                  visibilityTime: 5000,
            });
      }

      const showToastValidMatricula = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Matricula Invalida',
                  visibilityTime: 5000,
            });
      }

      const showToastValidTextField = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Preencha todos os campos',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }

      const showToastValidData = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Não pode definir uma data futura',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }

      const showToastValidQuantidade = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Quantidade invalida!',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }

      const showToastValidTotal = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Total invalido!',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }

      const showToastPermission = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Permissão recusada!!',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }

      const showToastSalvar = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Erro ao salvar!!',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }
      const showToastValidTipoCombustivel = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Selecione o tipo de combustivel',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }

      const showToastValidRepetir = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Esta despesa ja foi registada',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }
      const showToastLocal = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Selecione um local valido',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }
      const showToastDespesa = () => {
            Toast.show({
                  type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
                  position: 'top', // Posição: 'top' ou 'bottom'
                  text1: 'Selecione uma despesa valida',
                  visibilityTime: 3000, // Duração em milissegundos
            });
      }

      const pegarDadosSessao = () => {
            db.transaction((tx) => {
                  tx.executeSql(
                        'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
                        [],
                        (_, { rows }) => {
                              if (rows.length > 0) {
                                    const sessionData = rows.item(0);
                                    setSessao(sessionData)
                                    setMotorista(sessionData.nome)
                                    console.log('Dados da sessão add:', sessao);
                              } else {
                                    console.log('Nenhuma sessão encontrada.');
                              }
                        }
                  );
            });

      }
  
      const handlePlateNumberChange = (text) => {
            // Remova caracteres não alfabéticos e limite o comprimento da placa
            const formattedPlate = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        
            // Garanta que a parte alfabética tenha no máximo 3 caracteres
            const alphaPart = formattedPlate.substring(0, 3).replace(/[^A-Za-z]/g, '');
        
            // Garanta que a parte numérica tenha no máximo 3 números
            const numericPart = formattedPlate.substring(3, 6).replace(/[^0-9]/g, '');
        
            // Garanta que a parte alfabética final tenha no máximo 2 caracteres, excluindo números
            const alphaPartEnd = formattedPlate.substring(6, 8).replace(/[^A-Za-z]/g, '');
        
            // Crie a placa formatada
            const plate = `${alphaPart}-${numericPart}-${alphaPartEnd}`;
        
            // Limita o comprimento total da placa para 10 caracteres (AAA-123-AA)
            setViatura(plate);
        };
        
      useEffect(() => {
            pegarDadosSessao();
      }, []);

      useEffect(() => {

            (async () => {
                  const { status } = await Camera.requestCameraPermissionsAsync();
                  if (status === 'granted') {
                        setShowCamera(true);
                  }
            })();

            console.log(showCamera)

            db.transaction(tx => {
                  tx.executeSql("CREATE TABLE IF NOT EXISTS despesaMotoristas (id INTEGER PRIMARY KEY AUTOINCREMENT, idFoto TEXT, local TEXT, url TEXT, viatura TEXT, nrDoc TEXT, tipoDespesa TEXT, valorDespesa TEXT, qtdDespesa TEXT, total TEXT, motorista TEXT, status TEXT,dataDoc TEXT, observacao Text, TipoCombustivel Text, motivo TEXT, random TEXT, created_at TEXT, updated_at TEXT)");
                });


            db.transaction(tx => {
                  tx.executeSql("SELECT * FROM tipo_despesas", null,
                        (txObj, resultSet) => setCategorias(resultSet.rows._array),
                        (txObj, error) => false
                  );
            });
            db.transaction((tx) => {
                  tx.executeSql(
                        'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
                        [],
                        (_, { rows }) => {
                              if (rows.length > 0) {
                                    const sessionData = rows.item(0);
                                    setSessao(sessionData.nome)
                                    console.log('Dados da sessão recuperados:', sessao);
                              } else {
                                    console.log('Nenhuma sessão encontrada.');
                              }
                        }
                  );

            });
            // Função para obter a data e hora atual
            const dataHoraAtual = moment().format('MM/DD/YYYY HH:mm');
            setDataHoraAtual(dataHoraAtual);
            setIsLoading(false)
            setIsViewVisible(true);
            setIsView1Visible(false);
            pegarDadosSessao();
            getDespesa();
      }, []);

      useFocusEffect(
            React.useCallback(() => {
                 
                  (async () => {
                        const { status } = await Camera.requestCameraPermissionsAsync();
                        if (status === 'granted') {
                              setShowCamera(true);
                        }
                  })();

                  pegarDadosSessao();
                  getDespesa();

                  db.transaction(tx => {
                        tx.executeSql("CREATE TABLE IF NOT EXISTS despesaMotoristas (id INTEGER PRIMARY KEY AUTOINCREMENT, idFoto TEXT, local TEXT, url TEXT, viatura TEXT, nrDoc TEXT, tipoDespesa TEXT, valorDespesa TEXT, qtdDespesa TEXT, total TEXT, motorista TEXT, status TEXT,dataDoc TEXT, observacao Text, TipoCombustivel Text, motivo TEXT, random TEXT, created_at TEXT, updated_at TEXT)");
                      });
                  db.transaction(tx => {
                        tx.executeSql("SELECT * FROM tipo_despesas", null,
                              (txObj, resultSet) => setCategorias(resultSet.rows._array),
                              (txObj, error) => false
                        );
                  });


                  db.transaction((tx) => {
                        tx.executeSql(
                              'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
                              [],
                              (_, { rows }) => {
                                    if (rows.length > 0) {
                                          const sessionData = rows.item(0);
                                          setSessao(sessionData.nome)
                                          console.log('Dados da sessão recuperados:', sessao);
                                    } else {
                                          console.log('Nenhuma sessão encontrada.');
                                    }
                              }
                        );
                  });

                  // Função para obter a data e hora atual
                  const dataHoraAtual = moment().format('MM/DD/YYYY HH:mm:ss');
                  setDataHoraAtual(dataHoraAtual);
                  setIsLoading(false)
                  setIsViewVisible(true);
                  setIsView1Visible(false);
                  pegarDadosSessao();
            }, [])
      );

      if (isLoading) {
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

      const toggleDatePicker = () => {
            setShowPicker(!showPicker)
      }

      const toggleViewPhoto = () => {
            setIsViewVisible(!isViewVisible);
            // validateImage(photoUri)
            toggleViewMain();
            const getPhotoAfterSave = savePhotoToLibrary(photoUri)
            setFotoId(String(getPhotoAfterSave));
            setId(getPhotoAfterSave);
            console.log('Foto salva na galeria' + fotoId);
      };

      const toggleViewMain = () => {
            setIsView1Visible(!isView1Visible);
      };

      const toggleTipoCombustivel = () => {
            setIsView2Visible(!isView2Visible);
      };
      const onChange = ({ type }, selectedDate) => {
            if (type == "set") {
                  const currentDate = selectedDate;
                  setDatas(currentDate)
                  if (Platform.OS === "android") {
                        toggleDatePicker();
                        setDataDoc(currentDate.toDateString())
                        setDataNow(currentDate.toDateString())
                  }
            } else {
                  toggleDatePicker();
            }
      }
      // const savePhotoToLibrary = async (photoUri) =>  {
      //       if (!permissionsGranted) {
      //             const { status } = await MediaLibrary.requestPermissionsAsync();
      //             if (status === 'granted') {
      //               setPermissionsGranted(true);
      //             } else {
      //               showToastPermission()
      //               return null;
      //             }
      //           }    
      //           try {
      //             const asset = await MediaLibrary.createAssetAsync(photoUri);
      //             console.log('Foto salva na biblioteca de mídia com ID:', asset.id);
      //             setId(asset.id);
      //             setFotoId(asset.id);
      //             return asset.id || null;
      //           } catch (error) {
      //             showToastSalvar()
      //             return null;
      //           }
      //     }


      const savePhotoToLibrary = async (photoUri) => {
            if (!permissionsGranted) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                  setPermissionsGranted(true);
            } else {
                  console.log('Permissão para acessar a biblioteca de mídia não concedida.');
                  return null;
            }
            }

            try {
            // Comprimir a imagem antes de salvar
            const compressedImage = await compressImage(photoUri);
            
            // Salvar a imagem comprimida na biblioteca de mídia
            const asset = await MediaLibrary.createAssetAsync(compressedImage.uri);
            
            console.log('Foto salva na biblioteca de mídia com ID:', asset.id);
            setId(asset.id);
            setFotoId(asset.id);
            return asset.id || null;
            } catch (error) {
            console.log('Erro ao salvar a foto na biblioteca de mídia:', error);
            return null;
            }
      };

      const compressImage = async (photoUri) => {
      const compressedImage = await ImageManipulator.manipulateAsync(
      photoUri,
      [{ resize: { width: 800, height: 800 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );

      return compressedImage;
      };


      const takePicture = async () => {
            if (cameraRef) {
                  const photo = await cameraRef.takePictureAsync();
                  setPhotoUri(photo.uri);
                  setIsPhotoValid(false);
                  setShowCamera(false);
            }
      };

      function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomString = '';
          
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              randomString += characters.charAt(randomIndex);
            }
          
            return randomString;
          }

          function generateRandomString2(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomString = '';
          
            for (let i = 0; i < length; i++) {
              const randomIndex = Math.floor(Math.random() * characters.length);
              randomString += characters.charAt(randomIndex);
            }
          
            return randomString;
          }
   
      const addDespesa = async () => {
            setIsSpinnerVisible(true);
            if (local === null || nrdoc === null || viatura === null || quantidade === null || tipoDespesa === null || total === null || dataDoc === null) {
                  setIsSpinnerVisible(false);
                  showToastValidTextField();
                  return
                 } else {
      
                  if(viatura.length < 10){
                        setIsSpinnerVisible(false);
                        showToastValidMatricula();  
                        return
                  }
      
                  
                  if(tipoDespesa === "Combustivel"){
                        if(tipoCombustivel === null){
                              setIsSpinnerVisible(false);
                              showToastValidTipoCombustivel()
                              return
                        }  
                  }
      
                  if(local === "Selecione a Provincia"){
                        setIsSpinnerVisible(false);
                        showToastLocal()
                        return
                  }
                  if(tipoDespesa === "Selecione a despesa"){
                        setIsSpinnerVisible(false);
                       showToastDespesa();
                       return
                  }
      
      
      
                 //VERIFICAR A A QUANTIDADE É IGUAL OU TEM LETRAS
                 var regex = /^[0-9]+(\.[0-9]+)?$/;
                  if (!regex.test(quantidade) ) {
                        if(quantidade < 1){
                              setIsSpinnerVisible(false);
                           showToastValidQuantidade()
                           return
                        }
                        setIsSpinnerVisible(false);
                        showToastValidQuantidade()
                        return
                  }
      
                  if(total < 1){
                        setIsSpinnerVisible(false);
                        showToastValidTotal()
                        return
                       }
                       
                  if(quantidade < 1){
                        setIsSpinnerVisible(false);
                        showToastValidQuantidade()
                        return
                       }
      
                       var regex = /^[0-9]+(\.[0-9]+)?$/;
                  if (!regex.test(total) ) {
                        if(total < 1){
                              setIsSpinnerVisible(false);
                           showToastValidTotal()
                           return
                        }
                        setIsSpinnerVisible(false);
                        showToastValidTotal()
                        return
                  }
      
                  const valorDespesa = (total/quantidade).toFixed(2);
                  const estado = "Pendente";
                  const created_at = dataHoraAtual; 
                  const updated_at = dataHoraAtual;
                  console.log("Motorista logado " + motorista)
                  let contagem = 0;
                  let total2 = total+".0"
                  const motivo = "null"
                  let randonId = generateRandomString(6);
                 // randonId += generateRandomString2(4);
                  randonId += fotoId;
      
                  // Converter as datas para objetos Moment
                  const dataNowObj = moment(dataNow, "ddd MMM DD YYYY");
                  const createdAtObj = moment(created_at, "MM/DD/YYYY HH:mm:ss");
                  
                  // Comparar as datas
                  if (dataNowObj.isAfter(createdAtObj)) {
                        setIsSpinnerVisible(false);
                        showToastValidData();
                        return
                      } 
               
                  // Iterar pelos objetos e verificar se a despesa ja foi registada
                  despesas.forEach(objeto => {
                        // if (objeto.dataDoc === dataDoc && objeto.nrDoc === nrdoc && objeto.total === total2) {
                        
                        if (objeto.dataDoc === dataDoc && objeto.nrDoc === nrdoc && objeto.total === total) {
                         contagem++;
                        }
                  });
      
                  if (contagem >= 1) {
                        setIsSpinnerVisible(false);
                        showToastValidRepetir()
                        return
                      } else {
                       try {
                        db.transaction(
                              (tx) => {
                                    tx.executeSql(
                                          "INSERT INTO despesaMotoristas (idFoto, local, url , viatura, nrDoc, tipoDespesa, valorDespesa, qtdDespesa, total, motorista, status, dataDoc, observacao, tipoCombustivel, motivo, random, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                          [
                                                fotoId,
                                                local,
                                                url,
                                                viatura,
                                                nrdoc,
                                                tipoDespesa,
                                                valorDespesa,
                                                quantidade,
                                                total,
                                                motorista,
                                                estado,
                                                dataDoc,
                                                observacao,
                                                tipoCombustivel,
                                                motivo,
                                                randonId,
                                                created_at,
                                                updated_at
                                          ],
                                          (_, resultSet) => {
                                                if (resultSet.rowsAffected > 0) {
                                                      let existingNames = [...despesas];
                                                      existingNames.push({
                                                            //id: resultSet.rows._array,
                                                            id: resultSet.insertId, // Usar insertId para obter o ID inserido
                                                            idFoto: fotoId,
                                                            local: local,
                                                            url: url,
                                                            viatura: viatura,
                                                            nrDoc: nrdoc,
                                                            tipoDespesa: tipoDespesa,
                                                            valorDespesa: valorDespesa,
                                                            qtdDespesa: quantidade,
                                                            total: total,
                                                            motorista: motorista,
                                                            status: estado,
                                                            dataDoc: dataDoc,
                                                            observacao: observacao,
                                                            tipoCombustivel: tipoCombustivel,
                                                            motivo:motivo,
                                                            randon:randonId,
                                                            created_at: created_at,
                                                            updated_at:updated_at
                                                      });
                                                      setDespesas(existingNames);
                                                      setFotoId(null);
                                                      setLocal(null);
                                                      setDataDoc(null);
                                                      setViatura(null);
                                                      setNrdoc(null);
                                                      setTipodespesa(null);
                                                      SetTotal(null);
                                                      setUrl(null);
                                                      setQuantidade(null);
                                                      setOberservacao(null);
                                                      setTipoCombustivel(null);
                                                      setRandon(null);
                                                      setIsView2Visible(false);
                                                      showToast();
                                                      setIsSpinnerVisible(false);
                                                      navigation.navigate('Despesas');
                                                } else {
                                                      setIsSpinnerVisible(false);
                                                      console.log('Nenhum dado inserido');
                                                }
                                          }
                                    );
                              },
                              (error) => {
                                    setIsSpinnerVisible(false);
                                    console.log('Erro na transação SQL: ', error);
                              }
                        );
                        console.log('fim');
                        } catch (error) {
                              setIsSpinnerVisible(false);
                              console.log('Falha ao gravar: ' + error);
                        }
                     }
                 }
      };

      return (
            <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
            }}>
                  {showCamera ? (
                        <Camera
                              style={{
                                    flex: 1,
                                    width: '100%',
                              }}
                              type={type}
                              ref={(ref) => setCameraRef(ref)}
                        >
                              <View style={{
                                    backgroundColor: "transparent",
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',  
                              }}>
                                    <TouchableOpacity onPress={takePicture} style={{
                                          width: '-25%',  
                                          marginTop: '80%', 
                                    }}>
                                          <MaterialIcons name="photo-camera" size={44} color={COLORS.orange2} />
                                    </TouchableOpacity>
                              </View>
                        </Camera>
                  ) : (
                        <>

                              <View>

                                    {isViewVisible && (

                                          <View style={{marginBottom: 50}}>

                                                {photoUri && (
                                                      <Image source={{ uri: photoUri }} style={{
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            width: 260,
                                                            height: 400,
                                                            marginVertical: 20,
                                                      
                                                      }} />
                                                )}
                                                {isPhotoValid && (

                                                      <Text style={{
                                                            fontSize: 16,
                                                            color: 'green',
                                                            marginTop: 10,
                                                      }}>Foto válida!</Text>


                                                )}
                                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                                                      <AntDesign onPress={toggleViewPhoto}  name="checkcircleo" size={34} color={COLORS.orange} />
                                                      <MaterialIcons onPress={() => { setPhotoUri(null); setShowCamera(true); }} name="add-a-photo" size={34} color={COLORS.orange} />
                                                </View>

                                          </View>

                                    )}
                              </View>
                              {isView1Visible && (
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, marginTop: 5 }}>

                                                <View style={{ flex: 1, marginHorizontal: 22 }}>


                                                <View style={{ marginBottom: 4 }}>
                                                            <Text style={{
                                                                  fontSize: 16,
                                                                  marginVertical: 6
                                                            }}>Local</Text>

                                                            <View style={{
                                                                  width: "100%",
                                                                  height: 38,
                                                                  borderColor: COLORS.black,
                                                                  borderWidth: 1,
                                                                  borderRadius: 8,
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                            }}>
                                                                  <>
                                                                        <Picker
                                                                              item={pickedDataV}
                                                                              items={provincias}
                                                                              onItemChange={(itemValue) => {
                                                                                    setLocal(itemValue.label);
                                                                              }}
                                                                              placeholder=""
                                                                              isNullable={false}
                                                                              style={{
                                                                                    minWidth: "100%",
                                                                                    height: 40,
                                                                                    width: "100%",
                                                                                    flex: 1,
                                                                                    backgroundColor: COLORS.orange,
                                                                                    borderRadius: 8,
                                                                                    borderColor: theme.colors.border,
                                                                                    paddingLeft: 20,
                                                                              }}
                                                                        />

                                                                  </>

                                                            </View>
                                                      </View>

                                                      <View style={{ marginBottom: 4 }}>
                                                            <Text style={{
                                                                  fontSize: 16,
                                                                  marginVertical: 6
                                                            }}>Nº do Documento</Text>

                                                            <View style={{
                                                                  width: "100%",
                                                                  height: 38,
                                                                  borderColor: COLORS.black,
                                                                  borderWidth: 1,
                                                                  borderRadius: 8,
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  paddingLeft: 22,

                                                            }}>
                                                                  <TextInput
                                                                        onChangeText={setNrdoc}
                                                                        value={nrdoc}
                                                                        placeholder='Numero do documento'
                                                                        placeholderTextColor={COLORS.black}
                                                                        keyboardType='email-address'
                                                                        style={{
                                                                              width: "100%",

                                                                        }}
                                                                  />
                                                            </View>
                                                      </View>

                                                      <View style={{ marginBottom: 8 }}>
                                                            <Text style={{
                                                                  fontSize: 16,
                                                                  marginVertical: 8
                                                            }}>Data do Documento</Text>

                                                            <View style={{
                                                                  width: "100%",
                                                                  height: 38,
                                                                  borderColor: COLORS.black,
                                                                  borderWidth: 1,
                                                                  borderRadius: 8,
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  backgroundColor: COLORS.orange
                                                            }}>
                                                                  {showPicker && (
                                                                        <DateTimePicker mode="date" display="spinner" value={datas} onChange={onChange} />
                                                                  )}
                                                                  {!showPicker && (
                                                                        <Pressable
                                                                              onPress={toggleDatePicker}
                                                                        >
                                                                              <TextInput
                                                                                    placeholder="Selecione a data do documento"
                                                                                    value={dataDoc}
                                                                                    placeholderTextColor={COLORS.black}
                                                                                    onChangeText={setDataDoc}
                                                                                    editable={false}
                                                                                    style={{
                                                                                          textAlign: "left",
                                                                                          justifyContent: "flex-start",
                                                                                          color: "black"
                                                                                    }}
                                                                              />
                                                                        </Pressable>
                                                                  )}
                                                            </View>
                                                      </View>
                                                      <View style={{ marginBottom: 4 }}>
                                                            <Text style={{
                                                                  fontSize: 16,
                                                                  marginVertical: 2
                                                            }}>Viatura</Text>
                                                            <View style={{
                                                                  width: "100%",
                                                                  height: 38,
                                                                  borderColor: COLORS.black,
                                                                  borderWidth: 1,
                                                                  borderRadius: 8,
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  paddingLeft: 22,

                                                            }}>
                                                                  <TextInput
                                                                        onChangeText={handlePlateNumberChange}
                                                                        value={viatura}
                                                                        placeholder='Introduza a matricula da viatura'
                                                                        placeholderTextColor={COLORS.black}
                                                                        keyboardType='email-address'
                                                                        style={{
                                                                              width: "100%",

                                                                        }}
                                                                  />
                                                            </View>
                                                      </View>

                                                      <View style={{ marginBottom: 4 }}>
                                                            <Text style={{
                                                                  fontSize: 16,
                                                                  marginVertical: 6
                                                            }}>Tipo de despesa</Text>

                                                            <View style={{
                                                                  width: "100%",
                                                                  height: 38,
                                                                  borderColor: COLORS.black,
                                                                  borderWidth: 1,
                                                                  borderRadius: 8,
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                            }}>
                                                                  <>
                                                                        <Picker
                                                                              item={pickedDataD}
                                                                              items={data}
                                                                              onItemChange={(itemValue) => {
                                                                                    if (itemValue.label === "Combustivel") {
                                                                                          toggleTipoCombustivel();
                                                                                    }
                                                                                    if (itemValue.label !== "Combustivel") {
                                                                                          setIsView2Visible(false); 
                                                                                    }
                                                                                    setQuantidade(null);
                                                                                    SetTotal(null);
                                                                                    setTipoCombustivel(null)
                                                                                    setOberservacao(null);
                                                                                    setTipodespesa(itemValue.label);

                                                                                    
                                                                              }}
                                                                              placeholder=""
                                                                              isNullable={false}
                                                                              style={{
                                                                                    minWidth: "100%",
                                                                                    height: 40,
                                                                                    width: "100%",
                                                                                    flex: 1,
                                                                                    backgroundColor: COLORS.orange,
                                                                                    borderRadius: 8,
                                                                                    borderColor: theme.colors.border,
                                                                                    paddingLeft: 20,
                                                                              }}
                                                                        />

                                                                  </>

                                                            </View>
                                                      </View>
                                                      <View style={{ marginBottom: 4 }}>
                                                            {isView2Visible && (
                                                                  <View style={{ display: "flex", flexDirection: "row" }}>

                                                                        <View style={{
                                                                              width: "100%",
                                                                              height: 38,
                                                                              borderColor: COLORS.black,
                                                                              borderWidth: 1,
                                                                              borderRadius: 8,
                                                                              alignItems: "center",
                                                                              justifyContent: "center",
                                                                              paddingLeft: 6,
                                                                              marginLeft: 0,


                                                                        }}>
                                                                              <View style={{
                                                                                    flex: 1,
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center',
                                                                              }}>
                                                                                    <View style={{
                                                                                          flexDirection: 'row', // Alinhe os RadioButtons horizontalmente
                                                                                          alignItems: 'center', // Alinhe verticalmente os elementos
                                                                                    }}>
                                                                                          <RadioButton.Item
                                                                                                label="Gasolina"
                                                                                                value="Gasolina"
                                                                                                status={tipoCombustivel === 'Gasolina' ? 'checked' : 'unchecked'}
                                                                                                onPress={() => setTipoCombustivel('Gasolina')}
                                                                                          />
                                                                                          <RadioButton.Item
                                                                                                label="Gasoleo"
                                                                                                value="Gasoleo"
                                                                                                status={tipoCombustivel === 'Gasoleo' ? 'checked' : 'unchecked'}
                                                                                                onPress={() => setTipoCombustivel('Gasoleo')}
                                                                                          />
                                                                                    </View>
                                                                              </View>
                                                                        </View>
                                                                  </View>
                                                            )}
                                                            <View style={{ display: "flex", flexDirection: "row", marginTop: 8 }}>
                                                                  <View style={{
                                                                        width: "48%",
                                                                        height: 38,
                                                                        borderColor: COLORS.black,
                                                                        borderWidth: 1,
                                                                        borderRadius: 8,
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        paddingLeft: 22
                                                                  }}>
                                                                        <TextInput
                                                                              onChangeText={setQuantidade}
                                                                              value={quantidade}
                                                                              placeholder='Quantidade'
                                                                              placeholderTextColor={COLORS.black}
                                                                              keyboardType='numeric'
                                                                              style={{
                                                                                    width: "100%"
                                                                              }}
                                                                        />
                                                                  </View>
                                                                  <View style={{
                                                                        width: "48%",
                                                                        height: 38,
                                                                        borderColor: COLORS.black,
                                                                        borderWidth: 1,
                                                                        borderRadius: 8,
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                        paddingLeft: 22,
                                                                        marginLeft: 12,


                                                                  }}>
                                                                        <TextInput
                                                                              onChangeText={SetTotal}
                                                                              value={total}
                                                                              placeholder='Total Pago'
                                                                              placeholderTextColor={COLORS.black}
                                                                              keyboardType='numeric'
                                                                              style={{
                                                                                    width: "100%"
                                                                              }}
                                                                        />
                                                                  </View>
                                                            </View>
                                                      </View>
                                                      <View style={{ marginBottom: 4 }}>
                                                            <Text style={{
                                                                  fontSize: 16,
                                                                  marginVertical: 6
                                                            }}>Observação</Text>
                                                            <View style={{
                                                                  width: "100%",
                                                                  height: 38,
                                                                  borderColor: COLORS.black,
                                                                  borderWidth: 1,
                                                                  borderRadius: 8,
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  paddingLeft: 22,

                                                            }}>
                                                                  <TextInput
                                                                        onChangeText={setOberservacao}
                                                                        value={observacao}
                                                                        placeholder='Observação(Opcional)'
                                                                        placeholderTextColor={COLORS.black}
                                                                        keyboardType='email-address'
                                                                        multiline={true}
                                                                        numberOfLines={10}
                                                                        style={{
                                                                              width: "100%",
                                                                        }}
                                                                  />
                                                            </View>
                                                      </View>
                                                      <Text style={{textAlign:"center", fontWeight:"bold", color: COLORS.orange}}>Preço Unitário: {precoUnitario.toFixed(2) === "NaN" ? "0" : precoUnitario.toFixed(2)} MT</Text>
                                                      <Button
                                                            title="Gravar"
                                                            filled
                                                            style={{
                                                                  marginTop: 8,
                                                                  marginBottom: 4,
                                                            }}
                                                            onPress={addDespesa}
                                                      />
                                                </View>
                                          </SafeAreaView>
                                    </ScrollView>
                              )}
                        </>
                  )}
            </View>

      )

}

