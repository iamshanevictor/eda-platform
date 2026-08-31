'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { AccessibleModal } from '@/components/ui/accessible-modal';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  datasetName: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  datasetName,
  isDeleting = false
}: DeleteConfirmationDialogProps) {
  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={isDeleting ? () => {} : onClose}
      labelledBy="delete-dataset-title"
      describedBy="delete-dataset-description"
      panelClassName="max-w-md"
    >
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle id="delete-dataset-title" className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Delete Dataset
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isDeleting}
              className="h-8 w-8 p-0"
              aria-label="Close delete confirmation"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p id="delete-dataset-description" className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete this dataset?
            </p>
            <div className="rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/40">
              <p className="break-all font-medium text-red-800 dark:text-red-200">{datasetName}</p>
            </div>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p>This action will permanently delete:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>The dataset and all its data</li>
                <li>All analysis results and visualizations</li>
                <li>Any generated reports</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Dataset
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AccessibleModal>
  );
}
