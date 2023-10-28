import { Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native"
import { useState } from 'react';
import { ListItem } from "../components/LidstItem"
import { Picker, type PickerItem } from 'react-native-woodpicker'


import { Expense } from "../Models/expenses"



import { theme } from "../Theme";


export const Add = () => {


      const [foto, setFoto] = useState("");
      const [local, setLocal] = useState("");
      const [dataDoc, setDataDoc] = useState("");
      const [tipoDespesa, setTipodespesa] = useState<PickerItem>({
            label: Expense.Seleciona,
            value: Expense.Seleciona
      }
      );
      const [nrdoc, setNrdoc] = useState("");
      const [valor, setValor] = useState("");
      const [km, setKm] = useState("");
      const [viatura, setViatura] = useState<PickerItem>();
      const [pickedData, setPickedData] = useState<PickerItem>();

  const data: Array<PickerItem> = [
    { label: "Seleciona a despesa", value: 1 },
    { label: "DataCat", value: 1 },
    { label: "DataDog", value: 2 },
    { label: "DataSnake", value: 3 },
    { label: "DataPlatypus", value: 4 },
    { label: "DataWhale", value: 5 }
  ];

  const vehicle: Array<PickerItem> = [
      { label: "Seleciona a viatura", value: 1 },
      { label: "Mazda", value: 1 },
      { label: "Izusu", value: 2 },
      { label: "BMW", value: 3 },
      { label: "Mercedes", value: 4 },
      { label: "Porche", value: 5 }
    ];
  




      return (
            <ScrollView
                  style={{
                        marginTop: 16,
                        borderRadius: 11,
                        overflow: "hidden",
                  }}
            >

                  <ListItem label="Valor"
                        detail={
                              <TextInput
                                    placeholder="Valor gasto $"
                                    placeholderTextColor={theme.colors.border}
                                    style={{
                                          color: "white",
                                          flex: 1,
                                          borderRadius: 8,
                                          height: 40,
                                          paddingLeft: 8
                                    }} />
                        }
                        onClick={() => {

                        }} />
                  <ListItem label="Despesa"
                        detail={
                              <>
                                    <Picker
                                    
                                          //item={tipoDespesa}
                                          //items={Object.keys(Expense).map((rec) => ({ label: rec, value: rec }))}
                                          item={pickedData}
                                          items={data}
                                          onItemChange={setTipodespesa}
                                          placeholder=""
                                          itemColor="White"
                                          isNullable={false}
                                          style={{
                                                minWidth:"65%",
                                                height:40,
                                                width:"100%",
                                                flex:1,
                                                backgroundColor: "#212f45",
                                                borderRadius: 8,
                                                borderColor: theme.colors.border,
                                                paddingLeft: 8,
                                          }}
                                    />
                              </>
                        }
                  />
                  <ListItem label="Viatura"
                        detail={
                              <>
                              <Picker
                              
                                    //item={tipoDespesa}
                                    //items={Object.keys(Expense).map((rec) => ({ label: rec, value: rec }))}
                                    item={viatura}
                                    items={vehicle}
                                    onItemChange={setViatura}
                                    placeholder=""
                                    isNullable={false}
                                    style={{
                                          minWidth:"65%",
                                                height:40,
                                                width:"100%",
                                                flex:1,
                                                backgroundColor: "#212f45",
                                                borderRadius: 8,
                                                borderColor: theme.colors.border,
                                                paddingLeft: 8,
                                    }}
                              />
                        </>} />
                  <ListItem label="Local"
                        detail={
                              <TextInput
                                  
                                    placeholder="Valor gasto"
                                    placeholderTextColor={theme.colors.border}
                                    style={{
                                          color: "white",
                                          flex: 1,
                                          borderRadius: 8,
                                          paddingLeft: 8,
                                          marginLeft: 8
                                    }} />
                        }
                        onClick={() => {

                        }} />
                  <ListItem label="Kilometragem"
                        detail={
                              <TextInput
                                  
                                    placeholder="Kilometragem"
                                    placeholderTextColor={theme.colors.border}
                                    style={{
                                          color: "white",
                                          flex: 1,
                                          borderRadius: 8,
                                          paddingLeft: 8,
                                          marginLeft: 8
                                    }} />
                        }
                        onClick={() => {

                        }} />
                  <ListItem label="Numero do documento"
                        detail={
                              <TextInput
                                  
                                    value={nrdoc}
                                    placeholder="Numero do documento"
                                    placeholderTextColor={theme.colors.border}
                                    style={{
                                          color: "white",
                                          flex: 1,
                                          borderRadius: 8,
                                          paddingLeft: 8,
                                          marginLeft: 8
                                    }} />
                        }
                        onClick={() => {

                        }} />
                  <ListItem label="Foto"
                        detail={
                              <TextInput
                                    
                                    placeholder="Foto"
                                    placeholderTextColor={theme.colors.border}
                                    style={{
                                          color: "white",
                                          flex: 1,
                                          borderRadius: 8,
                                          paddingLeft: 8,
                                          marginLeft: 8
                                    }} />
                        }
                        onClick={() => {

                        }} />

                        
            </ScrollView>
      )

}

