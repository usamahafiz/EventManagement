import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Validation Schema for Formik
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // Handle User Registration with MongoDB
  const handleRegister = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      // Send the registration data to the backend (MongoDB)
      const response = await axios.post('http://192.168.10.9:5000/api/register', {
        email,
        password,
        role,
      });

      console.log(response.data.message); // Registration success message

      // Set success state to true to display success message
      setRegistrationSuccess(true);

      // Navigate to login screen after delay
      setTimeout(() => {
        navigation.navigate('LoginScreen');
      }, 2000); // Wait for 2 seconds before navigating
    }catch (error) {
        console.error('Full error:', {
          message: error.message,
          request: error.request,
          response: error.response,
          config: error.config
        });
    }
    setLoading(false);
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
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => handleRegister(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {/* Email Input */}
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

              {/* Password Input */}
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

              {/* Confirm Password Input */}
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                secureTextEntry
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              {/* Role Selection (Radio Buttons) */}
              <Text style={styles.label}>Select your role:</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[styles.radioButton, role === 'customer' && styles.selectedRadio]}
                  onPress={() => setRole('customer')}
                >
                  <Text style={styles.radioText}>Attendee</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, role === 'manager' && styles.selectedRadio]}
                  onPress={() => setRole('manager')}
                >
                  <Text style={styles.radioText}>Organizer</Text>
                </TouchableOpacity>
              </View>
              {!role && <Text style={styles.errorText}>Please select a role</Text>}

              {/* Loading Indicator or Register Button */}
              {loading ? (
                <ActivityIndicator size="large" color="#000" />
              ) : (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: role === 'Customer' ? '#4CAF50' : '#FF6347' }]} // Button color based on role
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
              )}

              {/* Navigate to Login */}
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.loginText}>Already have an account? Login here</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        {/* Success Message */}
        {registrationSuccess && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>Registration Successful, Welcome {role}!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign : 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginVertical: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    width: '48%',
    justifyContent: 'center',
    color: 'white',
  },
  selectedRadio: {
    backgroundColor: '#1d3557',
  
    
  },
  radioText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1d3557', // Default green button color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  loginText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  successMessage: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default RegisterScreen;











// import React, { useState } from 'react';
// import { doc, setDoc, serverTimestamp } from '../../config/firebase';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { auth, fireStore } from '../../../src/config/firebase'; // Adjust the path as needed
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// // import auth from '@react-native-firebase/auth'; // Firebase Authentication import
// import { useNavigation } from '@react-navigation/native';

// export default function Register() {
//   const [state, setState] = useState({  email: '', password: '' , fullName :'',});
//   const navigation = useNavigation();

//   const handleChange = (name, value) => {
//     setState((prevState) => ({ ...prevState, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     const { email, password , fullName } = state;

//     if (!email || !password || !fullName) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters');
//       return;
//     }

//     try {
//       // Firebase Authentication: Create a user
//       await createUserWithEmailAndPassword(auth, email, password);
//       Alert.alert('Success', 'User registered successfully');
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', error.message);
//     }

//        // Save user details to Firestore
//        await setDoc(doc(fireStore, 'users', user.uid), {
//         fullName,
//         email,
//         createdAt: serverTimestamp(),
//       });

//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>
//       <Text style={styles.title}>
//         Please fill your details
//       </Text>
// {/* 
//       <Text style={styles.title}>Register</Text> */}
//       <Text style={styles.label}>FullName</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your FullName"
//         // keyboardType="email-address"
//         value={state.fullName}
//         onChangeText={(value) => handleChange('fullName', value)}
//       />
//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your Email"
//         keyboardType="email-address"
//         value={state.email}
//         onChangeText={(value) => handleChange('email', value)}
//       />
//       <Text style={styles.label}>Password</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Password"
//         secureTextEntry
//         value={state.password}
//         onChangeText={(value) => handleChange('password', value)}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.link}>Already have an account? Login</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//     backgroundColor: '#1d3557',

//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: 'white',
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//     color: 'white',
    
//     // backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#000',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   link: {
    
//     textAlign: 'center',
//     color: '#fff',
//   },
// });








