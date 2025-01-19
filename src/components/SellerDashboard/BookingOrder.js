import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const BookingOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersSnapshot = await firestore().collection('orders').get();
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersList);
        setFilteredOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleRemoveOrder = async (orderId) => {
    try {
      await firestore().collection('orders').doc(orderId).delete();
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      setFilteredOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      Alert.alert('Success', 'Event cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling event:', error);
      Alert.alert('Error', 'Failed to cancel event.');
    }
  };

  const filterAndSortOrders = () => {
    let updatedOrders = [...orders];

    // Filter by location
    if (locationFilter) {
      updatedOrders = updatedOrders.filter((order) =>
        order.eventCategory.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Sort by date
    updatedOrders.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);

      if (sortOrder === 'asc') return dateA - dateB; // Ascending order
      if (sortOrder === 'desc') return dateB - dateA; // Descending order

      return 0;
    });

    setFilteredOrders(updatedOrders);
  };

  useEffect(() => {
    filterAndSortOrders();
  }, [locationFilter, sortOrder, orders]);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Image source={{ uri: item.eventImage }} style={styles.orderItemImage} />
      <View style={styles.orderItemDetails}>
        <Text style={styles.orderItemName}>{item.eventTitle}</Text>
        <Text style={styles.orderItemDescription}>{item.eventDescription}</Text>
        <Text style={styles.orderItemDescription}>Category: {item.eventCategory}</Text>
        <Text style={styles.orderItemLocation}>Location: {item.eventLocation}</Text>
        <Text style={styles.orderItemDate}>Date: {item.eventDate}</Text>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveOrder(item.id)}
        >
          <Text style={styles.buttonText}>Cancel Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booked Events</Text>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by:</Text>
        <TouchableOpacity onPress={() => setSortOrder('asc')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Date: Low to High</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOrder('desc')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Date: High to Low</Text>
        </TouchableOpacity>
      </View>

      {/* Location Filter */}
      <View style={styles.locationFilterContainer}>
        <Text style={styles.filterLabel}>Filter by Category:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Category"
          value={locationFilter}
          onChangeText={setLocationFilter}
        />
      </View>

      {/* Events List */}
      {filteredOrders.length === 0 ? (
        <Text style={styles.noOrdersText}>No events match your criteria!</Text>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6ffe6',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d3557',
    marginBottom: 20,
    textAlign: 'center',
  },
  sortContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  sortText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortButton: {
    marginLeft: 10,
    backgroundColor: '#4caf50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#fff',
  },
  locationFilterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    color: '#006400',
    marginBottom: 5,
  },
  textInput: {
    height: 40,
    borderColor: '#32CD32',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#d3d3d3',
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderColor: '#32CD32',
    borderWidth: 1,
  },
  orderItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  orderItemDetails: {
    marginLeft: 10,
    justifyContent: 'center',
    flex: 1,
  },
  orderItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006400',
  },
  orderItemDescription: {
    fontSize: 16,
    color: '#006400',
  },
  orderItemLocation: {
    fontSize: 14,
    color: '#006400',
  },
  orderItemDate: {
    fontSize: 14,
    color: '#006400',
  },
  removeButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noOrdersText: {
    fontSize: 18,
    color: '#006400',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default BookingOrder;



