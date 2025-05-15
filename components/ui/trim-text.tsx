import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextLayoutEventData, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface TrimTextProps {
  text: string;
  style?: object;
  containerWidth: number; // Width available for the text
}

const TrimText: React.FC<TrimTextProps> = ({ text, style, containerWidth }) => {
  const [displayText, setDisplayText] = useState(text);
  const textRef = useRef<Text>(null);

  useEffect(() => {
    setDisplayText(text); // Reset display text when input text changes
  }, [text]);

  const handleTextLayout = (event: { nativeEvent: TextLayoutEventData }) => {
    const { lines } = event.nativeEvent;
    if (lines.length > 1 || (lines[0]?.width || 0) > containerWidth) {
      // Text overflows; trim it
      let trimmedText = text;
      let endIndex = text.length;
      while (endIndex > 0) {
        trimmedText = `${text.substring(0, endIndex - 1)}...`;
        setDisplayText(trimmedText);
        endIndex--;
        // Break early to avoid infinite loop; actual measurement happens on re-render
        break;
      }
    }
  };

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <Text
        ref={textRef}
        numberOfLines={1}
        ellipsizeMode="clip" // Use clip to manually handle ellipsis
        style={[styles.text, style]}
        onTextLayout={handleTextLayout}
      >
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  text: {
    fontSize: RFPercentage(1.6),
    fontWeight: 'bold',
  },
});

export default TrimText;
