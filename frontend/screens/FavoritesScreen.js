import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

// Mock data for favorites
const mockFavorites = [
  {
    id: 1,
    name: "Paris, France",
    image_url:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description:
      "The City of Light offers iconic architecture, exquisite cuisine, and world-class art museums.",
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
    id: 5,
    name: "Santorini, Greece",
    image_url:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description:
      "Famous for its stunning sunsets, white-washed buildings, and crystal-clear waters.",
  },
];

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState(mockFavorites);

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <Image source={{ uri: item.image_url }} style={styles.favoriteImage} />
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteName}>{item.name}</Text>
        <Text style={styles.favoriteDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't favorited any destinations yet!
          </Text>
          <TouchableOpacity style={styles.startSwipingButton}>
            <Text style={styles.startSwipingButtonText}>Start Swiping</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  favoriteItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteImage: {
    width: 120,
    height: 120,
  },
  favoriteInfo: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  favoriteDescription: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 20,
  },
  startSwipingButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  startSwipingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FavoritesScreen;
