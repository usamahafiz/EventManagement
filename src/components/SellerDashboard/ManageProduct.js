// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, ActivityIndicator } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import axios from 'axios';

// const ManageEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingEvent, setEditingEvent] = useState(null);
//   const [newImage, setNewImage] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const API_BASE_URL = 'http://192.168.10.9:5000/api'; // Replace with your backend API URL

//   // Fetch events from MongoDB
//   const fetchEvents = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/readEvents`);
//       setEvents(response.data); // Assume API returns an array of events
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       Alert.alert('Error', 'Failed to fetch events.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // Handle delete event
//   const handleDeleteEvent = async (eventId, imageUrl) => {
//     Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Delete',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             await axios.delete(`${API_BASE_URL}/deleteEvents/${eventId}`); // Backend handles deletion of both the event and image
//             setEvents(events.filter((event) => event._id !== eventId));
//             Alert.alert('Success', 'Event deleted successfully!');
//           } catch (error) {
//             console.error('Error deleting event:', error);
//             Alert.alert('Error', 'Failed to delete event.');
//           }
//         },
//       },
//     ]);
//   };

//   // Handle image selection
//   const handleSelectImage = () => {
//     launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
//       if (response.didCancel || response.errorCode) return;
//       setNewImage(response.assets[0].uri);
//     });
//   };

//   // Handle save changes for editing event
//   const handleSaveChanges = async () => {
//     setSaving(true);
//     try {
//       let imageUrl = editingEvent.imageUrl;

//       if (newImage && newImage !== editingEvent.imageUrl) {
//         // Upload the new image
//         const formData = new FormData();
//         formData.append('file', {
//           uri: newImage,
//           name: `event_${Date.now()}.jpg`,
//           type: 'image/jpeg',
//         });

//         const uploadResponse = await axios.post(`${API_BASE_URL}/uploadedImage`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         imageUrl = uploadResponse.data.imageUrl; // New image URL from the backend
//       }

//       const updatedEvent = { ...editingEvent, imageUrl };

//       await axios.put(`${API_BASE_URL}/updateEvents/${editingEvent._id}`, updatedEvent);
//       setEvents(events.map((event) => (event._id === editingEvent._id ? updatedEvent : event)));
//       Alert.alert('Success', 'Event updated successfully!');
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       Alert.alert('Error', 'Failed to update event.');
//     } finally {
//       setSaving(false);
//       setEditingEvent(null);
//       setNewImage(null);
//     }
//   };

//   // Render an event item
//   const renderEventItem = ({ item }) => (
//     <View style={styles.eventCard}>
//       <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
//       <Text style={styles.eventTitle}>{item.title}</Text>
//       <Text style={styles.eventDate}>Date: {item.date}</Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button} onPress={() => setEditingEvent(item)}>
//           <Text style={styles.buttonText}>Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, styles.deleteButton]}
//           onPress={() => handleDeleteEvent(item._id, item.imageUrl)}
//         >
//           <Text style={styles.buttonText}>Delete</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Events</Text>
//       {loading ? (
//         <ActivityIndicator size="large" />
//       ) : (
//         <FlatList data={events} renderItem={renderEventItem} keyExtractor={(item) => item._id} />
//       )}

//       {editingEvent && (
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Edit Event</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Event Title"
//             value={editingEvent.title}
//             onChangeText={(text) => setEditingEvent({ ...editingEvent, title: text })}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Event Date"
//             value={editingEvent.date}
//             onChangeText={(text) => setEditingEvent({ ...editingEvent, date: text })}
//           />
//           <TouchableOpacity style={styles.button} onPress={handleSelectImage}>
//             <Text style={styles.buttonText}>Select New Image</Text>
//           </TouchableOpacity>
//           {newImage && <Image source={{ uri: newImage }} style={styles.eventImage} />}
//           <TouchableOpacity style={styles.button} onPress={handleSaveChanges} disabled={saving}>
//             {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Changes</Text>}
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={() => setEditingEvent(null)}>
//             <Text style={styles.buttonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#1d3557',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   eventCard: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   eventImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   eventTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: '#1d3557',
//   },
//   eventDate: {
//     fontSize: 16,
//     color: '#6c757d',
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   button: {
//     backgroundColor: '#1d3557',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     width: '48%',
//   },
//   deleteButton: {
//     backgroundColor: '#e63946',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   modalContainer: {
//     position: 'absolute',
//     top: '20%',
//     left: '5%',
//     right: '5%',
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#1d3557',
//   },
//   input: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 15,
//   },
// });

// export default ManageEvents;










import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, Modal, TextInput, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await firestore().collection('events').get();
        const eventsList = eventsSnapshot.docs.map((doc) => {
          const eventData = doc.data();
          console.log('Event Data:', eventData);  // Log the data to verify its structure
          return {
            id: doc.id,
            ...eventData,
          };
        });
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
        Alert.alert('Error', 'Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId, imageUrl) => {
    if (!imageUrl) {
      Alert.alert('Error', 'Image URL is missing!');
      return;
    }

    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const reference = storage().refFromURL(imageUrl);
            await reference.delete();
            await firestore().collection('events').doc(eventId).delete();
            setEvents(events.filter((event) => event.id !== eventId));
            Alert.alert('Success', 'Event deleted successfully!');
          } catch (error) {
            console.error('Error deleting event:', error);
            Alert.alert('Error', 'Failed to delete event.');
          }
        },
      },
    ]);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setNewImage(event.imageUrl);
    setModalVisible(true);
  };

  const handleSaveChanges = async () => {
    setSaving(true);

    try {
      const updatedEvent = { ...currentEvent };
      if (newImage && newImage !== currentEvent.imageUrl) {
        const reference = storage().refFromURL(currentEvent.imageUrl);
        await reference.delete();
        const imageUrl = await uploadImageToStorage(newImage);
        updatedEvent.imageUrl = imageUrl;
      }

      await firestore().collection('events').doc(currentEvent.id).update(updatedEvent);
      setEvents(events.map((event) => (event.id === currentEvent.id ? updatedEvent : event)));
      Alert.alert('Success', 'Event updated successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>Date: {item.date}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleEditEvent(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteEvent(item.id, item.imageUrl)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Events</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList data={events} renderItem={renderEventItem} keyExtractor={(item) => item.id} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    color: '#1d3557',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d3557',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#1d3557',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  deleteButton: {
    backgroundColor: '#e63946',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1d3557',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loadingText: {
    textAlign: 'center',
    color: '#1d3557',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 18,
    marginTop: 20,
  },
});

export default ManageEvents;






