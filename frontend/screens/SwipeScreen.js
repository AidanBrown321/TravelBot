import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import axios from "axios";
import DestinationCard from "../components/DestinationCard";

// For development, we'll use mock data
const mockDestinations = [
  {
    id: 1,
    name: "Paris, France",
    image_url:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description:
      "The City of Light offers iconic architecture, exquisite cuisine, and world-class art museums.",
  },
  {
    id: 2,
    name: "Bali, Indonesia",
    image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description:
      "A tropical paradise with beautiful beaches, lush rice terraces, and a vibrant cultural scene.",
  },
  {
    id: 3,
    name: "Tokyo, Japan",
    image_url:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description:
      "A bustling metropolis that seamlessly blends ultramodern and traditional aspects of Japanese culture.",
  },
  {
    id: 4,
    name: "New York City, USA",
    image_url:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description:
      "The Big Apple offers world-class dining, shopping, and entertainment in a fast-paced urban setting.",
  },
  {
    id: 5,
    name: "Santorini, Greece",
    image_url:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description:
      "Famous for its stunning sunsets, white-washed buildings, and crystal-clear waters.",
  },
];

const { width, height } = Dimensions.get("window");

const SwipeScreen = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch from the API
    // axios.get('http://localhost:8000/destinations')
    //   .then(response => {
    //     setDestinations(response.data);
    //     setLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching destinations:', error);
    //     setLoading(false);
    //   });

    // For now, use mock data
    setDestinations(mockDestinations);
    setLoading(false);
  }, []);

  const handleSwipe = (direction, destinationId) => {
    let swipeValue = "";

    if (direction === "left") {
      swipeValue = "no";
    } else if (direction === "right") {
      swipeValue = "yes";
    } else if (direction === "top") {
      swipeValue = "maybe";
    }

    // In a real app, we would send this to the API
    console.log(`Swiped ${swipeValue} on destination ${destinationId}`);

    // axios.post('http://localhost:8000/swipe', {
    //   user_id: 1, // In a real app, this would be the actual user ID
    //   destination_id: destinationId,
    //   swipe_value: swipeValue
    // })
    // .then(response => {
    //   console.log('Swipe recorded:', response.data);
    // })
    // .catch(error => {
    //   console.error('Error recording swipe:', error);
    // });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading destinations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {destinations.length > 0 ? (
        <Swiper
          cards={destinations}
          renderCard={(destination) => (
            <DestinationCard destination={destination} />
          )}
          onSwipedLeft={(cardIndex) =>
            handleSwipe("left", destinations[cardIndex].id)
          }
          onSwipedRight={(cardIndex) =>
            handleSwipe("right", destinations[cardIndex].id)
          }
          onSwipedTop={(cardIndex) =>
            handleSwipe("top", destinations[cardIndex].id)
          }
          cardIndex={0}
          backgroundColor="#f8f9fa"
          stackSize={3}
          stackSeparation={15}
          cardVerticalMargin={20}
          cardHorizontalMargin={10}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          verticalSwipe={true}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: "#e74c3c",
                  color: "white",
                  fontSize: 24,
                  borderRadius: 5,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: "YES!",
              style: {
                label: {
                  backgroundColor: "#2ecc71",
                  color: "white",
                  fontSize: 24,
                  borderRadius: 5,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
            top: {
              title: "MAYBE",
              style: {
                label: {
                  backgroundColor: "#f39c12",
                  color: "white",
                  fontSize: 24,
                  borderRadius: 5,
                  padding: 10,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                },
              },
            },
          }}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No more destinations to show!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#7f8c8d",
  },
});

export default SwipeScreen;
