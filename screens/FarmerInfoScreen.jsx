import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { globalStyles, COLORS } from '../styles/globalStyles';
import { useApp } from '../context/AppContext';

export default function FarmerInfoScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    identityNumber: '',
    gender: '',
    mobileNumber1: '',
    ...state.registrationData
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    dispatch({ type: 'UPDATE_REGISTRATION', payload: formData });
    navigation.navigate('FarmInfo');
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView style={globalStyles.screenPadding}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Farmer Information</Text>
          <Text style={globalStyles.subtitle}>Tell us about yourself</Text>
        </View>

        <View style={styles.form}>
          <Text style={globalStyles.label}>First Name</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            placeholder="Enter first name"
          />

          <Text style={globalStyles.label}>Last Name</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            placeholder="Enter last name"
          />

          <Text style={globalStyles.label}>South African ID Number</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.identityNumber}
            onChangeText={(value) => updateField('identityNumber', value)}
            placeholder="Enter ID number"
            keyboardType="numeric"
          />

          <Text style={globalStyles.label}>Gender</Text>
          <View style={[globalStyles.input, { padding: 0 }]}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => updateField('gender', value)}
            >
              <Picker.Item label="Please Select" value="" />
              <Picker.Item label="Male" value="1" />
              <Picker.Item label="Female" value="2" />
            </Picker>
          </View>

          <Text style={globalStyles.label}>Phone Number</Text>
          <TextInput
            style={globalStyles.input}
            value={formData.mobileNumber1}
            onChangeText={(value) => updateField('mobileNumber1', value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[globalStyles.button, globalStyles.buttonSecondary]}
            onPress={() => navigation.goBack()}
          >
            <Text style={globalStyles.buttonSecondaryText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={globalStyles.button}
            onPress={handleNext}
          >
            <Text style={globalStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
  },
  form: {
    marginBottom: 40,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});