import React, {useState, useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import Style from './style';
import Logo from '../assets/logo.png';
import MapView, {Marker, Callout} from 'react-native-maps';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';

import Api from '../services/api';
import Coords from '../database/states';

export default function Home(){
    const [currentRegion, setCurrentRegion] = useState(null);
    const [states, setStates] = useState([]);

    useEffect(()=>{
        async function LoadInitialPosition(){
            const {granted} =  await requestPermissionsAsync();
        return null;
    }

    async function loadCasesInformation(){
        const getStates = (await Api.get("/report/v1")).data;
        const states = getStates.data;
        const statesInfo = [];

        const statesOrder = states.sort((a,b)=>{
            return a.state > b.state ? 1 : b.state > a.state ? -1 : 0;
        });
        for(let i =0; i<statesOrder.lenght; i++){
            var id = parseInt(i) +1;
            var {uf, state, cases, deaths, suspects, refuses} = statesOrder[i];
            var {latitude, longitude} = Coords[i];
            var dateTime = new Date(statesOrder[i].datetime);
            var formatDateTime = `${dateTime.getDate()}-${
                parseInt(dateTime.getMonth()) +1
                }-${dateTime.getFullYear()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;

            statesInfo.push({
                uf, 
                state, 
                cases, 
                deaths, 
                suspects, 
                refuses,
                formatDateTime,
                latitude,
                longitude,
            });
        }
        setStates(statesInfo);
    }
    loadCasesInformation()
    return(
        <View style={Style.container}>
            <View style={Style.header}>
                <Text>COVID - 19</Text>
                <Image source={Logo}></Image>
            </View>
            <MapView
                onRegionChangeComplete = {HandleRegionChange}
                initialRegion = {currentRegion}
                style = {Style.map}
            >


                {states.map((state)=>{
                    return(
                       <Marker
                        key={state.uf}
                        coordinate={{
                            latitude: Number(state.latitude),
                            longitude: Number(state.longitude),
                        }}
                       >
                    <Callout>
                            <View style={Style.CalloutContent}>
                                <Text style={Style.CalloutText}>{state.state}</Text>
                                <Text style={Style.CalloutText}>Casos Confirmados: {state.cases}</Text>
                                <Text style={Style.CalloutText}>Mortos: {state.deaths}</Text>
                                <Text style={Style.CalloutText}>
                                    Atualizado no dia: {state.formatDateTime}
                                </Text>
                            </View>
                        </Callout> 


                       </Marker> 
                    );
                })}
                </MapView>
        </View>
    );
},[])