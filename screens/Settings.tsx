import {Text, View, Alert} from "react-native"
import { ListItem } from "../components/LidstItem"
import { Entypo } from '@expo/vector-icons'; 
import { theme } from "../Theme";



export const Settings = ({navigation}) => {
      return(
      <View style={{
            margin: 16,
            borderRadius: 11,
            overflow: "hidden"
            }}>
            <ListItem
                  label="Tipo de despensa"
                  detail={<Entypo name="chevron-right" size={40} color="white" style={{opacity: 0.3}}/>}
                  onClick={() => { 
                        navigation.navigate("Categorias")
                  }}
            />
               <ListItem
                  label="Veículos"
                  detail={<Entypo name="chevron-right" size={40} color="white" style={{opacity: 0.3}}/>}
                  onClick={() => { 
                        navigation.navigate("Veiculos")
                  }}
            />
              <ListItem
                  label="Motoristas"
                  detail={<Entypo name="chevron-right" size={40} color="white" style={{opacity: 0.3}}/>}
                  onClick={() => { 
                        navigation.navigate("Motoristas")
                  }}
            />
              <ListItem
                  label="Reportar eventualidades"
                  detail={<Entypo name="chevron-right" size={40} color="white" style={{opacity: 0.3}}/>}
                  onClick={() => {

                  }}
            />
              <ListItem
                  label="Reiniciar a aplicação"
                  isDestructive
                  onClick={() => {
                        Alert.alert("Tem certeza?", "Esta opção é inreversivel", [
                              {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel',
                                  },
                                  {text: 'OK', style: "destructive", onPress: () => console.log('OK Pressed')},
                        ],{
                              userInterfaceStyle: 'dark',
                        })
                  }}
            />
            
      </View>
 )}