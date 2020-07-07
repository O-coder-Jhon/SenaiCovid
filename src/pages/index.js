import React, {useState, useEffect} from 'react';
import {View, Image} from 'react-native';
import Style from './style'
import Logo from '../assets/icon.png';
import MapView from 'react-native-maps';
import {requestPermissionsAsync, getCurrentPositionAsync} from 'expo-location';


export default function Home(){
    const [currentRegion, setCurrentRegion] = useState(null);
    useEffect(() =>{
        async function LoadInitialPosition(){
            const {granted} = await requestPermissionsAsync();
            
            if(granted){
                const {coordenadas} = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });
                const {latitude, longitude} = coordenadas;
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 10.0,
                    longitudeDelta: 15.0,
                })
            }
        }
        LoadInitialPosition();
    }, [])

    function HandleRegionChange(Region){
        setCurrentRegion(Region);
    }

    if(!currentRegion){
        return null;
    }

    return(
        <View style={Style.container}>
            <View style={Style.header}>
                <Image source={Logo}></Image>
            </View>
            <MapView 
                onRegionChangeComplete = {HandleRegionChange}
                initialRegion = {currentRegion}
                style = {Style.map}
            />
        </View>
    )
}