import { ModalDialog } from 'app/components/modal-dialog';
import { TestViewer } from 'app/components/test-viewer';
import { TestModel } from 'app/constants/test-model';
import React from 'react';

export interface PreviewStateProps {
  test: TestModel | undefined;
  openState: boolean;
}

interface Props {
  test: TestModel | undefined;
  openState: boolean;
  onClose: () => void;
}

export const PreviewTestDialog = (props: Props): JSX.Element | null => {
  const { test, onClose, openState } = props;

  if (!test) {
    return null;
  }

  return (
    <ModalDialog
      maxWidth="lg"
      isOpen={openState}
      handleClose={onClose}
      title="Превью теста"
      closeText="Закрыть"
    >
      <TestViewer test={test} />
    </ModalDialog>
  );
};
