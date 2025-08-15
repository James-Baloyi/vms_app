import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { globalStyles, COLORS } from '../styles/globalStyles';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={[globalStyles.screenPadding, styles.content]}>
        <View style={styles.header}>
          <Text style={globalStyles.title}>Welcome to Farmer Portal</Text>
          <Text style={globalStyles.subtitle}>
            Access government agricultural support programmes
          </Text>
        </View>

        <View style={styles.programs}>
          <View style={[globalStyles.card, styles.programCard]}>
            <Text style={styles.programTitle}>PESI Programme</Text>
            <Text style={styles.programDesc}>
              The Presidential Employment Stimulus is aimed at supporting farmers through employment programme and skills development
            </Text>
          </View>

          <View style={[globalStyles.card, styles.programCard]}>
            <Text style={styles.programTitle}>WASP Programme</Text>
            <Text style={styles.programDesc}>
              The Winter Agricultural Support Programme provides seasonal assistance during critical farming periods
            </Text>
          </View>

          <View style={[globalStyles.card, styles.programCard]}>
            <Text style={styles.programTitle}>Disaster Relief</Text>
            <Text style={styles.programDesc}>
              Emergency support for farmers affected by natural disasters such as drought, floods, and extreme weather
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={globalStyles.button}
          onPress={() => navigation.navigate('FarmerInfo')}
        >
          <Text style={globalStyles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  programs: {
    flex: 1,
  },
  programCard: {
    marginBottom: 16,
  },
  programTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  programDesc: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
});