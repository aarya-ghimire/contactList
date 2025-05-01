import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Surface,
  useTheme,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContacts } from "../../context/ContactContext";
import { contactSchema } from "../../utils/validation";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type FormData = {
  name: string;
  phone: string;
  email: string;
  imageUri?: string;
};

export default function NewContactScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addContact } = useContacts();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      imageUri: "",
    },
    resolver: yupResolver(contactSchema),
  });

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
    try {
      await addContact({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email ? data.email.trim() : undefined,
        imageUri: data.imageUri,
        isFavorite: false,
      });

      router.back();
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Surface style={styles.formCard} elevation={1}>
          <Text style={styles.title}>New Contact</Text>
          <Text style={styles.subtitle}>Enter contact details below</Text>

          {/* Profile Picture Selection */}
          <TouchableOpacity
            style={styles.imagePickerContainer}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="account-circle"
                  size={80}
                  color={theme.colors.primary}
                />
                <Text style={styles.addPhotoText}>Add Photo</Text>
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
                  label="Full Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  error={!!errors.name}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon="account" />}
                  placeholder="John Doe"
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
                  label="Phone Number"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  keyboardType="phone-pad"
                  error={!!errors.phone}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon="phone" />}
                  placeholder="+1 (555) 123-4567"
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
                  label="Email Address (optional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  mode="outlined"
                  keyboardType="email-address"
                  error={!!errors.email}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon="email" />}
                  placeholder="example@email.com"
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
              onPress={() => router.back()}
              style={styles.cancelButton}
              contentStyle={styles.buttonContent}
              icon="close"
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={[
                styles.saveButton,
                { backgroundColor: theme.colors.primary },
              ]}
              contentStyle={styles.buttonContent}
              loading={isSubmitting}
              icon="check"
              disabled={isSubmitting}
            >
              Save
            </Button>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  formCard: {
    padding: 24,
    borderRadius: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#263238",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: "#78909C",
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
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  addPhotoText: {
    marginTop: 4,
    fontSize: 14,
    color: "#78909C",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "transparent",
  },
  inputOutline: {
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
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
});
