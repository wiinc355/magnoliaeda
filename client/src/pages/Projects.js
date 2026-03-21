import React from 'react';
import EntityManagerPage from '../components/EntityManagerPage';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../api/projectsApi';

const initialForm = {
  name: '',
  description: ''
};

export default function Projects() {
  return (
    <EntityManagerPage
      title="Projects"
      heading="Projects Manager"
      description="Create, edit, and remove projects stored in the local backend database."
      initialForm={initialForm}
      fields={[
        { name: 'name', type: 'text', placeholder: 'Project Name' },
        { name: 'description', type: 'textarea', placeholder: 'Description', rows: 4 }
      ]}
      requiredFieldName="name"
      requiredMessage="Project name is required"
      listTitle="Saved Projects"
      emptyText="No projects yet."
      loadItems={getProjects}
      createItem={createProject}
      updateItem={updateProject}
      deleteItem={deleteProject}
      getItemTitle={(project) => project.name}
      getItemDetails={(project) => [project.description || 'No description']}
      toForm={(project) => ({
        name: project.name || '',
        description: project.description || ''
      })}
      toPayload={(form) => ({
        name: form.name.trim(),
        description: form.description.trim()
      })}
      singularLabel="Project"
    />
  );
}
