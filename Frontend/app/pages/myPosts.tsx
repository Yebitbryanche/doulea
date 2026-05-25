import EmployerJobCard from '@/components/Cards/employerJobCard';
import { deleteJob, getEmployer_jobs } from '@/components/requests/requests';
import { JobDetailProps } from '@/types/other';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import DefaultLoader from '@/components/Loader/defaultLoader';
import images from '@/types/images';
import RegisterButton from '@/components/Buttons/RgisterButton';
import { useTranslation } from 'react-i18next';

const myPosts = () => {
    const [uploads,setUploads] = useState<JobDetailProps[] | undefined>([])
    const {user} = useAuth()
    const {t} = useTranslation()
    const [loading,setLoading] = useState(false)
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<JobDetailProps | null>(null);

    const getUploads = async () =>{
        try{
            setLoading(true)
            const response = await getEmployer_jobs(user?.id)
            setUploads(response)
        }
        catch(error:any){
            console.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    // delete listing
    const handleDelete = async (item:JobDetailProps) => {
        try{
            setLoading(true)
            const response = await deleteJob(item.id)
            await getUploads()
            setSelectedItem(item);
            setDeleteModalVisible(true);
        }
        catch(error:any){
            console.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    // confirm delete
    const confirmDelete = async () => {
        if (!selectedItem) return;

        await handleDelete(selectedItem);
        setDeleteModalVisible(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        getUploads()
    },[user?.id])
  return (
    <SafeAreaView className='flex-1 bg-white'>
        <ScrollView>
            <View className='flex flex--col items-center p-3 relarive'>
                <Feather name='chevron-left' size={23} color={'#2563EB'} className='absolute left-3 top-3' onPress={() => router.back()}/>
                <Text className='font-black text-2xl'>My Posts</Text>
            </View>
            <View className='p-3'>
            {uploads?.length === 0?
            <View>
                <Image source={images.myposts} className='w-[250px] h-[250px] flex self-center' resizeMode='contain'/>
                <View className='flex self-center items-center gap-y-4'>
                    <Text>You Upload to see Your Jobs Here</Text>
                    <RegisterButton title='Go to Upload' onPress={() => router.push('/(tabs)/Upload')}/>
                </View>
            </View>:
            uploads?.map((item,index)=>(
                <EmployerJobCard
                key={index}
                cover_image_URL={item.cover_image_URL}
                title={item.title}
                description={item.description}
                location={item.location}
                created_at={item.created_at}
                >
                    <TouchableOpacity onPress={() => router.push({
                        pathname:'/pages/edit_job/[id]',
                        params:{id:String(item.id)}
                    })}>
                        <Feather name='edit-3' size={20} className='bg-accent p-1 rounded-full' color={'#ebc10a'}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setSelectedItem(item);
                        setDeleteModalVisible(true);}
                    }>
                        <Feather name='trash-2'size={20} className='bg-red-100 p-1 rounded-full' color={'#ba1010'} />
                    </TouchableOpacity>
                </EmployerJobCard>
            ))}
            </View>
        </ScrollView>
      <Modal
      transparent
      visible={deleteModalVisible}
      animationType="fade"
    >
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          className="bg-white w-[85%] rounded-3xl p-6"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
          }}
        >

          {/* ICON */}
          <View className="items-center mb-4">
            <View className="bg-red-100 p-4 rounded-full">
              <Ionicons
                name="trash-outline"
                size={32}
                color="#ef4444"
              />
            </View>
          </View>

          {/* TITLE */}
          <Text className="text-xl font-black text-center text-gray-800">
            {t("delete")}
          </Text>

          {/* MESSAGE */}
          <Text className="text-gray-500 text-center mt-3 leading-6">
            {t("Are you sure you want to delete this job?")}
          </Text>

          {/* BUTTONS */}
          <View className="flex-row gap-x-3 mt-6">

            {/* CANCEL */}
            <TouchableOpacity
              onPress={() => setDeleteModalVisible(false)}
              className="flex-1 bg-gray-100 py-4 rounded-2xl items-center"
            >
              <Text className="font-bold text-gray-700">
                {t("cancel")}
              </Text>
            </TouchableOpacity>

            {/* LOGOUT */}
            <TouchableOpacity
              onPress={() => {
                setDeleteModalVisible(false);
                confirmDelete();
              }}
              className="flex-1 bg-red-500 py-4 rounded-2xl items-center"
            >
              <Text className="font-bold text-white">
                {t("delete")}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
      </Modal>
        {loading && <DefaultLoader/>}
    </SafeAreaView>
  );
}

export default myPosts;
