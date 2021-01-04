import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  return (
    <Box>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => console.log(values)}
      >
        {(values, handleChange) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor='username'>User name</FormLabel>
              <Input
                id='username'
                placeholder='Enter your Username'
                value={values.username}
                onChange={handleChange}
              />
              {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
