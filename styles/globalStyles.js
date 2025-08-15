import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#4CAF50',
  secondary: '#81C784',
  background: '#F8F9FA',
  white: '#FFFFFF',
  text: '#2E2E2E',
  textLight: '#757575',
  border: '#E0E0E0',
  error: '#F44336',
  success: '#4CAF50'
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonSecondaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.white,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  }
});