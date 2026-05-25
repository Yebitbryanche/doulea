import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons";


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
                tabBarIcon: ({color}) => <Ionicons name="home-outline" size={28} color={color}/>
            }}
            />
            <Tabs.Screen
            name="Upload"
            options={{
                title:"Upload",
                tabBarIcon: ({color}) => <Ionicons name="cloud-upload-outline" size={28} color={color}/>
            }}
            />
            <Tabs.Screen
            name="Favorites"
            options={{
                title:"Favorites",
                tabBarIcon: ({color}) => <Ionicons name="bookmark-outline" size={25} color={color}/>
            }}
            />
                        <Tabs.Screen
            name="Notifications"
            options={{
                title:"Notifications",
                tabBarIcon: ({color}) => <Ionicons name="notifications-outline" size={25} color={color}/>
            }}
            />
        </Tabs>
    )
}