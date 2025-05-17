import { colors } from '@/constants';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

// Define the role type for type safety
type Role = 'owner' | 'admin' | 'member';

// Interface for component props
interface ChatRoleDisplayProps {
  role: Role;
}

// Functional component to display chat role
export const ChatRoleDisplay: React.FC<ChatRoleDisplayProps> = ({ role }) => {
  // Determine display text based on role
  const displayText =
    role === 'owner' ? 'Owner' : role === 'admin' ? 'Admin' : '';

  // Return null if no role to display
  if (!displayText) {
    return null;
  }

  return <Text style={styles.roleText}>{displayText}</Text>;
};

const styles = StyleSheet.create({
  roleText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.lightblue,
    borderRadius: 10,
  },
});
