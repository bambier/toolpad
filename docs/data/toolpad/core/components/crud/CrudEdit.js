import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DataSourceCache, Edit } from '@toolpad/core/Crud';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';

const NAVIGATION = [
  {
    segment: 'people',
    title: 'People',
    icon: <PersonIcon />,
    pattern: 'people{/:personId}*',
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

let peopleStore = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 6, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 7, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export const peopleDataSource = {
  fields: [
    { field: 'id', headerName: 'ID' },
    {
      field: 'firstName',
      headerName: 'First name',
    },
    {
      field: 'lastName',
      headerName: 'Last name',
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
    },
  ],
  getOne: async (personId) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    const personToShow = peopleStore.find(
      (person) => person.id === Number(personId),
    );

    if (!personToShow) {
      throw new Error('Person not found');
    }
    return personToShow;
  },
  updateOne: async (personId, data) => {
    // Simulate loading delay
    await new Promise((resolve) => {
      setTimeout(resolve, 750);
    });

    let updatedPerson = null;

    peopleStore = peopleStore.map((person) => {
      if (person.id === Number(personId)) {
        updatedPerson = { ...person, ...data };
        return updatedPerson;
      }
      return person;
    });

    if (!updatedPerson) {
      throw new Error('Person not found');
    }
    return updatedPerson;
  },
  validate: (formValues) => {
    let issues = [];

    if (!formValues.firstName) {
      issues = [
        ...issues,
        { message: 'First name is required', path: ['firstName'] },
      ];
    }
    if (!formValues.lastName) {
      issues = [...issues, { message: 'Last name is required', path: ['lastName'] }];
    }
    if (!formValues.age) {
      issues = [...issues, { message: 'Age is required', path: ['age'] }];
    } else if (formValues.age <= 0) {
      issues = [
        ...issues,
        { message: 'Must be at least 1 year old', path: ['age'] },
      ];
    }

    return { issues };
  },
};

const peopleCache = new DataSourceCache();

function CrudEdit(props) {
  const { window } = props;

  const router = useDemoRouter('/people/1/edit');

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  const handleSubmitSuccess = React.useCallback(() => {
    console.log('Person edited successfully');
  }, []);

  return (
    // Remove this provider when copying and pasting into your project.
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout defaultSidebarCollapsed>
          {/* preview-start */}
          <Edit
            id={1}
            dataSource={peopleDataSource}
            dataSourceCache={peopleCache}
            onSubmitSuccess={handleSubmitSuccess}
            pageTitle="Person 1 - Edit"
          />
          {/* preview-end */}
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

CrudEdit.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default CrudEdit;
