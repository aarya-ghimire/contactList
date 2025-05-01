import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  IconButton,
  Surface,
  Divider,
  useTheme,
  Card,
  Avatar,
  List,
  FAB,
  Dialog,
  Portal,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Contact, useContacts } from "../../context/ContactContext";
import { contactSchema } from "../../utils/validation";
import * as ImagePicker from "expo-image-picker";

type FormData = {
  name: string;
  phone: string;
  email: string;
  imageUri?: string;
};

export default function ContactDetailScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { contacts, updateContact, toggleFavorite, deleteContact } =
    useContacts();
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: currentContact?.name || "",
      phone: currentContact?.phone || "",
      email: currentContact?.email || "",
      imageUri: currentContact?.imageUri || "",
    },
    resolver: yupResolver(contactSchema),
  });

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

  // Find the contact by ID when the component mounts
  useEffect(() => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      setCurrentContact(contact);
      setImageUri(contact.imageUri || null);
      reset({
        name: contact.name,
        phone: contact.phone,
        email: contact.email || "",
        imageUri: contact.imageUri || "",
      });
    } else {
      // Contact not found, go back to the contact list
      router.back();
    }
  }, [id, contacts, reset, router]);

  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    // Launch the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      // Use the first selected asset
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setValue("imageUri", uri);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!currentContact) return;

    try {
      await updateContact({
        ...currentContact,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email ? data.email.trim() : undefined,
        imageUri: data.imageUri,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (currentContact) {
      await toggleFavorite(currentContact.id);
    }
  };

  const handleCall = () => {
    if (currentContact) {
      Linking.openURL(`tel:${currentContact.phone}`);
    }
  };

  const handleEmail = () => {
    if (currentContact && currentContact.email) {
      Linking.openURL(`mailto:${currentContact.email}`);
    }
  };

  const handleDeleteContact = async () => {
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (currentContact) {
      await deleteContact(currentContact.id);
      setDeleteDialogVisible(false);
      router.back();
    }
  };

  const cancelDelete = () => {
    setDeleteDialogVisible(false);
  };

  if (!currentContact) {
    return null; // Loading state, could add a spinner here
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {isEditing ? (
        <ScrollView>
          <Surface style={styles.formCard} elevation={0}>
            {/* Profile Picture Edit */}
            <TouchableOpacity
              style={styles.imagePickerContainer}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.profileImage} />
              ) : (
                <View
                  style={[
                    styles.placeholderContainer,
                    { backgroundColor: getAvatarColor(currentContact.name) },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {currentContact.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <IconButton
                icon="camera"
                size={24}
                style={styles.cameraButton}
                mode="contained"
                containerColor={theme.colors.primary}
                iconColor="#FFFFFF"
                onPress={pickImage}
              />
            </TouchableOpacity>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    error={!!errors.name}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                  />
                  {errors.name && (
                    <HelperText type="error">{errors.name.message}</HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Phone"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    keyboardType="phone-pad"
                    error={!!errors.phone}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="phone" />}
                  />
                  {errors.phone && (
                    <HelperText type="error">{errors.phone.message}</HelperText>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Email (optional)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    mode="outlined"
                    keyboardType="email-address"
                    error={!!errors.email}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    left={<TextInput.Icon icon="email" />}
                  />
                  {errors.email && (
                    <HelperText type="error">{errors.email.message}</HelperText>
                  )}
                </View>
              )}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => setIsEditing(false)}
                style={styles.cancelButton}
                contentStyle={styles.buttonContent}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                style={styles.saveButton}
                contentStyle={styles.buttonContent}
              >
                Save
              </Button>
            </View>
          </Surface>
        </ScrollView>
      ) : (
        <ScrollView>
          <Surface style={styles.headerCard} elevation={0}>
            <View style={styles.favoriteContainer}>
              <IconButton
                icon={currentContact.isFavorite ? "star" : "star-outline"}
                iconColor={currentContact.isFavorite ? "#FFC107" : "#9E9E9E"}
                size={28}
                onPress={handleToggleFavorite}
                style={styles.favoriteButton}
              />
            </View>

            {/* Profile Picture Display */}
            {currentContact.imageUri ? (
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => setIsEditing(true)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: currentContact.imageUri }}
                  style={styles.avatarImage}
                />
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.avatarContainer,
                  { backgroundColor: getAvatarColor(currentContact.name) },
                ]}
              >
                <Text style={styles.avatarText}>
                  {currentContact.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <Text style={styles.name}>{currentContact.name}</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleCall}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <MaterialCommunityIcons name="phone" size={22} color="#fff" />
                </View>
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>

              {currentContact.email && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleEmail}
                >
                  <View
                    style={[
                      styles.actionIconContainer,
                      { backgroundColor: theme.colors.secondary },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="email"
                      size={22}
                      color="#fff"
                    />
                  </View>
                  <Text style={styles.actionText}>Email</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsEditing(true)}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: theme.colors.tertiary },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={22}
                    color="#fff"
                  />
                </View>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDeleteContact}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: theme.colors.error },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={22}
                    color="#fff"
                  />
                </View>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Surface>

          <Card style={styles.infoCard}>
            <Card.Title
              title="Contact Information"
              left={(props) => <Avatar.Icon {...props} icon="account" />}
            />
            <Card.Content>
              <List.Item
                title="Phone"
                description={currentContact.phone}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="phone"
                    color={theme.colors.primary}
                  />
                )}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="phone"
                    iconColor="#fff"
                    style={[
                      styles.callButton,
                      { backgroundColor: theme.colors.primary },
                    ]}
                    size={20}
                    onPress={handleCall}
                  />
                )}
                descriptionStyle={styles.contactValue}
              />

              {currentContact.email && (
                <List.Item
                  title="Email"
                  description={currentContact.email}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="email"
                      color={theme.colors.secondary}
                    />
                  )}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="email"
                      iconColor="#fff"
                      style={[
                        styles.emailButton,
                        { backgroundColor: theme.colors.secondary },
                      ]}
                      size={20}
                      onPress={handleEmail}
                    />
                  )}
                  descriptionStyle={styles.contactValue}
                />
              )}
            </Card.Content>
          </Card>
        </ScrollView>
      )}

      <Portal>
        <Dialog
          visible={deleteDialogVisible}
          onDismiss={cancelDelete}
          style={styles.dialog}
        >
          <Dialog.Title>Delete Contact</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete this contact? This action cannot
              be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={cancelDelete} textColor={theme.colors.primary}>
              Cancel
            </Button>
            <Button
              onPress={confirmDelete}
              buttonColor={theme.colors.error}
              textColor="#FFFFFF"
              style={styles.deleteButton}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    alignItems: "center",
    padding: 24,
    marginBottom: 16,
    position: "relative",
    borderRadius: 0,
  },
  formCard: {
    padding: 16,
    margin: 16,
    borderRadius: 16,
  },
  favoriteContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 10,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "bold",
  },
  imagePickerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#263238",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  actionButton: {
    alignItems: "center",
    marginHorizontal: 16,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#78909C",
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  callButton: {
    borderRadius: 8,
  },
  emailButton: {
    borderRadius: 8,
  },
  contactValue: {
    fontSize: 16,
    color: "#263238",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
  },
  inputOutline: {
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  favoriteButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  dialog: {
    borderRadius: 16,
  },
  deleteButton: {
    marginLeft: 8,
    borderRadius: 8,
  },
});
