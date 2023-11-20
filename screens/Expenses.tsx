import { Text, View } from "react-native"
import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, ScrollView, Platform, Image, Pressable, TouchableOpacity } from 'react-native';
import COLORS from '../constants/colors';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import { theme } from "../Theme";
import { useFocusEffect } from '@react-navigation/native';
import Button from "../components/Button";
import { firebase } from "../config";
import NetInfo from "@react-native-community/netinfo";
import { onValue, ref, set, get } from "firebase/database";
import { datab } from "../config1";
import * as MediaLibrary from 'expo-media-library';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Camera, CameraType } from 'expo-camera';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Picker, type PickerItem } from 'react-native-woodpicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import moment from 'moment';


export const Expenses = ({ route }) => {
  const { sessao } = route.params;

  // Abra o banco de dados (você pode escolher qualquer nome)
  const db = SQLite.openDatabase('RentCarDespesaApp.db');

  const [isLoading, setIsLoading] = useState(true);
  const [currenteName, SetCurrentName] = useState(null);
  const [despesas, setDespesas] = useState([]);
  const [despesaCarregar, setDespesasCarregar] = useState([]);
  const [desp, setDesp] = useState({});
  const [despesasMotorista, setDespesaMotorista] = useState([]);
  const [nome, setNome] = useState([]);
  const sessionData = null;
  const [fotoId, setFotoId] = useState("");
  const [id, setId] = useState(null);
  const [idDespesa, setIdDespesa] = useState(null);
  const [despesaUpdate, setDespesaUpdate] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  const [totalGastos, setTotalGastos] = useState(0);
  const consultaSQL = 'SELECT SUM(total)  as totalGastos FROM despesaMotoristas';

  const [showCamera, setShowCamera] = useState(false);
  const [isViewVisible, setIsViewVisible] = useState(false);
  const [isViewVisible1, setIsViewVisible1] = useState(true);
  const [isView2Visible, setIsView2Visible] = useState(false);
  const [isViewVisibleData, setIsViewVisibleData] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [dataNow, setDataNow] = useState(null);
  const [isPhotoValid, setIsPhotoValid] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(CameraType.back);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedExpenseType, setSelectedExpenseType] = useState(null);

  const [pickedDataD, setPickedDataD] = useState<PickerItem>();
  const [pickedDataV, setPickedDataV] = useState<PickerItem>();

  
  const [motorista, setMotorista] = useState(null);
  const [local, setLocal] = useState(null);
  const [tipoDespesa, setTipodespesa] = useState(null);
  const [dataDoc, setDataDoc] = useState(null);
  const [nrdoc, setNrdoc] = useState(null);
  const [total, setTotal] = useState(null);
  const [dataHoraAtual, setDataHoraAtual] = useState('');
  const [quantidade, setQuantidade] = useState(null);
  const [showPicker, setShowPicker] = useState(false)
  const [datas, setDatas] = useState(new Date())
  const [viatura, setViatura] = useState(null);
  const [observacao, setOberservacao] = useState(null)
  const [tipoCombustivel, setTipoCombustivel] = useState(null);
  const precoUnitario = total/quantidade;
  const [url, setUrl] = useState(null)
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);


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

  const data: Array<PickerItem> = [
    { label: "Selecione a despesa", value: 1 },
    { label: "Combustivel", value: 2 },
    { label: "Parqueamento", value: 3 },
    { label: "Portagem", value: 4 },
    { label: "Lavagem", value: 5 },
    { label: "Reboque", value: 6 },
    { label: "Outro", value: 7 }
  ];



  const toggleDatePicker = () => {
    setShowPicker(!showPicker)
  }
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

  const filtered = () => {
    setActiveFilter('all');
    setDespesas(null);
    db.transaction(tx => {
      let query = "SELECT * FROM despesaMotoristas WHERE 1 = 1"; // Query inicial

      if (selectedMonth) {
        query += ` AND strftime('%m', dataDoc) = '${selectedMonth}'`; // Filtrar por mês
      }
      if (selectedExpenseType) {
        query += ` AND tipoDespesa = '${selectedExpenseType}'`; // Filtrar por tipo de despesa
      }

      query += " ORDER BY created_at DESC"; // Adicionar cláusula ORDER BY

      tx.executeSql(query, [], (_, { rows }) => {
        setDespesaMotorista(rows._array);
      });
    });
  };

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

  // Pegar dados da sessao
  const handleTabFocus = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM sessions ORDER BY id DESC LIMIT 1;',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            const sessionData = rows.item(0);
            SetCurrentName(sessionData.nome); // Atualize o estado do nome da sessão
            //setSessao(sessionData);
            console.log(sessionData.nome); // Acesse o nome diretamente aqui
            console.log('Dados da sessão recuperados:', sessionData);
          } else {
            console.log('Nenhuma sessão encontrada.');
          }
        }
      );
    });

  };

  //Pegar os dados do RealTime FireBase
  function getDataUpdateDespesas(): Promise<void> {
    console.log("Iniciando Verificação de atualização nos dados do Despesas");
  
    return new Promise<void>((resolve, reject) => {
      const getDespesaUpdate = ref(datab, "Despesas/");
      onValue(getDespesaUpdate, (snapshot) => {
        const data = snapshot.val();
        const newData = Object.keys(data).map(key => ({
          random: key,
          ...data[key]
        }))
          .filter(item => {
            return item.motorista === sessao.nome && item.status !== "Pendente";
          });
  
        console.log("Dados filtrados", newData);
  
        const updatePromises: Promise<void>[] = [];
  
        newData.forEach(item => {
          if (item.status == "deleted") {
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM  despesaMotoristas WHERE id = ?',
                [ item.id],
                (tx, results) => {
                  console.log("Eliminado " + item.tipoDespesa);
  
                },
                (error) => {
                  console.log("Nenhum Eliminadao");
                }
              );
            });
          }

          if (item.status !== "Pendente") {
            const updatePromise = new Promise<void>((resolveUpdate, rejectUpdate) => {
              db.transaction((tx) => {
                tx.executeSql(
                  'UPDATE despesaMotoristas SET status = ?, motivo = ?, total = ?, valorDespesa = ?, qtdDespesa = ?  WHERE id = ?',
                  [item.status, item.motivo, item.total, item.valorDespesa, item.qtdDespesa, item.id],
                  (tx, results) => {
                    console.log("Atualizado " + item.tipoDespesa);
                    resolveUpdate(); // Resolva sem argumento
                  },
                  (error) => {
                    console.log("Nenhum atualizado");
                    rejectUpdate();
                  }
                );
              });
            });
  
            updatePromises.push(updatePromise);
          }
        });
  
        Promise.all(updatePromises)
          .then(() => {
           // getDataUpdateDespesas();
            console.log("Todas as atualizações concluídas");
            resolve(); // Resolva a promessa principal aqui
          })
          .catch(() => {
            console.log("Algumas atualizações falharam");
            reject(); // Rejeite a promessa principal em caso de erro
          });
      });
    });
  }

  function getDataUpdateMotoristaStatus() {
    return new Promise((resolve, reject) => {
      console.log("Verificar atualização nos dados do motorista");
      const getUpdate = ref(datab, "Motoristas/");
  
      onValue(getUpdate, (snapshot) => {
        const data = snapshot.val();
  
        const newData = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .filter(item => {
            const condition1 = item.Nome === sessao.nome && item.Status !== "Activo";
            return condition1;
          });
  
        // Percore o array newData
        newData.forEach(item => {
          if (item.status !== "Activo") {
            // Atualize o status no banco de dados SQLite local
            db.transaction((tx) => {
              tx.executeSql(
                'UPDATE sessions SET status = ? WHERE id = ?',
                [item.status, item.id],
                (tx, results) => {
                  console.log("Motorista atualizado");
                },
                (error) => {
                  console.log("Erro ao atualizar");
                  reject(error); // Rejeitar a promessa em caso de erro
                }
              );
            });
          }
        });
        resolve(null); // Resolver a promessa quando o processo estiver concluído (sem valor específico)
      });
  
      console.log("Fim Verificar atualização nos dados do motorista");
    });
  }
  
  const allExpenses = () => {
    setActiveFilter('all');
    setDespesas(null)
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM despesaMotoristas ORDER BY created_at DESC",
        [], // Passa o valor de nome como um parâmetro
        (txObj, resultSet) => {
          setDespesaMotorista(resultSet.rows._array);
          console.log(despesasMotorista)
        }
      );
    });
  }

  const pendenteExpenses = () => {
    setDespesas(null)
    setActiveFilter('pendente');
    const dp = "Pendente"
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM despesaMotoristas WHERE status = ? ORDER BY created_at DESC",
        [dp], // Passa o valor de nome como um parâmetro
        (txObj, resultSet) => {
          setDespesaMotorista(resultSet.rows._array);
          console.log(despesasMotorista)
        }
      );
    });
  }

  const devovidosExpenses = () => {
    setDespesas(null)
    setActiveFilter('devolvidos');
    const dp = "Devolvido"
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM despesaMotoristas WHERE status = ? ORDER BY created_at DESC",
        [dp], // Passa o valor de nome como um parâmetro
        (txObj, resultSet) => {
          setDespesaMotorista(resultSet.rows._array);
          console.log(despesasMotorista)
        }
      );
    });
  }

  const validadeExpenses = () => {
    setDespesas(null)
    setActiveFilter('validade');
    const dp = "Validado"
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM despesaMotoristas WHERE status = ? ORDER BY created_at DESC",
        [dp], // Passa o valor de nome como um parâmetro
        (txObj, resultSet) => {
          setDespesaMotorista(resultSet.rows._array);
          console.log(despesasMotorista)
        }
      );
    });
  }

  // Verificar se existe conexão 
  const verificarConexaoUpdates = () => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Está conectado à internet atualizações em curso..!" + sessao.nome);
        getDespesaAdd();
        getDataUpdateMotoristaStatus();
    });

    return () => {
      unsubscribe();
    };
  }

  const getButtonStyle = (filter) => {
    if (filter === activeFilter) {
      return [styles.filterButton, styles.activeButton];
    }
    return styles.filterButton;
  };

  const getButtonTextStyle = (filter) => {
    if (filter === activeFilter) {
      return [styles.filterButtonText, styles.activeText];
    }
    return styles.filterButtonText;
  };

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS despesaMotoristas (id INTEGER PRIMARY KEY AUTOINCREMENT, idFoto TEXT, local TEXT, url TEXT, viatura TEXT, nrDoc TEXT, tipoDespesa TEXT, valorDespesa TEXT, qtdDespesa TEXT, total TEXT, motorista TEXT, status TEXT,dataDoc TEXT, observacao Text, TipoCombustivel Text, motivo TEXT, random TEXT, created_at TEXT)");
    });
    const dp = "Devolvido"
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM despesaMotoristas WHERE status = ? ORDER BY created_at DESC",
        [dp], // Passa o valor de nome como um parâmetro
        (txObj, resultSet) => {
          setDespesaMotorista(resultSet.rows._array);
          console.log(despesasMotorista)
        }
      );
      tx.executeSql(consultaSQL, [], (_, { rows }) => {
        const resultado = rows.item(0);
        setTotalGastos(resultado.totalGastos);
      });
    });
    handleTabFocus();
    setIsLoading(false)
    setActiveFilter('devolvidos');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      handleTabFocus()
      verificarConexaoUpdates()
      const dp = "Devolvido"
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM despesaMotoristas WHERE status = ? ORDER BY created_at DESC",
          [dp], 
          (txObj, resultSet) => {
            setDespesaMotorista(resultSet.rows._array);
            console.log(despesasMotorista)
          }
        );
        tx.executeSql(consultaSQL, [], (_, { rows }) => {
          const resultado = rows.item(0);
          setTotalGastos(resultado.totalGastos);
        });
      });


      handleTabFocus()
      setShowCamera(false);
      setIsViewVisible(false);
      setIsViewVisibleData(false)
      setIsViewVisible1(true);
      setActiveFilter('devolvidos');
    },
      [])
  );

  const dataAddOnDespesas = async () => {
    try {
      const despesasRef = ref(datab, 'Despesas/');
      
      const arrayDeObjetos = despesaCarregar.map((despesa, index) => ({ index, ...despesa }));
  
      for (const objeto of arrayDeObjetos) {
        const chaveUnica = objeto.random;
        const indice = objeto.index;
        const random = objeto.random;
        const updated_at = objeto.updated_at;
        // Construa o caminho completo para o nó pai
        const caminhoPai = `Despesas/${chaveUnica}`;
        
        // Obtenha uma referência ao nó pai
        const paiRef = ref(datab, caminhoPai);
        
        // Obtenha o valor da coluna 'random' no nó pai
        const snapshot = await get(paiRef);
        
        if (snapshot.exists()) {
          // Verifique se o valor 'random' no nó pai é igual ao valor desejado e se updated_at mudou
          if (snapshot.val().random === random) {

            if(snapshot.val().updated_at < updated_at){
                 // O valor 'random' é igual ao valor desejado, atualize os dados
                 await set(ref(datab, caminhoPai), objeto);
                console.log('Dados atualizados com sucesso para o nó pai:', caminhoPai);
            }

          } else {
           //await set(paiRef, objeto);
            console.log('Random id invalido');
          }
        } else {
          await set(paiRef, objeto);
          console.log('Novo objeto criado no nó pai:', caminhoPai);
        }
      }
    } catch (error) {
      console.log('Erro ao adicionar ou atualizar dados em "Despesas/":', error);
    } finally{
      getDataUpdateDespesas();
    } 
  };
  
  const getDespesaAdd = () => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM despesaMotoristas WHERE status = 'Pendente'",
          [],
          async (_, resultSet) => {
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

              // Retorna a uri da foto guardada localmente
              const urlresultsr = await readPhotoUri(idFoto.toString());
              //Upload da foto e retorna a url 
              const downloadURL = await uploadImage(urlresultsr);

              const url = downloadURL;
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
              const devolucaoMotivo = item.motivo;
              const created_at = item.created_at;
              const codRandom = item.random;
              const updated_at = item.updated_at;
            
              // Adicionar os valores ao array de despesas
              despesaCarregar.push({
                id: id,
                foto: idFoto,
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
                motivo: devolucaoMotivo,
                random: codRandom,
                created_at: created_at,
                updated_at: updated_at
              });
            }
            // Mandar as despesas para realtime do firebase
           dataAddOnDespesas();
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

  const uploadImage = async (photoUri) => {
    try {
      console.log("Iniciando upload de fotos...");

      // Extrai o nome do arquivo da URI da imagem
      const filename = photoUri.substring(photoUri.lastIndexOf("/") + 1);

      // Cria uma referência à imagem no Firebase Storage
      const ref = firebase.storage().ref().child(filename);

      // Verifica se o arquivo já existe
      const fileExists = await ref.getDownloadURL().then(
        () => true, // Arquivo existe
        () => false // Arquivo não existe
      );

      if (fileExists) {
        console.log("A imagem já existe no Firebase Storage.");
        // Retorna a URL de download existente
        return ref.getDownloadURL();
      } else {
        // A imagem não existe, portanto, carregue-a
        const response = await fetch(photoUri);
        const blob = await response.blob();
        await ref.put(blob);
        const downloadURL = await ref.getDownloadURL();
        console.log("Imagem carregada com sucesso!");
        return downloadURL;
      }
    } catch (error) {
      console.log("Erro ao fazer o upload ou verificar a imagem:", error);
      return null;
    }
  };

  const readPhotoUri = async (photoId) => {
    try {
      // Obtém informações sobre a foto com base no ID
      const asset = await MediaLibrary.getAssetInfoAsync(photoId);

      console.log('Estrutura do objeto asset:', asset);

      if (asset && asset.uri) {
        const photoUri = asset.localUri;
        return photoUri;
      } else {
        console.log('Foto não encontrada com o ID fornecido');
        return null;
      }
    } catch (error) {
      console.log('Erro ao ler o URI da foto:', error);
      return null;
    }
  };

  //Buscar a foto pelo photouri e retorna o id
  const getPhotoIdByUri = async (photoUri) => {
    try {
      const assets = await MediaLibrary.getAssetsAsync({ mediaType: 'photo' });

      // Converte o array de ativos para um array padrão
      const assetArray = Array.from(assets.assets);

      for (let i = 0; i < assetArray.length; i++) {
        if (assetArray[i].uri === photoUri) {
          // Se encontrarmos a correspondência, extraímos o ID da foto
          const photoId = assetArray[i].id;
          console.log('ID da foto:', photoId);
          return photoId;
        }
      }
      console.log('Foto não encontrada na galeria com o URI fornecido');
      return null;
    } catch (error) {
      console.log('Erro ao obter o ID da foto pela URI:', error);
      return null;
    }
  };

 //=================================================
  const updatePhotoId = (imageid) => {

    // const estado = "Pendente";
    // db.transaction(tx => {
    //   tx.executeSql("UPDATE despesaMotoristas SET idFoto = ?, status = ? WHERE id = ?", [imageid, estado, id]);
    // });
    console.log("Foto actualizada com sucesso" + id)
    console.log("Foto actualizada com sucesso2" + imageid)
  }
 //=================================================

 const getDespesaDadata =  async() =>{
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM despesaMotoristas WHERE id = ?',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            const sessionData = rows.item(0);
            setDesp(sessionData); 
            setLocal(sessionData.local);
            setNrdoc(sessionData.nrDoc);
            setDataDoc(sessionData.dataDoc);
            setViatura(sessionData.viatura);
            setTipodespesa(sessionData.tipoDespesa);
            setTipoCombustivel(sessionData.TipoCombustivel)
            setQuantidade(sessionData.qtdDespesa);
           // setValor(sessionData.valorDespesa);
           setTotal(sessionData.total);
            setOberservacao(sessionData.observacao)
            setMotorista(sessionData.motorista)
            //setCreated_at(sessionData.created_at)
            //console.log('Despesa => Recuperada:', created_at);
            console.log('Despesa => Recuperada:', sessionData.created_at);
          } else {
            console.log('Errro ao selecionar.');
          }
        }
      );
    });
 }

  const toggleViewPhoto = () => {
    setIsViewVisible(false);
    setIsViewVisible1(false)
    setIsViewVisibleData(false)
    const getPhotoAfterSave = savePhotoToLibrary(photoUri)
    setFotoId(String(getPhotoAfterSave));
    updatePhotoId(fotoId)
    console.log('Foto salva na galeria' + fotoId);
  };

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
      const asset = await MediaLibrary.createAssetAsync(photoUri);
      console.log('Foto salva na biblioteca de mídia com ID:', asset.id);
      setId(asset.id);
      setFotoId(asset.id);
      setIsViewVisibleData(true)
      return asset.id || null;
    } catch (error) {
      console.log('Erro ao salvar a foto na biblioteca de mídia:', error);
      return null;
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotoUri(photo.uri);
      setIsViewVisible(true)
      setIsPhotoValid(false);
      setShowCamera(false);
      setIsViewVisible1(false)
    }
    getDespesaDadata();
  };

  const closeCamera = () => {
    setShowCamera(false);
    setIsViewVisible(false);
    setIsViewVisible1(true);
  }

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

  const showDespesas = () => {
    return despesasMotorista.map((despesa, index) => {
      return (
        <View key={index} style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          width: "45%",
          justifyContent: "flex-start",
          padding: 2,
          marginLeft: 15,
          paddingVertical: 12,
          borderBottomWidth: 4,
          borderBottomColor: COLORS.white,
        }}>
          <View style={{
            width: "100%",
            borderRadius: 10,
          }}>
            <Text style={{ color: "black", fontSize: 14, marginLeft: 4 }}>{despesa.nrDoc}</Text>
            <Text style={{ color: "black", fontSize: 14, marginLeft: 4 }}>{despesa.tipoDespesa}</Text>
            <Text style={{ color: "black", fontSize: 14, marginLeft: 4 }}>{despesa.dataDoc}</Text>
            <Text style={{ color: "black", fontSize: 14, marginLeft: 4 }}>{despesa.total} MT</Text>
            <Text style={{ color: "black", fontSize: 14, marginLeft: 4 }}>{despesa.viatura}</Text>
          </View>
          <View style={{
            width: "100%",
            borderRadius: 10,
            alignContent: "flex-end",
            alignItems: "flex-end"
          }}>

            {despesa.status === 'Pendente' && (
              <Text style={{ color: 'black', fontSize: 14 }}>
                <FontAwesome name="hourglass-1" color={COLORS.orange} size={28} />
              </Text>
            )}
            {despesa.status === 'Devolvido' && (
              <Text style={{ color: 'black', fontSize: 14 }}>
                <Text style={{ color: "black", fontSize: 14 }}> <EvilIcons onPress={() => {setId(despesa.id), setIdDespesa(despesa.id), setPhotoUri(null); setShowCamera(true); }} name="pencil" color={COLORS.orange} size={34} /></Text>
              </Text>
            )}
            {despesa.status !== 'Pendente' && despesa.status !== 'Devolvido' && (
              <Text style={{ color: 'black', fontSize: 14 }}>
                <AntDesign name="checkcircleo" color={COLORS.orange} size={30} />
              </Text>
            )}
            <Text style={{ color: "black", fontSize: 14 }}></Text>
            <Text style={{ color: COLORS.orange, fontSize: 16, fontWeight: "bold" }}> <Text>Situação:</Text>{despesa.status}</Text>
            {despesa.status === 'Devolvido' && (
              <Text style={{ color: 'black', fontSize: 10 }}>
                <Text style={{ color: "red", fontSize: 11 }}><Text>Motivo:</Text>{despesa.motivo}</Text>
              </Text>
            )}

          </View>
        </View>
      );
    }

    );
  }

  const toggleTipoCombustivel = () => {
    setIsView2Visible(!isView2Visible);
  };
  
  const showToast = () => {
    Toast.show({
          type: 'success', // Pode ser 'success', 'error', 'info', ou 'custom'
          position: 'top', // Posição: 'top' ou 'bottom'
          text1: 'Registado de sucesso',
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

const showToastValidMatricula = () => {
  Toast.show({
        type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
        position: 'top', // Posição: 'top' ou 'bottom'
        text1: 'Matricula Invalida',
        visibilityTime: 5000,
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

const showToastValidTipoCombustivel = () => {
  Toast.show({
        type: 'error', // Pode ser 'success', 'error', 'info', ou 'custom'
        position: 'top', // Posição: 'top' ou 'bottom'
        text1: 'Selecione o tipo de combustivel',
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

const addDespesa = async () => {
  setIsSpinnerVisible(true);
  if (local === null || nrdoc === null || viatura === null || quantidade === null || tipoDespesa === null || total === null || dataDoc === null) {
    setIsSpinnerVisible(false);
    showToastValidTextField();
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
    if(local === "Selecione a despesa"){
      setIsSpinnerVisible(false);
      showToastDespesa();
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
     setUrl("-");
     setOberservacao("-");
     const dataHoraAtual = moment().format('MM/DD/YYYY HH:mm:ss');
     setDataHoraAtual(dataHoraAtual);
     const updated_at = dataHoraAtual;
     const created_at = dataHoraAtual; 
     console.log(idDespesa)

       // Converter as datas para objetos Moment
       const dataNowObj = moment(dataNow, "ddd MMM DD YYYY");
       const createdAtObj = moment(created_at, "MM/DD/YYYY HH:mm:ss");
       
       // Comparar as datas
       if (dataNowObj.isAfter(createdAtObj)) {
             setIsSpinnerVisible(false);
             showToastValidData();
             return
           } 
     try {
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE despesaMotoristas SET idFoto = ?, local = ?, url = ?, viatura = ?, nrDoc = ?, tipoDespesa = ?, valorDespesa = ?, qtdDespesa = ?, total = ?, status = ?, dataDoc = ?, observacao = ?, tipoCombustivel = ?, updated_at = ?  WHERE id = ?",
          [fotoId, local, url, viatura, nrdoc, tipoDespesa, valorDespesa, quantidade, total, estado, dataDoc, observacao, tipoCombustivel, updated_at, idDespesa],
          (_, resultSet) => {
          // (_, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              console.log("Atualização bem-sucedida. Número de linhas afetadas: " + resultSet.rowsAffected);
              // Você pode adicionar outras ações de sucesso aqui
            } else {
              console.log("Nenhuma linha afetada. A atualização falhou.");
              // Lida com a falha de atualização aqui
            }
          },
          (_, error) => {
            console.log("Erro na transação SQL: " + error);
            // Lida com o erro SQL aqui
          }
        );
      });

      devovidosExpenses();
      setFotoId(null);
      setLocal(null);
      setDataDoc(null);
      setViatura(null);
      setNrdoc(null);
      setTipodespesa(null);
      setTotal(null);
      setUrl(null);
      setQuantidade(null);
      setOberservacao(null);
      setTipoCombustivel(null);
      setId(null);
      setIsSpinnerVisible(false);
      showToast();
      setIsViewVisible(false);
      setIsViewVisible1(true);
      setIsViewVisibleData(false);
      verificarConexaoUpdates();
      console.log('fim');
    } catch (error) {
      console.log('Falha ao gravar: ' + error);
    }
     
  }
};

  return (
    <View style={{
      height: "100%",

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
            borderRadius: 5,
            padding: 15,
            paddingHorizontal: 20,
            alignSelf: 'center',
          
            

          }}>
            <View style={{ display: "flex", flexDirection: "row", marginTop: '125%'}}>
              <TouchableOpacity onPress={takePicture} style={{ marginRight: 30 }}>
                <MaterialIcons name="photo-camera" size={38} color={COLORS.orange2} />
              </TouchableOpacity>
              <TouchableOpacity onPress={closeCamera} style={{}}>
                <MaterialIcons name="cancel" size={38} color={COLORS.orange2} />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      ) : (
        <>
          <View>
            {isViewVisible && (

              <View style={{ marginTop: 30, marginHorizontal: "auto"}}>

                {photoUri && (
                  <Image source={{ uri: photoUri }} style={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    width: 260,
                    height: 400,
                    marginHorizontal: "auto"
                  
                  }} />
                )}
                {isPhotoValid && (

                  <Text style={{
                    fontSize: 16,
                    color: 'green',
                    marginTop: 10,
                  }}>Foto válida!</Text>


                )}
            
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center",marginTop: 10  }}>
                  <AntDesign onPress={toggleViewPhoto}  name="checkcircleo" size={34} color={COLORS.orange} />
                  <MaterialIcons onPress={() => { setPhotoUri(null); setShowCamera(true); }} name="add-a-photo" size={34} color={COLORS.orange} />
                </View>

              </View>

            )}
          </View>

          {isViewVisible1 && (

            <View>
              {/* <View style={{
                marginTop: 5,
                alignItems: "center",
              }}>
                <Text style={{
                  color: COLORS.orange,
                  fontWeight: "bold",
                  fontSize: 24
                }}>Saldo: 20.000,00 MZN</Text>
              </View> */}

              <View style={{
                marginTop: 27,
                alignItems: "center",
                marginBottom: 0

              }}>
                <Text style={{
                  color: COLORS.orange,
                  fontWeight: "bold",
                  fontSize: 18
                }}>
                  Valor Usado: {totalGastos === null ? "0" : totalGastos} MT</Text>
              </View>

              <View style={{
                marginTop: 0,
                alignItems: "center",

              }}>
                <Text style={{
                  color: COLORS.black,
                  fontWeight: "bold",
                  fontSize: 18,
                  marginTop: 10,
                  marginBottom: 18
                }}>Resumo das despesas</Text>
              </View>


              <View style={{
                width: "90%",
                backgroundColor: "gray",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                padding: 0,
                left: 20,
                height: 30

              }}>

                <TouchableOpacity onPress={devovidosExpenses} style={getButtonStyle('devolvidos')}>
                  <Text id="devovidos" style={getButtonTextStyle('devolvidos')}>Devolvidas</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={pendenteExpenses} style={getButtonStyle('pendente')}>
                  <Text style={getButtonTextStyle('pendente')}>Pendentes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={validadeExpenses} style={getButtonStyle('validade')}>
                  <Text style={getButtonTextStyle('validade')}>Validadas</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={allExpenses} style={getButtonStyle('all')}>
                  <Text style={getButtonTextStyle('all')}>Todas</Text>
                </TouchableOpacity >


              </View>



              <View style={{
                margin: 16,
                marginTop: 5,
                borderRadius: 14,
                marginLeft: 10,
                overflow: "hidden",
                backgroundColor: COLORS.grey,
                height: "75%",
                width: "95%"
              }}>

                <ScrollView style={{ flex: 1 }}>
                  <View style={{
                    borderRadius: 11,
                    overflow: "hidden",
                  }}>
                    {showDespesas()}

                  </View>
                </ScrollView>

              </View>
            </View>

          )}


          {isViewVisibleData && (

            <View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, marginTop: 10 }}>

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
                            //item={pickedDataV}
                            item={provincias.find(item => item.label === local)}
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
                      }}>Data Doc</Text>

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
                            item={data.find(item => item.label === tipoDespesa)}
                            items={data}
                            onItemChange={(itemValue) => {
                              if (itemValue.label === "Combustivel") {
                                toggleTipoCombustivel();
                              }
                              if (itemValue.label !== "Combustivel") {
                                setIsView2Visible(false);
                              }
                              setQuantidade(null);
                              setTotal(null);
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
                                flexDirection: 'row', 
                                alignItems: 'center',
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
                              onChangeText={setTotal}
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
                    <Text style={{textAlign:"center", fontWeight:"bold", color: COLORS.orange}}>Preço Unitário: {precoUnitario.toFixed(2)}  MT</Text>
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
            </View>

          )}


        </>


      )}

    </View>

  );
}

const styles = StyleSheet.create({
  filterButton: {
    borderRightColor: 'white',
    borderRightWidth: 1,
    paddingRight: 0,
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: COLORS.orange2,
  },
  filterButtonText: {
    fontSize: 14,
    marginLeft: 12,
    marginRight: 9,
    color: 'white',
    fontWeight: 'bold',
  },
  activeText: {
    color: COLORS.white 
  },
});
