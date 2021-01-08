import { Box, Flex, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';

const EditPost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;

  const [updatePost] = useUpdatePostMutation();

  const { data, loading, error } = usePostQuery({
    skip: intId === -1,
    variables: { id: intId },
  });

  if (loading) {
    return (
      <Layout varaint='regular'>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout varaint='regular'>
        <Box>Could not find the post</Box>
      </Layout>
    );
  }

  return (
    <Layout varaint='small'>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({
            variables: { id: intId, text: values.text, title: values.title },
          });
          router.back();
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <InputField
              name='title'
              placeholder='title'
              label='Title'
              value={values.title}
            />
            <Box mt={4}>
              <InputField
                name='text'
                placeholder='text'
                label='Text'
                value={values.text}
              />
            </Box>
            <Flex>
              <Button
                color='teal'
                mt={4}
                type='submit'
                isLoading={isSubmitting}
              >
                update post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default EditPost;
