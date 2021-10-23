/* eslint-disable consistent-return */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface Image {
  type: string;
  size: number;
}

interface DataResponse {
  imageUrl: string;
  title: string;
  description: string;
}

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      // DONE => REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10Mb: ({ '0': image }: Record<string, Image>) => {
          if (image.size > 10485760) {
            return 'Arquivo deve ser menor que 10MB';
          }
        },
        acceptedFormats: ({ '0': image }: Record<string, Image>) => {
          const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif'];

          if (!acceptedFormats.includes(image.type)) {
            return 'Somente são aceitos arquivos PNG, JPEG e GIF';
          }
        },
      },
    },
    title: {
      // DONE => REQUIRED, MIN AND MAX LENGTH VALIDATIONS
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      // DONE => REQUIRED, MAX LENGTH VALIDATIONS
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // DONE => MUTATION API POST REQUEST,
    async (data: DataResponse) => {
      const response = await api.post('/api/images', {
        ...data,
        url: imageUrl,
      });
      return response.data;
    },
    {
      // DONE => ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();

  const { errors } = formState;

  const onSubmit = async (data: DataResponse): Promise<void> => {
    try {
      // DONE => SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });

        // eslint-disable-next-line no-useless-return
        return;
      }

      // DONE => EXECUTE ASYNC MUTATION
      await mutation.mutateAsync(data);

      // DONE => SHOW SUCCESS TOAST
      toast({
        status: 'success',
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });
    } catch {
      // DONE => SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Imagem não adicionada',
        description: 'Ocorreu um erro ao cadastrar a imagem.',
      });
    } finally {
      // DONE => CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // DONE => SEND IMAGE ERRORS
          error={errors.image}
          // DONE => REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          // DONE => SEND TITLE ERRORS
          error={errors.title}
          // DONE => REGISTER TITLE INPUT WITH VALIDATIONS
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          // DONE => SEND DESCRIPTION ERRORS
          error={errors.description}
          // DONE => REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
