import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';
import Colors from '../theme/colors';
// import IntroVideo from '../IntroVideo/IntroVideo.mp4'

const IntroVideo = require('../IntroVideo/IntroVideo.mp4');

const VideoPlayer = ({ OnSkipPress, setVideoStart }) => {
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlay = () => {
        setVideoStart(false)
        setIsPlaying(!isPlaying);
    };

    return (
        <View style={styles.container}>
            <Video
                source={require('../IntroVideo/IntroVideo.mp4')}

                onBuffer={error => {}}
                onError={error => {}}
                style={styles.backgroundVideo}
                resizeMode='contain'
                shouldPlay={true}
                paused={!isPlaying}


                onEnd={() => setVideoStart(false)}

            />
            <TouchableOpacity style={styles.skipButton} onPress={() => { togglePlay(), OnSkipPress() }}>
                <Text style={styles.skipButtonText}>{isPlaying ? 'Skip' : 'Skip'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Center video vertically
        alignItems: 'center', // Center video horizontally
        backgroundColor: Colors.backgroundColor, // Set background color to black for full screen effect
    },
    backgroundVideo: {
        width: width - 2, // Set width to screen height to play video in landscape mode
        height: height,// Set height to screen width to play video in landscape mode
        position: 'absolute',

    },
    skipButton: {
        position: 'absolute',
        bottom: width - 280,
        alignSelf: 'center',
        backgroundColor: Colors.secondaryColor,
        padding: 10,
        right: 20,
        borderRadius: 5,
        // transform: [{ rotate: '90deg' }], // Rotate video to landscape orientation

    },
    skipButtonText: {
        color: Colors.black,
        fontWeight: 'bold',
        fontSize: 14
    },
});

export default VideoPlayer;
