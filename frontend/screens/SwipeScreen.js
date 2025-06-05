import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// Mock data (same as before)
const mockDestinations = [
  {
    id: 1,
    name: 'Paris, France',
    image_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
    description: 'The City of Light features iconic landmarks like the Eiffel Tower and world-class cuisine.'
  },
  {
    id: 2,
    name: 'Kyoto, Japan',
    image_url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
    description: 'Ancient temples, traditional gardens, and geisha culture in Japan\'s former capital.'
  },
  {
    id: 3,
    name: 'Santorini, Greece',
    image_url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
    description: 'Stunning white-washed buildings with blue domes overlooking the Aegean Sea.'
  },
  // Add more destinations as needed
];

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;

export default function SwipeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const maybeOpacity = position.y.interpolate({
    inputRange: [-SCREEN_HEIGHT / 6, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp'
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp'
  });

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: position.x, translationY: position.y } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === 4) {
      const { translationX, translationY } = event.nativeEvent;

      let direction = null;

      if (translationX > SWIPE_THRESHOLD) {
        direction = 'right';
      } else if (translationX < -SWIPE_THRESHOLD) {
        direction = 'left';
      } else if (translationY < -SWIPE_THRESHOLD) {
        direction = 'up';
      }

      if (direction) {
        // Complete the swipe animation
        Animated.timing(position, {
          toValue: {
            x: direction === 'right' ? SCREEN_WIDTH + 100 : direction === 'left' ? -SCREEN_WIDTH - 100 : 0,
            y: direction === 'up' ? -SCREEN_HEIGHT - 100 : 0
          },
          duration: 200,
          useNativeDriver: false
        }).start(() => {
          // Handle swipe action based on direction
          if (direction === 'right') {
            console.log('Added to favorites');
          } else if (direction === 'up') {
            console.log('Added to maybe list');
          }
          
          // Move to next card
          setCurrentIndex(prevIndex => prevIndex + 1);
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        // Reset card position
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: false
        }).start();
      }
    }
  };

  const renderCards = () => {
    if (currentIndex >= mockDestinations.length) {
      return (
        <View style={styles.endMessage}>
          <Text style={styles.endMessageText}>No more destinations to show!</Text>
          <Text>Pull down to refresh</Text>
        </View>
      );
    }

    return mockDestinations.map((destination, index) => {
      if (index < currentIndex) return null;

      if (index === currentIndex) {
        return (
          <PanGestureHandler
            key={destination.id}
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate: rotation }
                  ]
                }
              ]}
            >
              <Image
                source={{ uri: destination.image_url }}
                style={styles.image}
              />
              <View style={styles.cardContent}>
                <Text style={styles.name}>{destination.name}</Text>
                <Text style={styles.description}>{destination.description}</Text>
              </View>

              <Animated.View style={[styles.swipeHint, styles.leftHint, { opacity: nopeOpacity }]}>
                <Ionicons name="close-circle" size={50} color="red" />
                <Text style={styles.hintText}>Nope</Text>
              </Animated.View>
              
              <Animated.View style={[styles.swipeHint, styles.topHint, { opacity: maybeOpacity }]}>
                <Ionicons name="help-circle" size={50} color="blue" />
                <Text style={styles.hintText}>Maybe</Text>
              </Animated.View>
              
              <Animated.View style={[styles.swipeHint, styles.rightHint, { opacity: likeOpacity }]}>
                <Ionicons name="heart-circle" size={50} color="green" />
                <Text style={styles.hintText}>Like</Text>
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        );
      }

      return (
        <Animated.View
          key={destination.id}
          style={[
            styles.card,
            {
              opacity: nextCardOpacity,
              transform: [{ scale: nextCardScale }],
              zIndex: mockDestinations.length - index
            }
          ]}
        >
          <Image
            source={{ uri: destination.image_url }}
            style={styles.image}
          />
          <View style={styles.cardContent}>
            <Text style={styles.name}>{destination.name}</Text>
            <Text style={styles.description}>{destination.description}</Text>
          </View>
        </Animated.View>
      );
    }).reverse();
  };

  return (
    <View style={styles.container}>
      {renderCards()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  swipeHint: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftHint: {
    top: 30,
    left: 30,
  },
  rightHint: {
    top: 30,
    right: 30,
  },
  topHint: {
    top: 50,
    alignSelf: 'center',
  },
  hintText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  endMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  endMessageText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});