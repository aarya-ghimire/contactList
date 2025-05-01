import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import {
  Text,
  Searchbar,
  FAB,
  ActivityIndicator,
  Portal,
  Dialog,
  Button,
  Chip,
  useTheme,
  Divider,
  Surface,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FontAwesome } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { Contact, useContacts } from "../context/ContactContext";
import ContactListItem from "../components/ContactListItem";

const emptyContactsSvg = `
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="60" fill="#F5F7FA"/>
  <circle cx="60" cy="45" r="20" fill="#D1D9E6"/>
  <path d="M100 100C100 87.4 82.1 77 60 77C37.9 77 20 87.4 20 100" stroke="#D1D9E6" stroke-width="8"/>
  <circle cx="60" cy="45" r="12" fill="#A7B7CC"/>
</svg>
`;

export default function ContactsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { contacts, loading, deleteContact, toggleFavorite } = useContacts();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortByName, setSortByName] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        (contact.email &&
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()));

      if (showOnlyFavorites) {
        return matchesSearch && contact.isFavorite;
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortByName) {
        return a.name.localeCompare(b.name);
      }
      return 0; // No sorting
    });

  const handleContactPress = (contact: Contact) => {
    router.push({ pathname: "/contact/[id]", params: { id: contact.id } });
  };

  const handleDeleteContact = async (id: string) => {
    setContactToDelete(id);
  };

  const confirmDelete = async () => {
    if (contactToDelete) {
      await deleteContact(contactToDelete);
      setContactToDelete(null);
    }
  };

  const cancelDelete = () => {
    setContactToDelete(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          animating={true}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style="light" />

      <Surface style={styles.headerSection} elevation={0}>
        <Text style={styles.headerTitle}>Your Contacts</Text>
        <Text style={styles.headerSubtitle}>
          {contacts.length} Total Contacts
        </Text>

        <Searchbar
          placeholder="Search contacts..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
          inputStyle={{ fontSize: 16 }}
          elevation={2}
        />

        <View style={styles.filterContainer}>
          <Chip
            selected={sortByName}
            onPress={() => setSortByName(!sortByName)}
            style={styles.chip}
            selectedColor={theme.colors.primary}
            icon={
              sortByName ? "sort-variant-remove" : "sort-alphabetical-ascending"
            }
          >
            {sortByName ? "Unsort" : "Sort by name"}
          </Chip>

          <Chip
            selected={showOnlyFavorites}
            onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
            style={styles.chip}
            selectedColor={theme.colors.primary}
            icon="star"
          >
            Favorites
          </Chip>
        </View>
      </Surface>

      <Divider />

      {filteredContacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <SvgXml xml={emptyContactsSvg} width={120} height={120} />
          <Text style={styles.emptyTitle}>
            {searchQuery
              ? "No matching contacts"
              : showOnlyFavorites
              ? "No favorite contacts yet"
              : "No contacts yet"}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery
              ? "Try a different search term"
              : showOnlyFavorites
              ? "Mark your important contacts as favorites"
              : "Get started by adding your first contact"}
          </Text>
          {!searchQuery && !showOnlyFavorites && (
            <Button
              mode="contained"
              onPress={() => router.push("/contact/new")}
              style={styles.emptyButton}
              icon="plus"
            >
              Add Contact
            </Button>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactListItem
              contact={item}
              onPress={handleContactPress}
              onDelete={handleDeleteContact}
              onToggleFavorite={toggleFavorite}
            />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => router.push("/contact/new")}
        label="Add"
        color="#FFFFFF"
      />

      <Portal>
        <Dialog
          visible={!!contactToDelete}
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
  headerSection: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#263238",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#78909C",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    height: 36,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 80, // Add padding for FAB
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: "#263238",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#78909C",
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dialog: {
    borderRadius: 12,
  },
  deleteButton: {
    marginLeft: 8,
    borderRadius: 4,
  },
});
