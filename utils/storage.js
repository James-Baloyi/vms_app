import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setFarmerToken(token) {
    await AsyncStorage.setItem('farmerToken', token);
  },

  async getFarmerToken() {
    return await AsyncStorage.getItem('farmerToken');
  },

  async setFarmerData(data) {
    await AsyncStorage.setItem('farmerData', JSON.stringify(data));
  },

  async getFarmerData() {
    const data = await AsyncStorage.getItem('farmerData');
    return data ? JSON.parse(data) : null;
  },

  async clearAll() {
    await AsyncStorage.multiRemove(['farmerToken', 'farmerData']);
  }
};