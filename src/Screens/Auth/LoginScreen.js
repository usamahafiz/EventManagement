import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // Validation Schema for Formik
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  // Handle Login
  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      const response = await axios.post('http://192.168.10.9:5000/api/login', {
        email,
        password,
      });

      // Log the response to see its structure
      console.log('Response:', response.data); 

      // Correctly destructure the response
      const { token, user } = response.data;

      // Get role from user object
      const { role } = user;

      // Store the token
      await AsyncStorage.setItem('authToken', token);

      // Navigate based on role
      if (role === 'manager') {
        navigation.navigate('SellerDashboardScreen');
        Alert.alert('Login Successful', 'Welcome Manager!');
      } else if (role === 'customer') {
        navigation.navigate('BuyerDashboardScreen');
        Alert.alert('Login Successful', 'Welcome Customer!');
      } else {
        Alert.alert('Error', 'User role not recognized.');
      }
    } catch (error) {
      // Detailed error handling
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed. Please try again.';

      console.error('Login error:', errorMessage);
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = (email) => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }
    axios
      .post('http://yourserverurl:5000/forgot-password', { email })
      .then(() => {
        Alert.alert('Password Reset', 'Password reset email sent successfully.');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/bf/86/34/bf8634c094c572886ae8a9c3af14143c.jpg' }} // Logo URL
        style={styles.logo}
      />
      <ScrollView>
        <Text style={styles.restaurantName}>EventBrite</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              {loading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              )}

              {/* Forgot Password */}
              <TouchableOpacity onPress={() => handleForgotPassword(values.email)}>
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.registerText}>Don't have an account? Register here</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1d3557',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#1d3557',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1',
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1d3557',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#000',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
  registerText: {
    color: '#000',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
});

export default LoginScreen;









// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../config/firebase"; // Firebase Authentication

// export default function Login({ navigation }) {
//   const [state, setState] = useState({ email: "", password: "" });

//   const handleChange = (name, value) => {
//     setState((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     const { email, password } = state;

//     if (!email || !password) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       Alert.alert("Success", "Logged in successfully");
//       navigation.replace("Home");
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Email"
//         keyboardType="email-address"
//         value={state.email}
//         onChangeText={(value) => handleChange("email", value)}
//         placeholderTextColor="#999"
//       />
//       <Text style={styles.label}>Password</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Password"
//         secureTextEntry
//         value={state.password}
//         onChangeText={(value) => handleChange("password", value)}
//         placeholderTextColor="#999"
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate("Register")}>
//         <Text style={styles.link}>Don't have an account? Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#1d3557",
//   },
//   title: {
//     fontSize: 34,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#fff",
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     color: "white",
//   },
//   button: {
//     backgroundColor: "#000",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   link: {
//     fontWeight: "bold",
//     textAlign: "center",
//     color: "#fff",
//   },
// });


