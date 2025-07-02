export const apiKey = 'AIzaSyBNOZn8be1ix47uhHa8cRc385pJhsW8OEs'
// export const apiKey = 'AIzaSyATTgMgx1CkzrcTjaJ3Y7clEdpMd51-WLo'
import axios from 'axios';

//export const GRAPHQL_ENDPOINT = 'https://backendproduction.switcherooapp.com';
export const GRAPHQL_ENDPOINT = 'https://backendtesting.switcherooapp.com';
// export const GRAPHQL_ENDPOINT = 'https://appreciated-nirvana-cruz-swing.trycloudflare.com';
// export const GRAPHQL_ENDPOINT = 'https://backendtest.switcherooapp.com/';


export const getAddressFromLatLng = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    if (response.data.results.length > 0) {
      const addressComponents = response.data.results[0].address_components;

      let city = '';
      let zipCode = '';

      addressComponents.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          zipCode = component.long_name;
        }
      });

      return zipCode ? `${city}, ${zipCode}` : city; // Returns "City, Zip" or just "City"
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    throw new Error('Error fetching address: ' + error.message);
  }
};

// export const getAddressFromLatLng = async (latitude, longitude) => {
//   try {

//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
//     );


//     if (response.data.results.length > 0) {
//       const address = response.data.results[0].formatted_address;

//       return address

//     } else {
//       throw new Error('No results found');
//     }
//   } catch (error) {
//     throw new Error('Error fetching address: ' + error);
//   }
// };


export const getChatlist = () => {
  const graphqlQuerychat = {
    query: `
      query Chat {
         chat {
        createdAt
        createdByUserId
        id
        messageReadAt
        messageText
        offerId
        cash
        targetItem {
            askingPrice
            categories
            createdByUserId
            description
            flexibilityRange
            id
            imageUrls
            isFlexible
            isHidden
            isSwapOnly
            latitude
            longitude
            mainImageUrl
            title
            updatedByUserId
        }
        targetUser {
            avatarUrl
            blurb
            createdAt
            dateOfBirth
            distance
            email
            fCMToken
            firstName
            gender
            id
            isChatNotificationsEnabled
            isMatchNotification
            lastName
            latitude
            longitude
            mobile
            username
        }
         sourceItem {
            askingPrice
            categories
            createdByUserId
            description
            flexibilityRange
            id
            imageUrls
            isFlexible
            isHidden
            isSwapOnly
            latitude
            longitude
            mainImageUrl
            title
            updatedByUserId
        }
            offer {
            cash
            confirmedBySourceUser
            confirmedByTargetUser
            createdAt
            createdByUserId
            deletedAt
            deletedByUserId
            id
            isDeleted
            sourceItemId
            sourceStatus
            targeteStatus
            targetItemId
        }
    }
      }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, graphqlQuerychat)
    .then(response => {
      // Handle the response data
      return response.data;  // You can return the data here for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
};

export const getMyallItems = () => {
  const graphqlQuerychat = {
    query: `
     query Me {
    me {
      avatarUrl
      distance
      email
      firstName
      id
      username
      longitude
          latitude
      items {
        askingPrice
        categories
        createdByUserId
        description
        flexibilityRange
        id
        imageUrls
        isFlexible
        isHidden
        isSwapOnly
        latitude
        longitude
        mainImageUrl
        title
        offeringId
      }
      lastName
    }
  }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, graphqlQuerychat)
    .then(response => {
      // Handle the response data
      return response.data;  // You can return the data here for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
};


export const getSwipeInfo = () => {
  const graphqlQuery = {
    query: `
     query SwipeInfo {
        swipeInfo {
          currentSwipeNumber
          message
          remainingSwipes
          wasLocked
        }
     }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, graphqlQuery)
    .then(response => {
      if (response.data.errors) {
        // If GraphQL returns any errors, handle them here
        console.error('GraphQL Errors:', response.data.errors);
        throw response.data.error
      }
      // Handle and return the data
      return response.data.data;  // Returning the data from the `swipeInfo` query
    })
    .catch(error => {
      // Improved error handling
      console.error('Network or server error:', error.message || error);
      throw error;  // Rethrow the error so it can be handled by the caller
    });
};

export const getallchMessages = (offerId) => {
  const graphqlQuery = {
    query: `
      query {
        messages(offerId: "${offerId}") {
          createdAt
          createdByUserId
          id
          messageReadAt
          messageText
          offerId
          targetUser {
            avatarUrl
            blurb
            createdAt
            dateOfBirth
            distance
            email
            fCMToken
            firstName
            gender
            id
            isChatNotificationsEnabled
            isMatchNotification
            lastName
            latitude
            longitude
            mobile
            username
          }
        }
      }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, graphqlQuery)
    .then(response => {
      // Handle the response data
      return response.data; // Return the data for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
      throw error; // Rethrow the error for handling it where the function is called
    });
};

export const confirmOffer = (offerId) => {
  const graphqlQuery = {
    query: `
      mutation {
        confirmOffer(offerId: "${offerId}") {
          cash
          confirmedBySourceUser
          confirmedByTargetUser
          id
        
        }
      }
    `
  };

  console.log({ graphqlQuery, GRAPHQL_ENDPOINT });

  return axios.post(GRAPHQL_ENDPOINT, graphqlQuery)
    .then(response => {
      // Handle the response data
      return response.data; // Return the data for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
      throw error; // Rethrow the error for handling it where the function is called
    });
};


export const fetchLatestAppVersion = async () => {
  const query = `
    query {
      latestAppVersion {
        androidVersion
        createdAt
        createdByUserId
        id
        iOSVersion
        updatedAt
        updatedByUserId
      }
    }
  `;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: query,
    });

    // Extract the relevant data from the response
    const { data } = response.data;

    console.log('data', data);

    return data.latestAppVersion; // Return the latest app version data
  } catch (error) {
    console.error('Error fetching the latest app version:', error);
    throw error; // Rethrow the error for handling where this function is called
  }
};
export const createMessage = (messageText, offerId, cash) => {

  const graphqlMutation = cash ? {
    query: `
      mutation CreateMessage {
        createMessage(
          message: {
            cash: ${cash},
            messageText: "${messageText}",
            offerId: "${offerId}"
          }
        ) {
          createdAt
          createdByUserId
          id
          messageReadAt
          messageText
          offerId
          userId
          cash
        }
      }
    `
  } : {
    query: `
      mutation CreateMessage {
        createMessage(message: { messageText: "${messageText}", offerId: "${offerId}"}) {
          createdAt
          createdByUserId
          id
          messageReadAt
          messageText
          offerId
        }
      }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, graphqlMutation)
    .then(response => {
      // Handle the response data
      return response.data; // Return the data for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error creating message:', error);
      throw error; // Rethrow the error for handling it where the function is called
    });
};
export const unMatchOffer = (offerId) => {
  const graphqlMutation = {
    query: `
      mutation UnmatchOffer {
        unmatchOffer(offerId: "${offerId}")
      }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, graphqlMutation)
    .then(response => {
      // Handle the response data
      return response.data; // Return the data for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error creating message:', error);
      throw error; // Rethrow the error for handling it where the function is called
    });
};
export const markmessageasread = (offerId) => {
  const graphqlMutation = {
    query: `
      mutation MarkMessagesAsRead {
        markMessagesAsRead(offerId: "${offerId}") {
          cash
          createdAt
          id
          sourceItemId
          sourceStatus
          targeteStatus
          targetItemId
        }
      }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, graphqlMutation)
    .then(response => {
      // Handle the response data
      return response.data; // Return the data for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error marking message as read:', error);
      throw error; // Rethrow the error for handling it where the function is called
    });
};


export const GetAllNotification = async () => {
  const query = `query UserSystemNotifications {
    userSystemNotifications {
        createdAt
        data
        id
        isRead
        message
        navigateTo
        readAt
        title
        type
        userId
    }
}
  `;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: query,
    });

    // Process the response data
    return response.data?.data;
  } catch (error) {
    console.log('Error fetching notifications:', error);
    throw error;
  }
};
export const GetAllUnreadNotification = async () => {
  const query = `query UserUnReadSystemNotifications {
    userUnReadSystemNotifications {
        createdAt
        data
        id
        isRead
        message
        navigateTo
        readAt
        title
        type
        userId
    }
}

  `;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: query,
    });


    return response.data?.data

  } catch (error) {
    console.log('Error fetching unread notifications:', error);
    throw error;
  }
};


export const markNotificationAsRead = async (id) => {
  const mutation = `
    mutation MarkSystemNotificationAsRead {
      markSystemNotificationAsRead(id: "${id}")
    }
  `;

  try {
    // Send the mutation using Axios
    const response = await axios.post(
      GRAPHQL_ENDPOINT,
      {
        query: mutation,
      },
      {
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      }
    );

    // Handle the response
    if (response.data.errors) {
      console.error('GraphQL errors:', response.data.errors);
      return { success: false, errors: response.data.errors };
    }

    // Return the response data
    return response.data.data.markSystemNotificationAsRead;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
};


export const getNotificationCount = () => {
  const query = {
    query: `
    {
        notificationCount
    }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, query)
    .then(response => {
      // Handle the response data
      return response.data;  // You can return the data here for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error)()()()()()()()()()()()()(()()()):', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
};
export const getUnreadNotificationount = () => {
  const query = {
    query: `
      query {
        userSystemNotificationUnReadCount
      }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, query)
    .then(response => {
      // Handle the response data and return the unread notification count
      return response.data.data.userSystemNotificationUnReadCount;
    })
    .catch(error => {
      // Handle errors properly
      console.error('Error fetching unread notification count:', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
};

export const getmessageCount = () => {
  const query = {
    query: `
    {
        messagesCount
    }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, query)
    .then(response => {
      // Handle the response data
      return response.data;  // You can return the data here for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error)()()()()()()()()()()()()(()()()):', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
};
export const markMesegecountzero = () => {
  const mutation = {
    query: `
    mutation {
        markmessageCountZero
    }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, mutation)
    .then(response => {
      // Handle the response data
      return response.data;  // You can return the data here for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error)()()()()()()()()()()()()(()()()):', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
};
export const markNotificationAszero = () => {
  const mutation = {
    query: `
    mutation {
        markNotificationAsRead
    }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, mutation)
    .then(response => {
      // Handle the response data
      return response.data;  // You can return the data here for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error)()()()()()()()()()()()()(()()()):', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
};



export const updateItemLocation = (itemId, latitude, longitude) => {

  const mutation = {
    query: `   mutation {
            updateItemLocation(itemId: "${itemId}", latitude: ${latitude}, longitude: ${longitude})
        }
     `
  };


  return axios.post(GRAPHQL_ENDPOINT, mutation)
    .then(response => {
      // Handle the response data
      return response.data;  // You can return the data here for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error)()()()()()()()()()()()()(()()()):', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
}


export const updateAllItemsLocation = (userId, latitude, longitude) => {


  const mutation = {
    query: `
   mutation {
            updateAllItemsLocation(userId: "${userId}", latitude: ${latitude}, longitude: ${longitude}) 
           }
    `
  };


  return axios.post(GRAPHQL_ENDPOINT, mutation)
    .then(response => {
      // Handle the response data
      return response.data;  // You can return the data here for further processing
    })
    .catch(error => {
      // Handle errors
      console.error('Error)()()()()()()()()()()()()(()()()):', error);
      throw error;  // Rethrow the error for handling it where the function is called
    });
}


export const SendCOdverifayAccount = (email) => {
  const mutation = `
    mutation {
      resetPasswordInitiate(email: "${email}")
    }
  `;

  return axios.post(GRAPHQL_ENDPOINT, {
    query: mutation
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};




export const OtpverifayAccount = (email, verificationCode) => {
  const mutation = `
    mutation {
      retrieveResetPasswordToken(email: "${email}", verificationCode: "${verificationCode}")
    }
  `;

  return axios.post(GRAPHQL_ENDPOINT, {
    query: mutation
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};



export const UserNameUpdate = (firstName, lastName) => {
  const mutation = `
    mutation UpdateUserName {
      updateUserName(firstName: "${firstName}", lastName: "${lastName}") {
        username
      }
    }
  `;

  return axios.post(GRAPHQL_ENDPOINT, {
    query: mutation
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const createItem = async (itemData) => {
  const imageUrlsString = itemData.imageUrls.map(url => `"${url}"`).join(', ');

  // const query = `
  //   mutation CreateItem {
  //     createItem(
  //       item: {
  //         askingPrice: ${itemData.askingPrice}
  //         categories: "${itemData.categories}"
  //         description: "${itemData.description}"
  //         imageUrls: [${imageUrlsString}]
  //         isSwapOnly: ${itemData.isSwapOnly}
  //         latitude: ${itemData.latitude}
  //         longitude: ${itemData.longitude}
  //         mainImageUrl: "${itemData.mainImageUrl}"
  //         title: "${itemData.title}"
  //       }
  //     ) {
  //       askingPrice
  //       categories
  //       createdByUserId
  //       description
  //       id
  //       imageUrls
  //       isFlexible
  //       isHidden
  //       isSwapOnly
  //       latitude
  //       longitude
  //       mainImageUrl
  //       title
  //       updatedByUserId
  //     }
  //   }
  // `;


  const query = `
    mutation CreateItem(
  $askingPrice: Decimal!,
  $categories: [String!]!,
  $description: String!,
  $imageUrls: [String!]!,
  $isSwapOnly: Boolean!,
  $latitude: Decimal!,
  $longitude: Decimal!,
  $mainImageUrl: String!,
  $title: String!,
  $offeringId: Int!
) {
  createItem(
    item: {
      askingPrice: $askingPrice
      categories: $categories
      description: $description
      imageUrls: $imageUrls
      isSwapOnly: $isSwapOnly
      latitude: $latitude
      longitude: $longitude
      mainImageUrl: $mainImageUrl
      title: $title
      offeringId: $offeringId
    }
  ) {
    askingPrice
    categories
    createdByUserId
    description
    id
    imageUrls
    isFlexible
    isHidden
    isSwapOnly
    latitude
    longitude
    mainImageUrl
    title
    offeringId
    updatedByUserId
  }
}

  `;


  const variables = {
    askingPrice: itemData.askingPrice,
    categories: itemData.categories,
    description: itemData.description,
    imageUrls: itemData.imageUrls,
    isSwapOnly: itemData.isSwapOnly,
    latitude: itemData.latitude,
    longitude: itemData.longitude,
    mainImageUrl: itemData.mainImageUrl,
    title: itemData.title,
    offeringId: itemData.offeringId
  };

  return axios.post(GRAPHQL_ENDPOINT, {
    query: query,
    variables
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log('Response:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const CreateFeedBack = async (feedbackInput) => {
  try {
    const mutation = `
      mutation CreateFeedback($feedbackInput: FeedbackInput!) {
        createFeedback(feedback: $feedbackInput) {
          createdAt
          createdByUserId
          description
          id
          status
          title
          updatedAt
          updatedByUserId
        }
      }
    `;
    const response = await axios.post(
      GRAPHQL_ENDPOINT,
      {
        query: mutation,
        variables: {
          feedbackInput, // Make sure this object matches the expected structure
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error('Error:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const getCategory = async () => {
  const query = `query Categories {
    categories {
        id
        name
    }
}
`;
  return axios.post(GRAPHQL_ENDPOINT, {
    query: query
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const getCategoriesByOffering = async (offeringId) => {
  const query = `query CategoriesByOffering($offeringId: Int!) {
    categoriesByOffering(offeringId: $offeringId) {
        id
        name
        offeringId
        subCategories {
            id
            name
            offeringId
        }
    }
  }`;

  console.log('offeringId', offeringId);

  return axios.post(GRAPHQL_ENDPOINT, {
    query: query,
    variables: { offeringId }
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};


export const getMadeOffer = async () => {
  const query = `
  query CreatedOffers {
    createdOffers {
      cash
      createdAt
      id
      sourceItemId
      sourceStatus
      targeteStatus
      targetItemId
      targetItem {
            askingPrice
            categories
            createdByUserId
            description
            flexibilityRange
            id
            imageUrls
            isFlexible
            isHidden
            isSwapOnly
            latitude
            longitude
            mainImageUrl
            title
            updatedByUserId
        }
        sourceItem {
            askingPrice
            categories
            createdByUserId
            description
            flexibilityRange
            id
            imageUrls
            isFlexible
            isHidden
            isSwapOnly
            latitude
            longitude
            mainImageUrl
            title
            updatedByUserId
        }
    }
  }
`;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: query
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error in getCreatedOffers:', error);
    throw error;
  }
};

export const getReciveOffers = async () => {
  const query = `
   query {
    receivedOffers {
      id
      cash

sourceStatus,
targeteStatus
      messages {
        messageText
      }
      sourceItem {
        id
        imageUrls
        title
        description
        askingPrice
        mainImageUrl
          latitude
        longitude
      }
      targetItem {
        id
        imageUrls
        title
        description
        askingPrice
        mainImageUrl
          latitude
        longitude
      }
    }
  }
`;

  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, {
      query: query
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error in getCreatedOffers:', error);
    throw error;
  }
};



export const loginWithGoogleMutation = async (idToken, gender, dateOfBirth) => {
  try {

    const graphqlQuery = {
      query: `
    mutation signInGoogle($idToken: String!,$gender: String!,$dateOfBirth: String!) {
      signInGoogle(idToken: $idToken,gender: $gender,dateOfBirth: $dateOfBirth) {
        avatarUrl
        blurb
        createdAt
        dateOfBirth
        distance
        email
        fCMToken
        firstName
        gender
        id
        initiateSignUpProcess
        isChatNotificationsEnabled
        isMatchNotification
        itemCount
        lastName
        latitude
        longitude
        matchedItemCount
        mobile
        unMatchedItemCount
        username
      }
    }
  `,
      variables: {
        idToken: idToken,
        gender: gender,
        dateOfBirth: dateOfBirth
      }
    };


    const response = await axios.post(GRAPHQL_ENDPOINT, graphqlQuery);
    return response.data;


  } catch (error) {
    return error
  }
}



export const loginWithAppleMutation = async (accessToken, name) => {
  try {
    const graphqlQuery = {
      query: `
        mutation SignInApple($accessToken: String!, $name: String!) {
          signInApple(accessToken: $accessToken, name: $name) {
            avatarUrl
            blurb
            createdAt
            dateOfBirth
            distance
            email
            fCMToken
            firstName
            gender
            id
            initiateSignUpProcess
            isChatNotificationsEnabled
            isMatchNotification
            itemCount
            lastName
            latitude
            longitude
            matchedItemCount
            mobile
            unMatchedItemCount
            username
            userRoles
          }
        }
      `,
      variables: {
        accessToken: accessToken,
        name: name
      }
    };

    const response = await axios.post(GRAPHQL_ENDPOINT, JSON.stringify(graphqlQuery), {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};



export const loginWithFacebookMutation = async (accessToken) => {
  try {
    const graphqlQuery = {
      query: `
        mutation signInFacebook($accessToken: String!) {
          signInFacebook(accessToken: $accessToken) {
            avatarUrl
            blurb
            createdAt
            dateOfBirth
            distance
            email
            fCMToken
            firstName
            gender
            id
            initiateSignUpProcess
            isChatNotificationsEnabled
            isMatchNotification
            itemCount
            lastName
            latitude
            longitude
            matchedItemCount
            mobile
            unMatchedItemCount
            username
          }
        }
      `,
      variables: {
        accessToken: accessToken
      }
    };

    const response = await axios.post(GRAPHQL_ENDPOINT, graphqlQuery);
    return response.data;

  } catch (error) {
    console.error('Error in loginWithFacebookMutation:', error);
    return error;
  }
}



export const reportAnitem = async (itemId, title, description) => {

  const mutation = `
    mutation {
      createItemComplaint(
        complaint: {
          title: "${title}",
          description: "${description}",
          isSolved:false
        }
        itemId: "${itemId}"
      ) {
        id
      }
    }
  `;


  return axios.post(GRAPHQL_ENDPOINT, {
    query: mutation
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};




export const ComplaintAgainstuser = async (userId, title, description) => {

  const mutation = `
    mutation {
      createUserComplaint(
        userId: "${userId}",
        complaint: {
          title: "${title}",
          description: "${description}"
           isSolved:false,

        }
      ) {
        id
      }
    }
  `;


  return axios.post(GRAPHQL_ENDPOINT, {
    query: mutation
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};



export const ContactUs = async (title, name, email, description) => {

  const mutation = `
    mutation {
    createUserContactUs(contactUs:{
    title:"${title}",
    name:"${name}",
    email:"${email}",
    description:"${description}",
 }) {
        id
    name
    title
    description
      }
    }
  `;


  return axios.post(GRAPHQL_ENDPOINT, {
    query: mutation
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const SendCashOffer = async (targetItemId, cash) => {

  const mutation = `
    mutation {
      createOffer(
        targetItemId: "${targetItemId}",
        cash: ${cash},
        targeteStatus: ${0}
      ) {
        cash
        createdAt
        id
        targeteStatus
        targetItemId
      }
    }
  `;

  return axios.post(GRAPHQL_ENDPOINT, {
    query: mutation
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
};

export const getUserInfo = (userId) => {
  const graphqlUserQuery = {
    query: `
      query UserInfo {
        userInfo(userId: "${userId}") {
          avatarUrl
          blurb
          createdAt
          dateOfBirth
          deletedAt
          deletedByUserId
          distance
          email
          fCMToken
          firstName
          gender
          id
          initiateSignUpProcess
          isChatNotificationsEnabled
          isDeleted
          isMatchNotification
          itemCount
          lastName
          latitude
          longitude
          matchedItemCount
          mobile
          unMatchedItemCount
          username
          userRoles
        }
      }
    `
  };

  return axios.post(GRAPHQL_ENDPOINT, graphqlUserQuery)
    .then(response => {
      return {
        ...response?.data,
        status: response?.status
      };
    })
    .catch(error => {
      console.error('Error fetching user info', error);
      throw error;
    });
};

// export const SendCashOffer = async (targetItemId, cash) => {

//   const mutation = `
//     mutation {
//       createCashOffer(
//         targetItemId: "${targetItemId}",
//         sourceStatus: 1,
//         targeteStatus: 1,
//         cash: ${cash}  
//       ) {
//         id
//         sourceStatus
//         targeteStatus
//       }
//     }
//   `;

//   return axios.post(GRAPHQL_ENDPOINT, {
//     query: mutation
//   }, {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(response => {
//       return response.data;
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       throw error;
//     });
// };





