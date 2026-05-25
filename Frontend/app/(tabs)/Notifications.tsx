import NotificationCard from '@/components/Cards/NotificationCard';
import React,{useEffect, useState} from 'react';
import { View, Text, Image, FlatList, Touchable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { clear_all, deleteANotification, getNotifications, readNotification } from '@/components/requests/requests';
import { Notifications_type } from '@/types/other';
import DefaultLoader from '@/components/Loader/defaultLoader';
import images from '@/types/images';

const Notifications = () => {
  const {user, fetchUser} = useAuth()
  const [notifications, setNotifications] = useState<Notifications_type[]>([])
  const [loading, setLoading] = useState(false)
  const limit = 10;
  const offset = 0;


  // fetch all notifications
  const fetchNotifications = async () => {
    try{
      setLoading(true)
      console.log("ID",user?.id)
      const response = await getNotifications(user?.id,limit,offset)
      setNotifications(response.notifications)
    }
    catch(error:any){
      console.error(error.message)
      throw error;
    }
    finally{
      setLoading(false)
    }
  }


  // read a notification
const handleReadNotification = async (notification_id: number) => {

  // Instant UI update
  setNotifications((prev) =>
    prev.map((item) =>
      item.id === notification_id
        ? { ...item, is_read: true }
        : item
    )
  );

  try {
    await readNotification(notification_id);

    // optional refetch
    fetchUser();

  } catch (error: any) {

    // rollback if API fails
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification_id
          ? { ...item, is_read: false }
          : item
      )
    );

    console.error(error.response.data);
  }
};


// delete a specific notification
const delete_Notification = async (notification_id: number) => {

  // Save current state for rollback
  const previousNotifications = notifications;

  // Instant UI removal
  setNotifications((prev) =>
    prev.filter((item) => item.id !== notification_id)
  );

  try {
    setLoading(true);

    await deleteANotification(notification_id);

  } catch (error: any) {

    // rollback if request fails
    setNotifications(previousNotifications);

    console.error(error.response?.data);

  } finally {
    setLoading(false);
  }
};

// clear all notifications
const handle_clear_allNotifications = async () => {
  try{
    setLoading(true);
    const res = await clear_all(user?.id);
    fetchNotifications()
  }
  catch(error:any){
    console.error(error.response.data)
  }
  finally{
    setLoading(false)
  }
}

  useEffect(() => {
    fetchNotifications()
  },[])

  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
          <View className="px-4 py-4 flex-row items-center justify-between bg-white">
            <Image
              className="w-12 h-12 rounded-full"
              source={
                user?.profile_URL
                  ? { uri: user.profile_URL }
                  : require("@/assets/images/default_profile.jpg")
              }
            />
            <View>
              <Text className="text-xl font-bold text-gray-800">
                Notifications
              </Text>
            </View>

          </View>
      <View>
       <FlatList
       data={notifications}
       renderItem={({item}) => 
         <NotificationCard
          title={item.title}
          message={item.message}
          time={item.created_at}
          is_read={item.is_read}
          type={item.type}
          onClose={() => delete_Notification(item.id)}
          onPress={() => handleReadNotification(item.id)}
        />
       }
       ListHeaderComponent={
        <View className='px-3'>
          <TouchableOpacity onPress={handle_clear_allNotifications}>
            <Text className='text-primary font-bold'>Clear all</Text>
          </TouchableOpacity>
        </View>}
       ListEmptyComponent={
          <View className='mt-10 flex fleex-col items-center'>
            <Image source={images.no_notification} style={{width:200, height:200}}/>
            <Text className='font-bold text-xl text-muted'>No Notifications Yet </Text>
            <Text className='text-md text-gray-400'>your Notifcations will apear here</Text>
        </View>
       }/>
      </View>
      {
        loading && <DefaultLoader/>
      }
    </SafeAreaView>
  );
}

export default Notifications;
