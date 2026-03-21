import React from 'react';
import EntityManagerPage from '../components/EntityManagerPage';
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} from '../api/contactsApi';

const initialForm = {
  full_name: '',
  email: '',
  phone: ''
};

export default function Contacts() {
  return (
    <EntityManagerPage
      title="Contacts"
      heading="Contacts Manager"
      description="Create, edit, and remove contacts stored in the local backend database."
      initialForm={initialForm}
      fields={[
        { name: 'full_name', type: 'text', placeholder: 'Full Name' },
        { name: 'email', type: 'email', placeholder: 'Email' },
        { name: 'phone', type: 'text', placeholder: 'Phone' }
      ]}
      requiredFieldName="full_name"
      requiredMessage="Full name is required"
      listTitle="Saved Contacts"
      emptyText="No contacts yet."
      loadItems={getContacts}
      createItem={createContact}
      updateItem={updateContact}
      deleteItem={deleteContact}
      getItemTitle={(contact) => contact.full_name}
      getItemDetails={(contact) => [contact.email || 'No email', contact.phone || 'No phone']}
      toForm={(contact) => ({
        full_name: contact.full_name || '',
        email: contact.email || '',
        phone: contact.phone || ''
      })}
      toPayload={(form) => ({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim()
      })}
      singularLabel="Contact"
    />
  );
}
