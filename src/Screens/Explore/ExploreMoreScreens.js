import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window'); // Get screen width and height

const ExploreMoreScreen = () => {
  const navigation = useNavigation();

  // Sample data for the carousel (images and titles)
  const carouselItems = [
    { id: '1', title: 'EventBrite', image: 'https://img.freepik.com/premium-photo/guitarist-stage-background_34200-131.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' },
    { id: '2', title: 'Enjoy your moment', image: 'https://img.freepik.com/premium-photo/audience-watching-concert-stage-night-concert-club_152520-770.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' },
    { id: '3', title: 'Chill with friends', image: 'https://img.freepik.com/premium-photo/people-walking-through-subway-station-colorful-lighting-night_665346-87302.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' },
  ];

  // Render carousel item
  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} />
      {/* Conditional styling for the first item */}
      {item.id === '1' ? (
        <View style={styles.textOverlay}>
          <Text style={styles.elegantText}>EventBrite</Text>
        </View>
      ) : (
        <View style={styles.textOverlay}>
          <Text style={styles.carouselTitle}>{item.title}</Text>
        </View>
      )}
    </View>
  );

  // Navigate to the Register Screen
  const handleExploreMore = () => {
    navigation.navigate('RegisterScreen'); // Navigate to Register Screen
  };

  return (
    <View style={styles.container}>
      {/* Fullscreen Carousel */}
      <FlatList
        data={carouselItems}
        renderItem={renderItem}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        pagingEnabled // Snap to each full screen carousel item
      />

      {/* Explore More Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleExploreMore}>
          <Text style={styles.buttonText}>Explore More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111', // Black background
  },
  carouselItem: {
    width: width, // Fullscreen width
    height: height, // Fullscreen height
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Cover entire screen
  },
  textOverlay: {
    position: 'absolute',
    top: '50%', // Center vertically
    left: 0,
    right: 0,
    transform: [{ translateY: -30 }], // Offset for perfect centering
    backgroundColor: 'rgba(7, 7, 7, 0.8)', // Semi-transparent black overlay
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  elegantText: {
    fontSize: 50,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#fff', // Gold color for elegance
    textAlign: 'center',
    textShadowColor: '#000', // Subtle shadow for depth
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 45,
    letterSpacing: 2, // Elegant spacing
  },
  carouselTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff', // White text
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 78, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 56 },
    shadowOpacity: 0.9,
    shadowRadius: 55,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExploreMoreScreen;


