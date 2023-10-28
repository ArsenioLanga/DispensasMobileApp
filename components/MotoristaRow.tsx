import { View, Text } from "react-native";
import { Motorista } from "../Models/motorista";
import { theme } from "../Theme";


export const MotoristaRow = ({nome, tipoServico, contacto, nrCartao, nib}: Omit<Motorista, "id">) =>(
    <View style={{
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
        {/* <View style={{
            backgroundColor: "#b6b6b6",
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 2,
            borderColor: "white"
        }}>
        </View> */}
        <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{nome}</Text>  
        <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{tipoServico}</Text> 
        <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{contacto}</Text> 
        <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{nrCartao}</Text> 
    </View>
)