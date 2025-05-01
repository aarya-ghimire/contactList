import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import {
  List,
  IconButton,
  Text,
  Divider,
  useTheme,
  Surface,
} from "react-native-paper";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { Contact } from "../context/ContactContext";

interface ContactListItemProps {
  contact: Contact;
  onPress: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({
  contact,
  onPress,
  onDelete,
  onToggleFavorite,
}) => {
  const theme = useTheme();

  // Generate a consistent color based on the contact's name
  const getAvatarColor = (name: string) => {
    const colors = [
      "#5C6BC0", // Indigo
      "#26A69A", // Teal
      "#EC407A", // Pink
      "#FFA726", // Orange
      "#42A5F5", // Light Blue
      "#66BB6A", // Light Green
      "#AB47BC", // Purple
      "#FF7043", // Deep Orange
    ];

    // Use the sum of character codes to pick a color
    const sum = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightActions}>
        <IconButton
          icon="delete"
          iconColor="#fff"
          size={24}
          style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
          onPress={() => onDelete(contact.id)}
        />
      </View>
    );
  };

  const avatarColor = getAvatarColor(contact.name);

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Surface style={styles.surfaceContainer} elevation={1}>
        <TouchableOpacity
          onPress={() => onPress(contact)}
          style={styles.container}
          activeOpacity={0.7}
        >
          {contact.imageUri ? (
            <Image
              source={{ uri: contact.imageUri }}
              style={styles.avatarImage}
            />
          ) : (
            <View
              style={[styles.avatarContainer, { backgroundColor: avatarColor }]}
            >
              <Text style={styles.avatarText}>
                {contact.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.contentContainer}>
            <Text style={styles.nameText}>{contact.name}</Text>
            <Text style={styles.phoneText}>{contact.phone}</Text>
            {contact.email && (
              <Text
                style={styles.emailText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {contact.email}
              </Text>
            )}
          </View>

          <IconButton
            icon={contact.isFavorite ? "star" : "star-outline"}
            iconColor={contact.isFavorite ? "#FFC107" : theme.colors.outline}
            size={24}
            onPress={() => onToggleFavorite(contact.id)}
            style={styles.favoriteButton}
          />
        </TouchableOpacity>
      </Surface>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  surfaceContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    color: "#263238",
  },
  phoneText: {
    fontSize: 14,
    color: "#78909C",
    marginBottom: 2,
  },
  emailText: {
    fontSize: 12,
    color: "#90A4AE",
    width: Dimensions.get("window").width - 140, // Account for avatar and favorite icon
  },
  favoriteButton: {
    marginRight: -8,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    borderRadius: 12,
    marginVertical: 6,
    marginRight: 16,
    overflow: "hidden",
  },
  deleteButton: {
    marginHorizontal: 10,
    justifyContent: "center",
    borderRadius: 8,
  },
});

export default ContactListItem;
