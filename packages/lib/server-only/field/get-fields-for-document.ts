import { prisma } from '@documenso/prisma';

export interface GetFieldsForDocumentOptions {
  documentId: number;
  userId: number;
}

export const getFieldsForDocument = async ({ documentId, userId }: GetFieldsForDocumentOptions) => {
  const fields = await prisma.field.findMany({
    where: {
      documentId,
      Document: {
        userId,
      },
    },
  });

  return fields;
};
