import { Tabs } from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from '@expo/vector-icons/Fontisto';


export default function TabLayout(){
    return(
        <Tabs screenOptions={{
            tabBarActiveTintColor:"#2563EB",
            headerShown:false,
            tabBarLabelStyle:{
                fontWeight:700,
            },
            tabBarStyle:{
                borderTopLeftRadius:30,
                borderTopRightRadius:30,
            }
            }}>

            <Tabs.Screen
            name="Home"
            options={{
                title:"Home",
                tabBarIcon: ({color}) => <FontAwesome name="home" size={28} color={color}/>
            }}
            />
            <Tabs.Screen
            name="Upload"
            options={{
                title:"Upload",
                tabBarIcon: ({color}) => <MaterialIcons name="post-add" size={28} color={color}/>
            }}
            />
            <Tabs.Screen
            name="Favorites"
            options={{
                title:"Favorites",
                tabBarIcon: ({color}) => <Fontisto name="favorite" size={25} color={color}/>
            }}
            />
                        <Tabs.Screen
            name="Notifications"
            options={{
                title:"Notifications",
                tabBarIcon: ({color}) => <Fontisto name="bell" size={25} color={color}/>
            }}
            />
        </Tabs>
    )
}