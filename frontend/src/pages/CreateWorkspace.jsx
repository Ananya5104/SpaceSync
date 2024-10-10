import React from 'react'
import WorkspaceForm from '../components/WorkspaceForm';
import NavBarOwner from '../components/NavBarOwner';

const CreateWorkspace = () => {
    const token = localStorage.getItem('jwtToken');
  return (
    <div>
        <NavBarOwner/>
        <WorkspaceForm />
    </div>
  )
}

export default CreateWorkspace