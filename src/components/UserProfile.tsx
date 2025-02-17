import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface UserProfileProps {
  username: string;
  profileImage: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ username, profileImage }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: profileImage }} style={styles.image} />
      <Text style={styles.username}>{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8
  },
  username: {
    fontSize: 16
  }
});

export default UserProfile;
