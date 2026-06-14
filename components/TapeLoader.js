import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { Asset } from "expo-asset";

// Array of loader frames (images) that will be animated in sequence
const FRAMES = [
  require("../assets/loader/tape/tape5.png"),
  require("../assets/loader/tape/tape4.png"),
  require("../assets/loader/tape/tape3.png"),
  require("../assets/loader/tape/tape2.png"),
  require("../assets/loader/tape/tape1.png"),
];

// Component for measuring tape animation which is used during loading
export default function TapeLoader() {
    // State variable which keeps track of whether measuring tape frames have been loaded
    const [framesLoaded, setFramesLoaded] = useState(false);

    // State variable to track the current frame index
    const [idx, setIdx] = useState(0);

    // Timer reference
    const timerRef = useRef(null);

    // This function loads all measuring tape frames first
    useEffect(() => {
        let started = true;
        (async () => {
        try {
            // Downloading frames
            await Promise.all(FRAMES.map((m) => Asset.fromModule(m).downloadAsync()));

            // Updating framesLoaded to true, so the animation may begin
            if (started) setFramesLoaded(true);
        } catch (e) {}
        })();
        return () => {
            started = false;
        };
    }, []);

    // Animation function cycles frames
    useEffect(() => {
        // Do nothing if frames are not ready yet
        if (!framesLoaded) return;
        const interval = 1000 / 18;

        // starting timer
        timerRef.current = setInterval(() => {
            // modulo operator cycles back to first frame
            setIdx((i) => (i + 1) % 5); 
        }, interval);

        // Cleanup: stop the animation loop on unmount
        return () => clearInterval(timerRef.current);
    }, [framesLoaded, 18, 5]);

    // Width and height for the tape image
    const w = 200; 
    // tape is roughly 1/4 the height
    const h = 50; 

    return (
        <View style={ { width: w, height: h, alignItems:'center', justifyContent: 'center' }}>
            {framesLoaded && (
                // Rendering current measuring tape frame
                <Image
                source={FRAMES[idx]} 
                style={{ width: w, height: h, alignItems: "center", justifyContent: "center"  }}
                resizeMode="contain" 
                fadeDuration={0}/>
            ) }
        </View>
    );
}
