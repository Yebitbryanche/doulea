import { router, useLocalSearchParams } from "expo-router";
import { createContext, useContext, useState } from "react"; 
import * as ImagePicker from "expo-image-picker"; 
import { Platform } from "react-native";
import axios from "axios";
import { API_URL } from "../apiClient";

interface UploadImageTypes{
    image: string | null
    loading:boolean
    pickImage:() => Promise<string | null>
    uploadImage:(endpoint:string,uri:string) => Promise<void>
    requestUpload:(imageURI: string, fileName: string, endpoint:string) => Promise<void>
    toastType:'success'|'error'|'info'
    toastVisible:boolean
    toastMessage:string
}


const UploadImageContext = createContext<UploadImageTypes | undefined>(undefined)

    export const UploadImageProvider = ({children}:any) =>{
    const [image, setImage] = useState<string | null>(null)
    const [loading,setLoading] = useState(false)
    const [toastType, setToastType] = useState<'success'|'error'|'info'>('info')
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    // pick image
    const pickImage = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
        })

        if (!result.canceled) {
            const uri = result.assets[0].uri
            setImage(uri)
            return uri
        }

        return null
    }

    // upload image
    const uploadImage = async (endpoint:string,imageUri?: string) => {
        const uri = imageUri || image;

        if (!uri) {
        setToastMessage('Please choose an image')
        setToastType('error')
        setToastVisible(true)
        return
        }
        try{
            setLoading(true)


            const fileName = uri.split("/").pop() || "cover.jpg"

            await requestUpload(uri, fileName, endpoint)

            //router.replace("/(tabs)/Home")
        }
        catch(error:any){
            console.error(error)
            if (error) {
            setToastMessage('Please choose an image')
            setToastType('error')
            setToastVisible(true)
            return
            }
        }
        finally{
            setLoading(false)
        }
    }

    // request upload
    const requestUpload = async (
        imageURI: string,
        fileName: string,
        endpoint:string
    ) => {

        const data = new FormData()

        data.append("file", {
        uri: Platform.OS === "android" ? imageURI : imageURI.replace("file://", ""),
        name: fileName,
        type: "image/jpeg",
        } as any)
        setLoading(true)
        try {
            console.log(`${API_URL}/${endpoint}`)
            const response = await axios.post(
                `${API_URL}/${endpoint}`, // this should change when accessing different upload endpoints
                data,
                {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                }
            )
            setToastMessage('Cover image added successfully')
            setToastType('success')
            setToastVisible(true)
            console.log("success", response.data)

        } catch (error: any) {
            console.log(error.message)
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <UploadImageContext.Provider value={{image,loading,toastType,toastVisible,toastMessage,pickImage, uploadImage, requestUpload}}>
            {children}
        </UploadImageContext.Provider>
    )
}

export const useUpload = () => {
    const context = useContext(UploadImageContext);

    if(!context){
        throw new Error("useUpload must be inside UploadImegeProvider")
    }

    return context;
}