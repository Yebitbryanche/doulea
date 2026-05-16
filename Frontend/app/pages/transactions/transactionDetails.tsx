import { useAuth } from '@/app/context/AuthContext';
import TransactionCard from '@/components/Cards/Transaction';
import { getTransactionDetails } from '@/components/requests/requests';
import { TransactionTypes } from '@/types/other';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TransactionDetails = () => {

    const {width, height }= Dimensions.get('window')
    const {user} = useAuth()
    const {t} = useTranslation()
    const [transactions, setTransactions] = useState<TransactionTypes[]>([])
    const getTransactions = async () =>{
        try{
            const response = await getTransactionDetails(user?.id)
            setTransactions(response.transactions)
        }
        catch(error:any){
            console.error(error.response.data)
        }
    }
    useEffect(() =>{
        getTransactions()
    },[user?.id])
  return (
    <SafeAreaView className='flex-1 bg-white'>
        <View className='py-6'>
            <Text className='flex self-center text-lg font-bold'>{t("transaction history")}</Text>
        </View>
      {!transactions?
      <View>
        <Image
        source={require('@/assets/images/transaction.png')}
        style={{width:width*1, height:height*0.3}} resizeMode="contain"/>

        <Text className='flex self-center'>You haven't made any transactions yet</Text>
      </View>:
      transactions.map((transaction) =>(
          <TransactionCard
          key={transaction.reference}
          amount={transaction.amount}
          status={transaction.status}
          date={transaction.created_at}
          reference={transaction.reference}/>
      ))
      }
    </SafeAreaView>
  );
}

export default TransactionDetails;
