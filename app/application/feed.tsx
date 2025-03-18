import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useSelector } from 'react-redux';
import { RootState } from '@/constants/reduxStore';
import { Button } from '@/components/Button';
import { logout } from '@/features/auth/userSlice';
import { removeItem } from '@/constants/storage';
import { useRouter } from 'expo-router';

export default function FeedScreen() {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter()
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <Text>Nome do usuário: {user.username}</Text>
      <Button onPress={() => {
        logout()
        removeItem('user')
        removeItem('accessToken')
        removeItem('refreshToken')
        router.replace('/')
      }}>Logout</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
