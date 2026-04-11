import React,{useEffect, useState} from 'react';
import { View, Text, Image, KeyboardAvoidingView, Platform, ScrollView, TextInput, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import InputField from '@/components/Input/InputField';
import { editJob } from '@/components/requests/requests';
import apiClient from '@/app/apiClient';
import { DetailProp } from '@/types/other';
import { Feather, Ionicons } from '@expo/vector-icons';
import Toast from '@/components/Toast';
import { useUpload } from '@/app/context/Uploadcontext';
import DefaultLoader from '@/components/Loader/defaultLoader';

const EditJob = () => {
    const [job, setJob] = useState<DetailProp>()
    const {id} = useLocalSearchParams()
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [payment, setPayment] = useState(0);
    const [category, setCategory] = useState<string[]>([]);
    const [cover_image_URL, setCover_image_url] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false)
    const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const {uploadImage,pickImage} = useUpload()

    const categories = [
        "Finance","Technology","Education","Marketing","Healthcare",
        "Construction","Design","Hospitality","Logistics",
    ];

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
        setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
        setSelectedCategories([...selectedCategories, category]);
        }
    };

// upload image to the backend
    const handleUploadImage = async () => {
        try{
            setLoading(true)
            const selectedImage = await pickImage()
            if(!selectedImage){
                setToastMessage(toastMessage)
                setToastType(toastType)
                setToastVisible(toastVisible)
                return;
            }
            await uploadImage(`job/upload_image/${id}`,selectedImage)
        }
        catch(error:any){
            console.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }

//// save changes
    const handleSave = async () => {
        if (!title || !description || !location || !payment || selectedCategories.length === 0) {
        setToastMessage("Please fill all fields");
        setToastType("error");
        setToastVisible(true);
        return;
        }

        try{
            setLoading(true)
            await editJob(id,title,description,payment,location,selectedCategories)
            setToastMessage("Changes Saved Successfully!");
            setToastType("success");
            setToastVisible(true);
            setTimeout(() =>{
                router.back()
            },1000)

        }
        catch(error:any){
            console.error(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    // get a particular job
    const getJob = async () => {
        try {
        const response = await apiClient.get(`/job/job/${id}`);
        setJob(response.data);
        setCategory(response.data.job.category || []);
        } catch (error: any) {
        console.log(error.message);
        }
    };

    // set job values to state variables
    useEffect(() => {
    if (job) {
        setTitle(job.job.title);
        setDescription(job.job.description);
        setLocation(job.job.location);
        setPayment(job.job.payment);
        setCategory(job.job.category || []);
        setSelectedCategories(job.job.category || []);
        setCover_image_url(job.job.cover_image_URL)
    }
    }, [job]);

    useEffect(() => {
        if(id) getJob()
    },[id])

  return (
    <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios'? 'padding':'height'} 
        style={{flex:1}}
        >
            <ScrollView>
            <View className='relative'>
                <Image source={cover_image_URL?{uri:cover_image_URL}:require('../../../assets/images/defaultImage.png')} className='w-full h-[220px]' resizeMode='cover'/>
                <View className='inset w-full h-[220px] bg-black/30 absolute'></View>
                <TouchableOpacity  onPress={() => handleUploadImage()} className='absolute top-2 right-2 bg-white border-2 border-white p-1 rounded-full'>
                    <Feather 
                        name='camera' size={20} color={"#2563EB"}/>
                </TouchableOpacity>
            </View>
            <View className='flex flex-col items-center py-5 gap-y-4'>
                <InputField
                label='Title'
                placeholder='new title'
                value={title}
                onChange={(title) => setTitle(title)}/>


                <View>
                <Text className="font-medium mb-1">Description</Text>
                <TextInput
                className="border border-gray-200 rounded-xl p-3 h-28 mb-4 w-[330px]"
                multiline
                textAlignVertical="top"
                placeholder="Describe the job..."
                value={description}
                onChangeText={(description) => setDescription(description)}
                />
                </View>

                <InputField
                label='Location'
                placeholder='new location'
                value= {location}
                onChange = {(location) => setLocation(location)}/>

                <InputField
                label='Payment'
                placeholder='new payment'
                value={payment ? String(payment) : ''}
                onChange={(payment) => setPayment(Number(payment) || 0)}
                />

                {/** Category selection button */}
                <View>
                    <Text className="font-medium">Select Category</Text>
                    <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="border border-gray-200 rounded-xl p-4 w-[330px]"
                    >
                    {selectedCategories.length > 0 ? (
                        <View className="flex-row flex-wrap gap-2">
                        {selectedCategories.map((cat, i) => (
                            <View key={i} className="bg-primary/10 px-3 py-1 rounded-full">
                            <Text className="text-primary text-xs">{cat}</Text>
                            </View>
                        ))}
                        </View>
                    ) : (
                        <Text className="text-gray-400">Select categories</Text>
                    )}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleSave}>
                    <Text className='bg-primary p-4 rounded-full text-white font-black'>Save Changes</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>

            {/**category Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View className="flex-1 justify-end bg-black/40">
                    <View className="bg-white p-5 rounded-t-3xl">
                    
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold">Select Categories</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={24} />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row flex-wrap gap-3">
                            {categories.map((category) => {
                            const selected = selectedCategories.includes(category);

                            return (
                                <TouchableOpacity
                                key={category}
                                onPress={() => toggleCategory(category)}
                                className={`px-4 py-2 rounded-full border ${
                                    selected
                                    ? "bg-primary border-primary"
                                    : "border-gray-300"
                                }`}
                                >
                                <Text className={selected ? "text-white" : "text-black"}>
                                    {category}
                                </Text>
                                </TouchableOpacity>
                            );
                            })}
                        </View>
                    </View>
                </View>
            </Modal>
      </KeyboardAvoidingView>
    {/* 🔔 TOAST */}
        <Toast
            visible={toastVisible}
            type={toastType}
            message={toastMessage}
            onHide={() => setToastVisible(false)}
        />
        {loading && <DefaultLoader/>}
    </SafeAreaView>
  );
}

export default EditJob;
