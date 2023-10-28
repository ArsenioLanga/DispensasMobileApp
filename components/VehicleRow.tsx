import { View, Text } from "react-native";
import { Category } from "../Models/category";
import { theme } from "../Theme";
import { vehicle } from "../Models/vehicle";


export const VehicleRow = ({modelo, matricula}: Omit<vehicle, "id">) =>(
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
        <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{modelo}</Text>  
        <Text style={{color: "white", fontSize:16, marginLeft: 8}}>{matricula}</Text>  
    </View>
)