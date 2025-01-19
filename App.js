import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { FirebaseApp, initializeApp } from '@react-native-firebase/app';

const App = () => {
  // Ensure Firebase is initialized
  initializeApp();

  return <AppNavigator />;
};

export default App;









// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Login from './src/Screens/Auth/Login'; // Your Login component
// import Register from './src/Screens/Auth/Register'; // Your Register component
// import Home from './src/components/BuyerDashboard/ProductDetails'; // Your Home component
// import AddProduct from './src/components/SellerDashboard/AddProduct';
// import ManageProduct from './src/components/SellerDashboard/ManageProduct';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Login">
//         {/* Login Route */}
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={{
//             headerTitle: 'Login',
//             headerStyle: { backgroundColor: '#000' },
//             headerTintColor: '#fff',
//           }}
//         />

//         {/* Register Route */}
//         <Stack.Screen
//           name="Register"
//           component={Register}
//           options={{
//             headerTitle: 'Register',
//             headerStyle: { backgroundColor: '#000' },
//             headerTintColor: '#fff',
//           }}
//         />

//         <Stack.Screen
//         name="Home"
//         component={Home}
//         options={{
//           headerTitle: 'Home',
//           headerStyle: { backgroundColor: '#343a40' },
//           headerTintColor: '#fff',
//         }}
//         />

//         {/* Add Product Route */}
//         <Stack.Screen
//         name="AddProduct"
//         component={AddProduct}
//         options={{
//           headerTitle: 'Add Product',
//           headerStyle: { backgroundColor: '#28a745' },
//           headerTintColor: '#fff',
//         }}
//         />

//         {/* Manage Product Route */}
//         <Stack.Screen
//         name="ManageProduct"
//         component={ManageProduct}
//         options={{
//           headerTitle: 'Manage Product',
//           headerStyle: { backgroundColor: '#28a745' },
//           headerTintColor: '#fff',
//         }}
//         />

   
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

