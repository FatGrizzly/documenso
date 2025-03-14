'use server';

import path from 'node:path';
import { PDFDocument } from 'pdf-lib';

import { prisma } from '@documenso/prisma';
import { DocumentStatus, SigningStatus } from '@documenso/prisma/client';

import { getFile } from '../../universal/upload/get-file';
import { putFile } from '../../universal/upload/put-file';
import { insertFieldInPDF } from '../pdf/insert-field-in-pdf';

export type SealDocumentOptions = {
  documentId: number;
};

export const sealDocument = async ({ documentId }: SealDocumentOptions) => {
  'use server';

  const document = await prisma.document.findFirstOrThrow({
    where: {
      id: documentId,
    },
    include: {
      documentData: true,
    },
  });

  const { documentData } = document;

  if (!documentData) {
    throw new Error(`Document ${document.id} has no document data`);
  }

  if (document.status !== DocumentStatus.COMPLETED) {
    throw new Error(`Document ${document.id} has not been completed`);
  }

  const recipients = await prisma.recipient.findMany({
    where: {
      documentId: document.id,
    },
  });

  if (recipients.some((recipient) => recipient.signingStatus !== SigningStatus.SIGNED)) {
    throw new Error(`Document ${document.id} has unsigned recipients`);
  }

  const fields = await prisma.field.findMany({
    where: {
      documentId: document.id,
    },
    include: {
      Signature: true,
    },
  });

  if (fields.some((field) => !field.inserted)) {
    throw new Error(`Document ${document.id} has unsigned fields`);
  }

  // !: Need to write the fields onto the document as a hard copy
  const pdfData = await getFile(documentData);

  const doc = await PDFDocument.load(pdfData);

  for (const field of fields) {
    await insertFieldInPDF(doc, field);
  }

  const pdfBytes = await doc.save();

  const { name, ext } = path.parse(document.title);

  const { data: newData } = await putFile({
    name: `${name}_signed${ext}`,
    type: 'application/pdf',
    arrayBuffer: async () => Promise.resolve(Buffer.from(pdfBytes)),
  });

  await prisma.documentData.update({
    where: {
      id: documentData.id,
    },
    data: {
      data: newData,
    },
  });
};
